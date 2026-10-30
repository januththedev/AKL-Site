import { z } from 'zod';
import { answerQuestion } from '@/lib/server/chat';
import { apiError, assertSameOrigin, boundedJson, rateLimit } from '@/lib/server/http';
export async function POST(request:Request){try{await assertSameOrigin(request);const data=z.object({message:z.string().trim().min(1).max(1200),locale:z.enum(['en','si','ta']).default('en')}).strict().parse(await boundedJson(request,7000));await rateLimit('chat',20);return Response.json({ok:true,data:await answerQuestion(data.message,data.locale)},{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
