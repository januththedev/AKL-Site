import 'server-only';
import { Pool, type PoolClient, type QueryResultRow } from 'pg';

let pool: Pool | undefined;
export function databaseConfigured() { return Boolean(process.env.DATABASE_URL); }
export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 4, idleTimeoutMillis: 20000, connectionTimeoutMillis: 7000, statement_timeout: 10000, query_timeout: 12000 });
  return pool;
}
export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, values: unknown[] = []) { return getPool().query<T>(sql, values); }
export async function transaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try { await client.query('BEGIN'); const value = await fn(client); await client.query('COMMIT'); return value; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function audit(client: PoolClient, actor: string, action: string, resource: string, detail: unknown = {}) {
  await client.query('INSERT INTO akl.audit_events(actor_id,action,resource_id,detail) VALUES($1,$2,$3,$4)', [actor,action,resource,JSON.stringify(detail)]);
}
