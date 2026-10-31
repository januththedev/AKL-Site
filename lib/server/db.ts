import 'server-only';
import { Pool, type PoolClient, type QueryResultRow } from 'pg';

let pool: Pool | undefined;
export function databaseConfigured() { return Boolean(process.env.DATABASE_URL); }
export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 4, idleTimeoutMillis: 20000, connectionTimeoutMillis: 7000, statement_timeout: 10000, query_timeout: 12000 });
    // An idle client error (e.g. the server closing a connection) must not crash the process.
    pool.on('error', error => console.error('pg pool error', (error as {code?:string}).code || error.name));
  }
  return pool;
}
export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, values: unknown[] = []) { return getPool().query<T>(sql, values); }
export async function transaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  let broken = false;
  try { await client.query('BEGIN'); const value = await fn(client); await client.query('COMMIT'); return value; }
  catch (error) {
    try { await client.query('ROLLBACK'); } catch { broken = true; }
    throw error;
  }
  finally { client.release(broken); }
}
export async function audit(client: PoolClient, actor: string, action: string, resource: string, detail: unknown = {}) {
  await client.query('INSERT INTO akl.audit_events(actor_id,action,resource_id,detail) VALUES($1,$2,$3,$4)', [actor,action,resource,JSON.stringify(detail)]);
}
