import { getAuth } from '@/lib/server/auth';
import { apiError } from '@/lib/server/http';
type Context={params:Promise<{path:string[]}>};
export async function GET(request:Request,context:Context){try{return await getAuth().handler().GET(request,context);}catch(e){return apiError(e);}}
export async function POST(request:Request,context:Context){try{return await getAuth().handler().POST(request,context);}catch(e){return apiError(e);}}
