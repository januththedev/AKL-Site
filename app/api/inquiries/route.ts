import { inquirySchema } from '@/lib/validation';
import { portfolioSlugSchema } from '@/lib/portfolioValidation';
import { apiError, assertSameOrigin, boundedJson, rateLimit } from '@/lib/server/http';
import { query } from '@/lib/server/db';
export async function POST(request:Request){try{await assertSameOrigin(request);
 // Optional private-link slug from /for/<slug>. It is only a lookup key: it is split off before the strict inquiry schema, an unknown or malformed value is ignored (the inquiry still succeeds), and nothing else is taken from the client.
 const raw=await boundedJson(request,20000);const {portfolioSlug,...fields}=(raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}) as Record<string,unknown>;const slug=portfolioSlugSchema.safeParse(portfolioSlug);
 const data=inquirySchema.parse(fields);
 // Honeypot filled: answer like a success so bots learn nothing; store nothing.
 if(data.website)return Response.json({ok:true,data:{id:crypto.randomUUID()}},{status:201,headers:{'Cache-Control':'no-store'}});await rateLimit('inquiry',5,3600);const {idempotencyKey,website,consent,...payload}=data;
 const {rows}=slug.success
  ?await query<{id:string}>('INSERT INTO akl.inquiries(idempotency_key,payload,portfolio_link_id) VALUES($1,$2,(SELECT id FROM akl.portfolio_links WHERE slug=$3)) ON CONFLICT(idempotency_key) DO UPDATE SET idempotency_key=EXCLUDED.idempotency_key RETURNING id',[idempotencyKey,JSON.stringify(payload),slug.data])
  :await query<{id:string}>('INSERT INTO akl.inquiries(idempotency_key,payload) VALUES($1,$2) ON CONFLICT(idempotency_key) DO UPDATE SET idempotency_key=EXCLUDED.idempotency_key RETURNING id',[idempotencyKey,JSON.stringify(payload)]);
 return Response.json({ok:true,data:{id:rows[0].id}},{status:201,headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
