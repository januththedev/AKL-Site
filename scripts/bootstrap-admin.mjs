import { loadEnvConfig } from '@next/env';
import { Pool } from 'pg';
loadEnvConfig(process.cwd());
const id=process.env.BOOTSTRAP_OWNER_AUTH_USER_ID;
if(!id||!process.env.DATABASE_URL)throw new Error('Set the AKL DATABASE_URL and verified BOOTSTRAP_OWNER_AUTH_USER_ID. No default account is created.');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1});const c=await pool.connect();
try{
 await c.query('BEGIN');await c.query('SELECT pg_advisory_xact_lock(6031980)');
 if(Number((await c.query("SELECT count(*) FROM akl.admin_memberships WHERE role='super_admin' AND active=true")).rows[0].count))throw new Error('An active Super Admin already exists; use the invited-staff workflow.');
 const columns=(await c.query("SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='neon_auth' AND table_name IN ('user','users')")).rows;
 const table=['user','users'].find(t=>columns.some(x=>x.table_name===t));
 const verified=['emailVerified','email_verified'].find(v=>columns.some(x=>x.table_name===table&&x.column_name===v));
 if(!table||!verified)throw new Error('Unable to verify the managed Auth identity schema. Confirm current Neon schema before bootstrapping.');
 // Identifiers are selected exclusively from fixed allowlists above, never user input.
 const user=(await c.query(`SELECT id,email,name,"${verified}" AS verified FROM neon_auth."${table}" WHERE id=$1`,[id])).rows[0];
 if(!user||user.verified!==true)throw new Error('The owner must exist in this Neon branch and have a verified email.');
 const row=(await c.query("INSERT INTO akl.admin_memberships(auth_user_id,email,display_name,role) VALUES($1,$2,$3,'super_admin') RETURNING id",[user.id,user.email,user.name||''])).rows[0];
 await c.query("INSERT INTO akl.audit_events(actor_id,action,resource_id) VALUES($1,'owner.bootstrapped',$1)",[row.id]);
 await c.query('COMMIT');console.log('First Super Admin created from the verified Neon identity.');
}catch(error){await c.query('ROLLBACK');console.error(error.message.startsWith('An active')||error.message.startsWith('The owner')||error.message.startsWith('Unable to')?error.message:'Bootstrap failed. Check schema and identity configuration; no credentials are printed.');process.exitCode=1;}finally{c.release();await pool.end();}
