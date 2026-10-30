import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMember } from '@/lib/server/auth';
import { getDraft } from '@/lib/server/content';
import { Header, Footer } from '@/components/SiteChrome';
import { HomeView } from '@/components/HomeView';
import '@/components/admin/admin.css';
export default async function PreviewPage(){try{await requireMember('preview');}catch{redirect('/admin');}const {content,version}=await getDraft();return <><div className="admin-preview-bar"><span>PRIVATE DRAFT PREVIEW / VERSION {version} — not the live website.</span><Link href="/admin">Back to workspace ↗</Link></div><Header settings={content.settings}/><main><HomeView content={content}/></main><Footer settings={content.settings}/></>;}
