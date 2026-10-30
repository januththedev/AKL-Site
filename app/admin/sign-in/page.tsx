import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/AuthForms';
import { authConfigured, currentMember } from '@/lib/server/auth';
export default async function SignInPage(){if(!authConfigured())redirect('/admin');if(await currentMember())redirect('/admin');return <section className="setup-page"><div className="setup-card"><Link href="/"><img src="/brand/AKL-Official-Logo-200.png" alt="AKL" width="90" height="90"/></Link><span className="eyebrow" style={{marginTop:30}}>THE PEOPLE BEHIND THE WEBSITE</span><h1>Welcome back.</h1><p>Sign in with your invited staff account. Access is controlled by your active AKL membership.</p><SignInForm/><div className="signin-links"><Link href="/">← Back to the website</Link><span>Invite-only staff access</span></div></div></section>;}
