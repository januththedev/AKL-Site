import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { z } from 'zod';
import ts from 'typescript';

// Exercise the real completion function, injecting storage/database boundaries only.
// This avoids importing server-only auth/database integrations into the unit runner.
const source = readFileSync(new URL('../../lib/server/media.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const body = compiled.slice(compiled.indexOf('export async function completeUpload')).replace('export async function completeUpload', 'async function completeUpload');
const createCompletion = new Function('z', 'query', 'storage', 'GetObjectCommand', 'PutObjectCommand', 'DeleteObjectCommand', 'MAX', 'sharp', 'randomUUID', 'publicUrl', 'createHash', 'transaction', 'audit', 'bucket', `${body}; return completeUpload;`);
class Get { constructor(public input: unknown) {} }
class Put { constructor(public input: {Key:string;Body:Uint8Array}) {} }
class Delete { constructor(public input: unknown) {} }
async function scenario(failure: 'cleanup' | 'processing' | 'invalid' | null) {
 const bytes = failure === 'invalid' ? Buffer.from('not an image') : await sharp({create:{width:240,height:180,channels:3,background:'#0b3d32'}}).png().toBuffer();
 const states: string[] = [], puts: {Key:string;Body:Uint8Array}[] = [], events: string[] = [];
 const query = async (sql: string) => {
  if (sql.startsWith('SELECT')) return {rows:[{object_key:'staging/test',byte_size:bytes.length,content_type:'image/png'}]};
  if (sql.includes("state='ready'")) states.push('ready');
  if (sql.includes("state='failed'")) states.push('failed');
  return {rows:[]};
 };
 const storage = {send:async (command: Get | Put | Delete) => {
  if (command instanceof Get) return {ContentLength:bytes.length,Body:{transformToByteArray:async()=>bytes}};
  if (command instanceof Delete) {events.push('cleanup');if(failure==='cleanup')throw new Error('Cleanup outage');return {};}
  const input=(command as Put).input;
  if(failure==='processing'&&input.Key.endsWith('-640.webp'))throw new Error('Variant write failed');
  puts.push(input);return {};
 }};
 const complete = createCompletion(z,query,()=>storage,Get,Put,Delete,8*1024*1024,sharp,randomUUID,(key:string)=>`https://assets.example/${key}`,createHash,async(fn:(client:unknown)=>unknown)=>{const result=await fn({query});events.push('commit');return result;},async()=>{},()=> 'test-bucket');
 return {run:()=>complete({id:'test-member'},'7f5ceec5-132a-4210-83d5-58eb50bd02b6'),states,puts,events};
}
test('staging cleanup outage returns a usable asset and never marks a committed upload failed',async()=>{
 const s=await scenario('cleanup');const result=await s.run();
 assert.match(result.url,/-1440\.webp$/);assert.deepEqual(s.states,['ready']);assert.deepEqual(s.events,['commit','cleanup']);
 const variants=s.puts.filter(x=>x.Key.endsWith('.webp'));assert.equal(variants.length,3);
 for(const variant of variants)assert.equal((await sharp(variant.Body).metadata()).format,'webp');
});
test('a failed variant write fails processing without reporting success or attempting cleanup',async()=>{
 const s=await scenario('processing');await assert.rejects(s.run(),/Variant write failed/);assert.deepEqual(s.states,['failed']);assert.deepEqual(s.events,[]);
});
test('invalid image bytes are rejected before an original or public variant is written',async()=>{
 const s=await scenario('invalid');await assert.rejects(s.run());assert.deepEqual(s.states,['failed']);assert.equal(s.puts.length,0);
});
test('successful processing commits before deleting the staging object',async()=>{
 const s=await scenario(null);await s.run();assert.deepEqual(s.states,['ready']);assert.deepEqual(s.events,['commit','cleanup']);
});
