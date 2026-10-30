import Link from 'next/link';
import { authConfigured } from '@/lib/server/auth';
import { databaseConfigured } from '@/lib/server/db';
import { findInvitation } from '@/lib/server/members';
import { InviteForm } from '@/components/AuthForms';
export const metadata={title:'Accept staff invitation',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function InvitationPage({params}:{params:Promise<{token:string}>}){const {token}=await params;const invitation=authConfigured()&&databaseConfigured()?await findInvitation(token):null;return <section className="setup-page"><div className="setup-card"><Link href="/"><img src="/brand/AKL-Official-Logo-200.png" width="90" height="90" alt="AKL"/></Link><span className="eyebrow" style={{marginTop:25}}>THE TEAM BEHIND WHAT COMES NEXT</span><h1>{invitation?'You’re invited.':'This invitation is unavailable.'}</h1>{invitation?<InviteForm token={token} email={invitation.email} role={invitation.intended_role}/>:<p>The invitation may have expired, been revoked, or the service is not configured. Ask a Super Admin for a new link.</p>}</div></section>;}
