import { loadEnvConfig } from '@next/env';
import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
loadEnvConfig(process.cwd());
const url=process.env.DATABASE_URL_UNPOOLED||process.env.DATABASE_URL;
if(!url)throw new Error('Set the AKL DATABASE_URL before running migrations.');
const pool=new Pool({connectionString:url,max:1});const c=await pool.connect();
try{
 await c.query('BEGIN');await c.query('SELECT pg_advisory_xact_lock(6031979)');
 await c.query('CREATE TABLE IF NOT EXISTS public.akl_migrations(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())');
 for(const file of (await readdir('db/migrations')).filter(x=>x.endsWith('.sql')).sort()){
  const sql=await readFile(`db/migrations/${file}`,'utf8'),hash=createHash('sha256').update(sql).digest('hex');
  const row=(await c.query('SELECT sha256 FROM public.akl_migrations WHERE name=$1',[file])).rows[0];
  if(row){if(row.sha256!==hash)throw new Error(`Applied migration changed: ${file}. Add a new migration instead.`);continue;}
  await c.query(sql);await c.query('INSERT INTO public.akl_migrations(name,sha256) VALUES($1,$2)',[file,hash]);console.log(`Applied ${file}`);
 }
 await c.query('COMMIT');console.log('Migrations complete.');
}catch(error){await c.query('ROLLBACK');console.error('Migration failed. No connection details are printed.');process.exitCode=1;}finally{c.release();await pool.end();}
