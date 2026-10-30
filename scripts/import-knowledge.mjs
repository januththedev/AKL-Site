import { loadEnvConfig } from '@next/env';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';
loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL)throw new Error('Set the AKL DATABASE_URL.');
const facts=JSON.parse(await readFile('content/company-facts.json','utf8'));
const refs=new Map(facts.facts.map(x=>[x.id,x]));
const evidence=ids=>[...new Map(ids.map(id=>{const f=refs.get(id);if(!f)throw new Error('Missing fact reference');const src=facts.sources[f.sourceId];const ref={sourceId:src.url||'Company profile, November 2025',page:f.page};return [JSON.stringify(ref),ref];})).values()];
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});let count=0;
try{for(const line of (await readFile('content/faq-seed.jsonl','utf8')).trim().split('\n')){const x=JSON.parse(line);await pool.query("INSERT INTO akl.knowledge_entries(id,topic,locale,question,answer,aliases,source_refs,actions,state) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'draft') ON CONFLICT(id) DO NOTHING",[x.id,x.topic,x.locale,x.question,x.answer,JSON.stringify(x.aliases),JSON.stringify(evidence(x.factIds)),JSON.stringify(x.actions)]);count++;}console.log(`Processed ${count} source-backed draft FAQs. Review original evidence and approve before publication.`);}catch{console.error('Knowledge import failed. No credentials are printed.');process.exitCode=1;}finally{await pool.end();}
