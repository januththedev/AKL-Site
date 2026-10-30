import { z } from 'zod';
import { acceptInvitation } from '@/lib/server/members';
import { apiError, assertSameOrigin, boundedJson, rateLimit } from '@/lib/server/http';
export async function POST(request:Request){try{await assertSameOrigin(request);await rateLimit('invitation',10,3600);const {token}=z.object({token:z.string().regex(/^[a-f0-9]{64}$/)}).strict().parse(await boundedJson(request,3000));return Response.json({ok:true,data:await acceptInvitation(token)},{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
