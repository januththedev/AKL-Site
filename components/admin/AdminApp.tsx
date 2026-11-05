'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, BookOpen, Send, Users, ShieldCheck, RefreshCw, Check, LoaderCircle, Plus, Upload, Copy, ExternalLink, Link2, Mail, MessageCircle, Pencil, Trash2, CircleAlert, CircleCheck, Circle, ArrowUp, ArrowDown, Undo2 } from 'lucide-react';
import type { Member, SiteContent, KnowledgeEntry, Inquiry, PortfolioLinkRow } from '@/lib/types';
import { can } from '@/lib/policy';
import { portfolioEmailText, portfolioWhatsAppUrl } from '@/lib/portfolioValidation';
import { INTRO_FRAME_LIMIT, colomboToday, diffContent, errorsFor, groupChanges, introPlan, validateMomentFields, type IntroPlan, type MomentFieldErrors } from '@/lib/contentDiff';
import { SignOutButton } from '@/components/AuthForms';
import { api, putWithProgress, useResource, SESSION_EVENT } from './adminApi';
import { stepState, storageUploadMessage, toMessage, toProblem, UPLOAD_STEPS, type UploadStage } from './adminErrors';
import { useDraftEditor, type DraftEditor } from './useDraftEditor';
import './admin.css';

type Media={id:string;original_filename:string;alt_text:string;credit:string;state:string;variants:Record<string,string>;focal_points:{desktop:{x:number;y:number};mobile:{x:number;y:number}}};
function Notice({message,error=false}:{message:string;error?:boolean}){return message?<p className={`admin-notice ${error?'error':''}`} role={error?'alert':'status'}>{message}</p>:null;}
function Loading(){return <div className="admin-loading"><LoaderCircle size={20} className="spin"/> Loading the workspace…</div>;}
function formatDate(value:string){return new Date(value).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Colombo'});}
const sections=[{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'content',label:'Pages & content',icon:FileText},{id:'media',label:'Media library',icon:ImageIcon},{id:'moments',label:'Moments gallery',icon:ImageIcon},{id:'inquiries',label:'Employer inquiries',icon:MessageSquare},{id:'portfolio',label:'Portfolio links',icon:Link2},{id:'knowledge',label:'Knowledge & assistant',icon:BookOpen},{id:'publishing',label:'Publishing',icon:Send},{id:'access',label:'Staff & access',icon:Users,super:true},{id:'audit',label:'Activity log',icon:ShieldCheck,super:true}];
/** Sections that edit the shared site draft. Edits are kept while moving between them. */
const DRAFT_SECTIONS=['content','moments'];

export function AdminApp({member}:{member:Member}){
 const [section,setSection]=useState('overview'),[expired,setExpired]=useState<string|null>(null);
 const editor=useDraftEditor(DRAFT_SECTIONS.includes(section));
 const current=sections.find(x=>x.id===section)!;
 useEffect(()=>{const onExpired=(e:Event)=>setExpired(String((e as CustomEvent).detail||'session'));window.addEventListener(SESSION_EVENT,onExpired);return ()=>window.removeEventListener(SESSION_EVENT,onExpired);},[]);
 function goTo(id:string){
  if(id===section)return;
  if(DRAFT_SECTIONS.includes(section)&&!DRAFT_SECTIONS.includes(id)&&editor.dirty&&!window.confirm(`You have ${editor.changeCount} unsaved draft ${editor.changeCount===1?'change':'changes'}.\n\nThey stay in this browser tab while you browse, but they are not saved or published, and they are lost if you reload or close the page.\n\nLeave the editor anyway?`))return;
  editor.clearStatus();setSection(id);
 }
 return <div className="admin-app"><aside className="admin-sidebar"><Link href="/" className="admin-brand"><img src="/brand/AKL-Official-Logo-200.png" width="53" height="53" alt="AKL"/><span>AL-KARRIM LANKA<small>STAFF WORKSPACE</small></span></Link><div className="admin-workspace-label">YOUR WORKSPACE</div><nav aria-label="Staff workspace">{sections.filter(x=>!x.super||member.role==='super_admin').map(x=><button key={x.id} className={section===x.id?'active':''} onClick={()=>goTo(x.id)}><x.icon size={17}/>{x.label}{DRAFT_SECTIONS.includes(x.id)&&editor.dirty?<span className="admin-unsaved-dot" title="Unsaved changes" aria-label="Unsaved changes"/>:x.super&&<span className="restricted-dot"/>}</button>)}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank">View website<ArrowUpRight size={16}/></Link><div className="admin-user"><span>{(member.display_name||member.email).slice(0,1).toUpperCase()}</span><div><strong>{member.display_name||member.email}</strong><small>{member.role==='super_admin'?'Super Admin':'Admin'}</small></div></div><SignOutButton/></div></aside><div className="admin-main"><header className="admin-topbar"><span>Workspace <span>/</span> {current.label}</span><span className="admin-topbar-right">{editor.dirty&&<button type="button" className="admin-dirty" onClick={()=>goTo('content')} title="Open the editor to save or discard"><Circle size={8} fill="currentColor"/>Unsaved changes · {editor.changeCount}</button>}<span className="admin-role"><ShieldCheck size={13}/>{member.role==='super_admin'?'Super Admin':'Admin'}</span></span></header><div className="admin-content">{expired&&<div className="admin-notice error admin-session-banner" role="alert"><span>{expired==='reauth'?'This action needs a recent sign-in.':'Your session has expired.'} Sign in again in a new tab, then come back here. Anything you typed on this page is kept.</span><span className="admin-inline-actions"><a className="admin-button" href="/admin/sign-in" target="_blank" rel="noopener noreferrer">Sign in again<ExternalLink size={13}/></a><button type="button" className="admin-button ghost" onClick={()=>setExpired(null)}>I have signed in</button></span></div>}<div className="admin-page-heading"><div><span className="eyebrow">AL KARRIM LANKA / CONTENT OPERATIONS</span><h1>{current.label}</h1></div><span className="admin-timezone">Asia / Colombo</span></div>{section==='overview'?<Overview/>:section==='content'?<ContentEditor member={member} editor={editor}/>:section==='moments'?<MomentsEditor editor={editor} goTo={goTo}/>:section==='media'?<MediaLibrary/>:section==='inquiries'?<Inquiries member={member}/>:section==='portfolio'?<PortfolioLinks member={member}/>:section==='knowledge'?<Knowledge member={member}/>:section==='publishing'?<Publishing member={member} editor={editor} goTo={goTo}/>:section==='access'?<Access/>:<Audit/>}</div></div></div>;
}

type State={counts:{inquiries:number;media:number;knowledge:number;releases:number};releaseId:string;storage:boolean;model:boolean};
function Overview(){const r=useResource<State>('state');if(r.loading)return <Loading/>;if(r.error)return <Notice message={r.error} error/>;const d=r.data!;return <><div className="admin-welcome"><span className="eyebrow">THE PEOPLE BEHIND WHAT COMES NEXT</span><h2>Keep the story moving.</h2><p>Fresh content, useful conversations and a clear view of what’s published.</p><Link className="text-link" href="/" target="_blank">Open the public website<ArrowUpRight size={15}/></Link></div><div className="admin-stat-grid">{[['New inquiries',d.counts.inquiries,'Ready for a conversation'],['Media assets',d.counts.media,'Processed and ready'],['Knowledge drafts',d.counts.knowledge,'Waiting for review'],['Published releases',d.counts.releases,'A traceable content history']].map(([label,value,note])=><div key={String(label)} className="admin-stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div><div className="admin-two-columns"><div className="admin-card"><h3>Publication status</h3><p className="admin-subtle">Active release</p><code>{d.releaseId}</code><p>Draft edits remain private until a validated publication is activated. Routine editorial changes and protected settings follow different permissions.</p></div><div className="admin-card"><h3>Connected services</h3><div className="admin-service"><span>Neon database & identity</span><span className="pill good">Connected</span></div><div className="admin-service"><span>Media storage</span><span className={`pill ${d.storage?'good':''}`}>{d.storage?'Configured':'Setup needed'}</span></div><div className="admin-service"><span>OpenRouter generation</span><span className="pill">{d.model?'Configured — test required':'FAQ fallback'}</span></div></div></div></>;}

/* ------------------------------------------------------------------ shared editor pieces */
function FieldError({id,errors}:{id:string;errors:string[]}){return errors.length?<span className="admin-field-error" id={id}><CircleAlert size={12}/>{errors.join(' ')}</span>:null;}
const errId=(path:string)=>`err-${path.replaceAll('.','-')}`;
function TextField({label,path,value,onChange,errors,multiline=false,rows=2,className=''}:{label:string;path:string;value:string;onChange:(value:string)=>void;errors:string[];multiline?:boolean;rows?:number;className?:string}){
 const bad=errors.length>0,aria={'aria-invalid':bad||undefined,'aria-describedby':bad?errId(path):undefined};
 return <label className={className}>{label}{multiline?<textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} {...aria}/>:<input value={value} onChange={e=>onChange(e.target.value)} {...aria}/>}<FieldError id={errId(path)} errors={errors}/></label>;
}
/** One role per line. Keeps the raw text while typing (so Enter can start a new line) and stores the cleaned list in the draft. */
function RolesField({label,path,initial,onChange,errors}:{label:string;path:string;initial:string[];onChange:(roles:string[])=>void;errors:string[]}){
 const [raw,setRaw]=useState(initial.join('\n')),bad=errors.length>0;
 const clean=(text:string)=>text.split('\n').map(x=>x.trim()).filter(Boolean);
 return <label className="span-two">{label}<textarea rows={4} value={raw} onChange={e=>{setRaw(e.target.value);onChange(clean(e.target.value));}} onBlur={()=>setRaw(clean(raw).join('\n'))} aria-invalid={bad||undefined} aria-describedby={bad?errId(path):undefined}/><FieldError id={errId(path)} errors={errors}/></label>;
}
function EditorStatus({editor}:{editor:DraftEditor}){return editor.dirty?<span className="pill warn"><Circle size={7} fill="currentColor"/> Unsaved changes · {editor.changeCount}</span>:<span className="pill good"><CircleCheck size={11}/> All changes saved · version {editor.version}</span>;}
function EditorActions({editor,label='Save draft'}:{editor:DraftEditor;label?:string}){
 return <div className="admin-inline-actions"><button className="admin-button" disabled={editor.busy||!editor.dirty} onClick={()=>void editor.save()}>{editor.busy?<LoaderCircle size={15} className="spin"/>:<Check size={15}/>}{editor.busy?'Saving…':label}</button>{editor.dirty&&<button type="button" className="admin-button ghost" disabled={editor.busy} onClick={()=>{if(window.confirm('Discard all unsaved edits and go back to the last saved draft?'))editor.discard();}}><Undo2 size={13}/>Discard edits</button>}</div>;
}
/** Shown when the server says the draft changed under us (409). The user's edits are never thrown away without a choice. */
function ConflictPanel({editor}:{editor:DraftEditor}){
 const c=editor.conflict;if(!c)return null;
 if(!c.latest)return <div className="admin-notice error admin-conflict" role="alert"><p>The draft changed since you opened it, and the latest version could not be loaded to compare. Your edits are still here.</p><button className="admin-button ghost" onClick={()=>void editor.save()}>Try again</button></div>;
 return <div className="admin-notice error admin-conflict" role="alert"><strong>A newer draft (version {c.latest.version}) was saved by someone else.</strong><p>Your edits are kept. {c.diff.changes.length?`Saving yours would change ${c.diff.changes.length} ${c.diff.changes.length===1?'thing':'things'} in the newer draft:`:'Your edits match the newer draft.'}</p>{c.diff.changes.length>0&&<ChangeList changes={c.diff.changes} max={8}/>}<div className="admin-inline-actions"><button className="admin-button" onClick={()=>editor.keepMine()}>Keep my edits on top of version {c.latest.version}</button><button className="admin-button ghost" onClick={()=>{if(window.confirm('Discard your unsaved edits and load the newer draft?'))editor.adoptLatest();}}>Discard mine, load the newer draft</button></div></div>;
}
function ChangeList({changes,max,showArea=true}:{changes:ReturnType<typeof diffContent>['changes'];max?:number;showArea?:boolean}){
 const shown=max?changes.slice(0,max):changes;
 return <ul className="admin-diff">{shown.map((c,i)=><li key={i} className={c.kind}><span className="admin-diff-kind">{c.kind}</span><span>{showArea&&<><strong>{c.area}</strong> · </>}{c.label}{c.detail&&<small>{c.detail}</small>}</span></li>)}{max&&changes.length>max&&<li className="more">…and {changes.length-max} more</li>}</ul>;
}
/** The opening sequence: which Moments are selected, in what order, and the real frame limit. */
function IntroPlanView({plan,before}:{plan:IntroPlan;before?:IntroPlan}){
 return <div className="admin-intro">
  <p className="admin-intro-summary"><strong>{plan.selected.length}</strong> selected · <strong>{plan.used.length}</strong> of <strong>{plan.limit}</strong> frames used{plan.overflow.length>0&&<> · <span className="warn-text">{plan.overflow.length} beyond the limit</span></>}</p>
  {plan.usesStock?<p className="admin-subtle">No Moments are selected for the opening, so it shows the bundled stock photographs instead.</p>:<ol className="admin-intro-list">{plan.used.map((m,i)=><li key={m.id}><span className="admin-frame-no">{i+1}</span><img src={m.thumbnail} alt="" width="64" height="48"/><span>{m.title}<small>{m.date}{m.location?` · ${m.location}`:''}</small></span></li>)}</ol>}
  {plan.overflow.length>0&&<p className="admin-notice error" role="status">The opening shows at most {plan.limit} photographs, taken in gallery order. {plan.overflow.length===1?'This one is':'These are'} selected but will not appear: {plan.overflow.map(m=>`"${m.title}"`).join(', ')}. Move {plan.overflow.length===1?'it':'them'} up, or untick other Moments.</p>}
  {plan.selected.length>0&&plan.selected.length<3&&<p className="admin-subtle">With only {plan.selected.length===1?'one photograph':'two photographs'} selected the opening shows just {plan.selected.length===1?'that photograph':'those photographs'}. Select more for a fuller opening.</p>}
  {before&&before.used.map(m=>m.id).join()!==plan.used.map(m=>m.id).join()&&<p className="admin-subtle">Live now: {before.usesStock?'bundled stock photographs':before.used.map(m=>`"${m.title}"`).join(', ')}.</p>}
 </div>;
}

/* ------------------------------------------------------------------ Pages & content */
function ContentEditor({member,editor}:{member:Member;editor:DraftEditor}){
 const [tab,setTab]=useState<keyof SiteContent>('home');
 const doc=editor.doc;
 if(!doc)return editor.loadError?<><Notice message={editor.loadError} error/><button className="admin-button ghost" onClick={()=>void editor.reload()}><RefreshCw size={14}/>Try again</button></>:<Loading/>;
 const tabs:(keyof SiteContent)[]=['home','employers','about','story','industries','destinations',...(member.role==='super_admin'?['settings' as const]:[])];
 const labels:Record<string,string>={home:'Homepage',employers:'Employer portfolio',about:'Our story',story:'Company narrative',industries:'Industries',destinations:'Destinations',settings:'Official settings',moments:'Moments gallery'};
 const setField=(section:keyof SiteContent,key:string,value:unknown,index?:number)=>editor.edit(d=>{const target=index!==undefined?(d[section] as unknown as Record<string,unknown>[])[index]:(d[section] as unknown as Record<string,unknown>);target[key]=value;},[index!==undefined?`${section}.${index}.${key}`:`${section}.${key}`]);
 const elsewhere=Object.keys(editor.paths).map(k=>k.split('.')[0]).filter((k,i,all)=>k!==tab&&all.indexOf(k)===i);
 return <>
  <ConflictPanel editor={editor}/>
  <div className="admin-toolbar"><div className="admin-tabs">{tabs.map(x=><button key={x} onClick={()=>setTab(x)} className={tab===x?'active':''}>{labels[x]}{Object.keys(editor.paths).some(k=>k.startsWith(`${x}.`))&&<CircleAlert size={11} className="admin-tab-alert" aria-label="has errors"/>}</button>)}</div></div>
  <div className="admin-card">
   <div className="admin-card-heading"><div><h3>{labels[tab]}</h3><p>Draft version {editor.version} · edits are private until published.</p></div><div className="admin-inline-actions"><EditorStatus editor={editor}/><Link href="/admin/preview" target="_blank" className="admin-button ghost">Preview saved draft<ExternalLink size={14}/></Link></div></div>
   {tab==='industries'||tab==='destinations'
    ?(doc[tab] as unknown as Record<string,unknown>[]).map((item,index)=><fieldset className="admin-fieldset" key={`${tab}-${index}`}><legend>{String(item.title)}</legend><div className="admin-form-grid">{Object.entries(item).map(([key,value])=>{
       const path=`${tab}.${index}.${key}`,errors=errorsFor(editor.paths,path);
       if(key==='roles')return <RolesField key={`${path}-${editor.epoch}`} label="Role families (one per line)" path={path} initial={value as string[]} errors={errors} onChange={roles=>setField(tab,key,roles,index)}/>;
       return <TextField key={key} label={key} path={path} value={String(value)} errors={errors} multiline={key==='description'} className={['description','image'].includes(key)?'span-two':''} onChange={v=>setField(tab,key,v,index)}/>;
      })}</div></fieldset>)
    :<div className="admin-form-grid">{Object.entries(doc[tab]).map(([key,value])=>{const path=`${tab}.${key}`;return <TextField key={key} label={key.replace(/([A-Z])/g,' $1')} path={path} value={String(value)} errors={errorsFor(editor.paths,path)} multiline={['intro','body','closing'].includes(key)} rows={4} className={['intro','body','closing','image','address','profileUrl'].includes(key)?'span-two':''} onChange={v=>setField(tab,key,v)}/>;})}</div>}
   <p className="admin-subtle">Image fields accept the local /media/*.webp references or a processed upload URL from your configured media domain. Keep source credits with every photograph.</p>
   <Notice message={editor.message}/><Notice message={editor.problem} error/>
   {elsewhere.length>0&&<p className="admin-notice error" role="alert">Also needs attention: {elsewhere.map(k=>labels[k]||k).join(', ')}.</p>}
   <div className="admin-card-footer"><EditorActions editor={editor}/><span>Publishing is a separate, validated step.</span></div>
  </div>
 </>;
}

/* ------------------------------------------------------------------ Media library */
function MediaLibrary(){
 const r=useResource<Media[]>('media');
 const [message,setMessage]=useState(''),[error,setError]=useState(''),[stage,setStage]=useState<UploadStage>('idle'),[failedAt,setFailedAt]=useState<UploadStage|null>(null),[progress,setProgress]=useState(0);
 const formRef=useRef<HTMLFormElement>(null),uploaded=useRef<{key:string;id:string}|null>(null);
 const busy=stage==='authorising'||stage==='uploading'||stage==='verifying';
 async function upload(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  const form=e.currentTarget,fd=new FormData(form),file=fd.get('file') as File;
  if(!file?.size)return;
  const key=`${file.name}|${file.size}|${file.lastModified}`;
  let at:UploadStage='authorising';
  setError('');setMessage('');setFailedAt(null);setProgress(0);
  try{
   // A file that already reached storage is not uploaded again on retry; only verification is repeated.
   if(uploaded.current?.key!==key){
    setStage(at='authorising');
    const result=await api<{id:string;url:string}>('media/authorise',{filename:file.name,type:file.type,size:file.size,alt:String(fd.get('alt')),credit:String(fd.get('credit')),sourceUrl:String(fd.get('sourceUrl'))});
    setStage(at='uploading');
    try{await putWithProgress(result.url,file,setProgress);}catch(err){throw new Error(storageUploadMessage((err as {status?:number}).status??0));}
    uploaded.current={key,id:result.id};
   }
   setStage(at='verifying');
   await api('media/complete',{id:uploaded.current!.id},120000);
   uploaded.current=null;
   setStage('ready');setMessage('Image verified, optimised and ready for assignment.');form.reset();void r.reload();
  }catch(err){setFailedAt(at);setStage('failed');setError(toMessage(err,'Upload failed.'));}
 }
 return <><div className="admin-card"><div className="admin-card-heading"><div><h3>Add an image</h3><p>Images are staged, verified and optimised before they can appear publicly.</p></div><Upload size={20}/></div>
  <form ref={formRef} className="admin-form-grid" onSubmit={upload}><label>Image file<input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={busy}/></label><label>Photographer / credit<input name="credit" maxLength={250} required disabled={busy}/></label><label className="span-two">Alt text<input name="alt" maxLength={300} minLength={3} required disabled={busy}/></label><label className="span-two">Source URL<input name="sourceUrl" type="url" maxLength={500} disabled={busy}/></label><div className="span-two admin-inline-actions"><button disabled={busy} className="admin-button">{busy?<LoaderCircle size={15} className="spin"/>:<Plus size={15}/>}{stage==='failed'?'Retry upload':'Upload & optimise'}</button></div></form>
  {stage!=='idle'&&<ol className="admin-steps" aria-label="Upload progress">{UPLOAD_STEPS.map(s=>{const st=stepState(s.stage,stage,failedAt);return <li key={s.stage} className={st}>{st==='done'?<CircleCheck size={14}/>:st==='failed'?<CircleAlert size={14}/>:st==='active'?<LoaderCircle size={14} className="spin"/>:<Circle size={14}/>}<span>{s.label}{s.stage==='uploading'&&stage==='uploading'&&` ${Math.round(progress*100)}%`}</span></li>;})}</ol>}
  {stage==='uploading'&&<progress className="admin-progress" max={1} value={progress} aria-label="Upload progress"/>}
  {stage==='failed'&&<p className="admin-subtle">Your file and details are still in the form above. Fix the problem and press Retry upload.</p>}
  <Notice message={message}/><Notice message={error} error/></div><Notice message={r.error} error/>{r.loading&&!r.data?<Loading/>:<div className="admin-media-grid">{r.data?.map(x=><div className="admin-media-card" key={x.id}>{x.variants['640']?<img src={x.variants['640']} alt={x.alt_text} width="640" height="450"/>:<div className="admin-media-placeholder"><ImageIcon size={28}/></div>}<div><span className="pill">{x.state}</span><h3>{x.original_filename}</h3><p>{x.alt_text}</p><small>{x.credit}</small>{x.state==='ready'&&<button className="admin-button ghost" onClick={async()=>{try{await navigator.clipboard.writeText(x.variants['1440']);setError('');setMessage('Image URL copied. Assign it in a page draft.');}catch{setMessage('');setError('Copy is unavailable in this browser.');}}}><Copy size={13}/>Copy image URL</button>}</div></div>)}</div>}{r.data?.length===0&&<div className="admin-empty">Your uploaded images will appear here. The bundled photo collection is already available through /media/ paths.</div>}</>;
}

/* ------------------------------------------------------------------ Inquiries */
type InquiryNote={at:string;by:string|null;status:string|null;note:string|null};
type InquiryRow=Inquiry&{notes?:InquiryNote[]};
function Inquiries({member}:{member:Member}){
 const r=useResource<InquiryRow[]>('inquiries');
 const [message,setMessage]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState('');
 async function update(e:React.FormEvent<HTMLFormElement>,id:string){
  e.preventDefault();setError('');setMessage('');
  const fd=new FormData(e.currentTarget);setSaving(id);
  try{await api('inquiry',{id,status:String(fd.get('status')),note:String(fd.get('note'))});setMessage('Inquiry updated. The note is private to staff.');void r.reload();}catch(err){setError(toMessage(err,'Update failed.'));}finally{setSaving('');}
 }
 return <><Notice message={message}/><Notice message={error||r.error} error/><div className="admin-card"><div className="admin-card-heading"><div><h3>Workforce conversations</h3><p>Private employer briefs. Never included in public content or assistant context.</p></div><button className="admin-button ghost" onClick={()=>r.reload()}><RefreshCw size={14}/>Refresh</button></div>{r.loading&&!r.data?<Loading/>:r.data?.length?r.data.map(x=>{
  const notes=(x.notes||[]).filter(n=>n.note?.trim());
  return <details className="admin-inquiry" key={x.id}><summary><div><strong>{x.payload.company}</strong><span>{x.payload.country} / {x.payload.industry} · {formatDate(x.created_at)}{notes.length>0&&` · ${notes.length} ${notes.length===1?'note':'notes'}`}</span></div><span className="admin-inline-actions">{x.portfolio_link_id&&<span className="pill good">Via portfolio link</span>}<span className="pill">{x.status.replaceAll('_',' ')}</span></span></summary><div className="admin-inquiry-body"><dl>{Object.entries(x.payload).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl>
   {notes.length>0&&<div className="admin-notes"><h4>Staff notes</h4><ul>{notes.map((n,i)=><li key={i}><p>{n.note}</p><small>{n.by||'Staff'} · {formatDate(n.at)}{n.status&&` · marked ${n.status.replaceAll('_',' ')}`}</small></li>)}</ul></div>}
   <form key={`${x.status}-${notes.length}-${x.notes?.length||0}`} onSubmit={e=>update(e,x.id)} className="admin-form-grid"><label>Status<select name="status" defaultValue={x.status}>{['new','in_review','contacted','qualified','closed','spam'].map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label><label>Add a private note<textarea name="note" maxLength={2000} rows={2} placeholder="Record the next step"/></label><button className="admin-button" type="submit" disabled={saving===x.id}>{saving===x.id&&<LoaderCircle size={14} className="spin"/>}Save workflow update</button></form></div></details>;
 }):<div className="admin-empty">No inquiries yet. A saved website inquiry will appear here.</div>}</div>{member.role==='admin'&&<p className="admin-subtle">Bulk export, personal-record erasure and staff access operations are restricted to Super Admins.</p>}</>;
}

function Knowledge({member}:{member:Member}){const r=useResource<KnowledgeEntry[]>('knowledge');const [editing,setEditing]=useState<KnowledgeEntry|null>(null),[message,setMessage]=useState(''),[error,setError]=useState(''),[test,setTest]=useState(''),[answer,setAnswer]=useState('');async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!editing)return;setError('');setMessage('');const fd=new FormData(e.currentTarget);try{await api('knowledge',{id:editing.id,topic:String(fd.get('topic')),locale:String(fd.get('locale')),question:String(fd.get('question')),answer:String(fd.get('answer')),aliases:String(fd.get('aliases')).split('\n').filter(Boolean),source_refs:[{sourceId:String(fd.get('source')),page:Number(fd.get('page'))||null}],actions:String(fd.get('actions')).split(',').map(x=>x.trim()).filter(Boolean),version:editing.version,valid_until:null});setEditing(null);setMessage('Knowledge draft saved. Approval and publication are separate.');void r.reload();}catch(e){setError(toMessage(e,'Save failed.'));}}async function approve(x:KnowledgeEntry){setError('');setMessage('');try{await api('approve',{id:x.id,version:x.version});setMessage('Entry approved. Publish a release to update the public assistant.');void r.reload();}catch(e){setError(toMessage(e,'Approval failed.'));}}async function runTest(e:React.FormEvent){e.preventDefault();setAnswer('Checking the published knowledge…');try{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:test,locale:'en'})});const result=await response.json();setAnswer(result.data?.answer||result.error?.message||'No answer.');}catch{setAnswer('The test request failed.');}}
 const fresh=()=>setEditing({id:`FAQ-${crypto.randomUUID()}`,topic:'company_information',locale:'en',question:'',answer:'',aliases:[],source_refs:[{sourceId:'Company profile November 2025',page:5}],actions:['contact'],state:'draft',version:0});
 return <><Notice message={message}/><Notice message={error||r.error} error/><div className="admin-two-columns"><div className="admin-card"><div className="admin-card-heading"><div><h3>Source-grounded knowledge</h3><p>Draft → review → approve → publish.</p></div><button className="admin-button" onClick={fresh}><Plus size={14}/>New entry</button></div>{editing?<form onSubmit={save} className="admin-form-grid"><label>Topic<input name="topic" defaultValue={editing.topic} required/></label><label>Language<select name="locale" defaultValue={editing.locale}><option value="en">English</option><option value="si">Sinhala</option><option value="ta">Tamil</option></select></label><label className="span-two">Question<input name="question" defaultValue={editing.question} required maxLength={400}/></label><label className="span-two">Approved-answer draft<textarea name="answer" defaultValue={editing.answer} required rows={5} maxLength={3000}/></label><label>Source document / URL<input name="source" defaultValue={editing.source_refs[0]?.sourceId} required/></label><label>Source page<input name="page" type="number" min="1" defaultValue={editing.source_refs[0]?.page||''}/></label><label className="span-two">Question variants (one per line)<textarea name="aliases" defaultValue={editing.aliases.join('\n')} rows={3}/></label><label className="span-two">Action IDs, comma separated<input name="actions" defaultValue={editing.actions.join(',')}/></label><div className="admin-inline-actions span-two"><button className="admin-button">Save draft</button><button type="button" className="admin-button ghost" onClick={()=>setEditing(null)}>Cancel</button></div></form>:r.loading?<Loading/>:r.data?.length?<div className="admin-knowledge-list">{r.data.map(x=><div key={x.id}><span className="pill">{x.locale.toUpperCase()} / {x.state}</span><h4>{x.question}</h4><p>{x.answer}</p><div className="admin-inline-actions"><button className="admin-button ghost" onClick={()=>setEditing(x)}>Edit draft</button>{member.role==='super_admin'&&x.state==='draft'&&<button className="admin-button" onClick={()=>approve(x)}>Approve source</button>}</div></div>)}</div>:<div className="admin-empty">Import the source-backed starter FAQs with npm run knowledge:import, or add an entry. Imports remain drafts until reviewed.</div>}</div><div className="admin-card"><h3>Published answer test</h3><p>Test the same public answer path visitors use. Unpublished drafts are excluded.</p><form className="admin-form-grid" onSubmit={runTest}><label className="span-two">Question<textarea value={test} onChange={e=>setTest(e.target.value)} required rows={3}/></label><button className="admin-button" disabled={!test.trim()}>Test answer ↗</button></form>{answer&&<div className="admin-answer">{answer}</div>}<p className="admin-subtle">Native-language quality and the free-model endpoint require measured evaluation before production claims.</p></div></div></>;
}

/* ------------------------------------------------------------------ Publishing */
type ReleaseRow={id:string;message:string;created_at:string;source_release_id:string|null};
function Publishing({member,editor,goTo}:{member:Member;editor:DraftEditor;goTo:(id:string)=>void}){
 const r=useResource<ReleaseRow[]>('releases'),d=useResource<{content:SiteContent;version:number}>('draft'),live=useResource<{id:string;content:SiteContent}>('live');
 const [message,setMessage]=useState(''),[error,setError]=useState(''),[stale,setStale]=useState(false),[busy,setBusy]=useState(false);
 const diff=useMemo(()=>d.data&&live.data?diffContent(live.data.content,d.data.content):null,[d.data,live.data]);
 const groups=useMemo(()=>diff?groupChanges(diff.changes):[],[diff]);
 const reloadAll=()=>{setStale(false);setError('');void r.reload();void d.reload();void live.reload();};
 async function publish(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const form=e.currentTarget;setBusy(true);setError('');setMessage('');setStale(false);
  try{
   const note=String(new FormData(form).get('message'));
   const result=await api<{id:string}>('publish',{version:d.data?.version||0,message:note});
   if(!result?.id)throw new Error('The server did not confirm the release, so it is not treated as published. Check the release history before trying again.');
   setMessage(`Release activated: ${result.id}. Open the public website to verify the result.`);form.reset();void r.reload();void live.reload();
  }catch(err){const p=toProblem(err,'Publish failed.');setError(p.kind==='conflict'?'The draft was saved again after you opened this page, so nothing was published. Reload to review the latest summary, then publish.':p.message);setStale(p.kind==='conflict'||p.kind==='timeout');}finally{setBusy(false);}
 }
 async function restore(id:string){
  if(!window.confirm('Restore the content of this release?\n\nThis publishes a new release with that content and resets the saved draft to it. Staff access and inquiries are not changed.'))return;
  setError('');setMessage('');
  try{
   const result=await api<{id:string}>('rollback',{id});
   if(!result?.id)throw new Error('The server did not confirm the restore. Check the release history.');
   setMessage(`Content restored in a new release: ${result.id}. Staff access and inquiries were not changed.${editor.dirty?' Your unsaved editor changes were based on the old draft; saving them will ask you to review.':''}`);
   if(!editor.dirty&&editor.doc)void editor.reload();
   reloadAll();
  }catch(err){setError(toMessage(err,'Restore failed.'));}
 }
 const count=diff?.changes.length||0,blocked=editor.dirty,settingsBlocked=Boolean(diff?.settingsChanged&&member.role!=='super_admin');
 return <><Notice message={message}/><Notice message={error||r.error||d.error||live.error} error/>{stale&&<button className="admin-button ghost" onClick={reloadAll}><RefreshCw size={14}/>Reload the latest draft and summary</button>}
  {blocked&&<div className="admin-notice error" role="alert">You have {editor.changeCount} unsaved editor {editor.changeCount===1?'change':'changes'} that are not part of this publication. Save or discard them first so you publish what you intend to.<span className="admin-inline-actions"><button type="button" className="admin-button ghost" onClick={()=>goTo('content')}>Open the editor</button></span></div>}
  <div className="admin-card"><div className="admin-card-heading"><div><h3>What will change</h3><p>Compared with the live release{live.data?` (${live.data.id.slice(0,8)})`:''} · saved draft version {d.data?.version||0}.</p></div><Link href="/admin/preview" target="_blank" className="admin-button ghost">Preview draft<ExternalLink size={14}/></Link></div>
   {(d.loading&&!d.data)||(live.loading&&!live.data)?<Loading/>:diff?<>
    {count===0?<p className="admin-subtle">The saved draft matches the live release. Publishing would create a new release with identical content.</p>:<p className="admin-diff-counts"><strong>{count}</strong> {count===1?'change':'changes'}{(['added','removed','changed','reordered'] as const).filter(k=>diff.counts[k]>0).map(k=><span key={k} className={`pill ${k}`}>{diff.counts[k]} {k}</span>)}</p>}
    {groups.map(g=><div key={g.area} className="admin-diff-group"><h4>{g.area}</h4><ChangeList changes={g.items} showArea={false}/></div>)}
    {settingsBlocked&&<p className="admin-notice error" role="alert">Official settings differ from the live release. Only a Super Admin can publish this draft.</p>}
    <div className="admin-diff-group"><h4>Opening sequence after publishing</h4><IntroPlanView plan={diff.intro.after} before={diff.intro.before}/></div>
   </>:null}
  </div>
  <div className="admin-card"><div className="admin-card-heading"><div><h3>Publish a considered change</h3><p>Draft version {d.data?.version||0}. Every changed field is checked against your permissions.</p></div></div><form onSubmit={publish} className="admin-form-grid"><label className="span-two">Release note<input name="message" minLength={3} maxLength={240} required placeholder="What changed, and why?"/></label><button className="admin-button" disabled={busy||!d.data?.version||blocked||settingsBlocked}>{busy?<LoaderCircle size={15} className="spin"/>:<Send size={15}/>}{busy?'Publishing…':count?`Publish ${count} ${count===1?'change':'changes'}`:'Publish draft'}</button></form><p className="admin-subtle">Admins can publish routine content. Official settings require Super Admin. Newly approved knowledge is included only in a Super Admin release.</p></div>
  <div className="admin-card"><h3>Release history</h3>{r.loading&&!r.data?<Loading/>:r.data?.length?r.data.map(x=><div className="admin-release" key={x.id}><div><strong>{x.message}</strong><span>{formatDate(x.created_at)}</span><code>{x.id}</code></div>{member.role==='super_admin'&&<button className="admin-button ghost" onClick={()=>restore(x.id)}>Restore content</button>}</div>):<div className="admin-empty">No releases yet. Save a draft, preview it and publish your first version.</div>}</div></>;
}

/* ------------------------------------------------------------------ Access */
function Access(){const r=useResource<Member[]>('members'),invitations=useResource<{id:string;email:string;intended_role:string;state:string;expires_at:string}[]>('invitations');const [message,setMessage]=useState(''),[error,setError]=useState(''),[link,setLink]=useState('');const roleName=(role:string)=>role==='super_admin'?'Super Admin':'Admin';async function invite(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError('');setMessage('');const fd=new FormData(e.currentTarget);try{const result=await api<{link:string}>('invite',{email:String(fd.get('email')),role:String(fd.get('role'))});setLink(result.link);setMessage('Invitation created. Share this one-time link directly with the intended person. It expires in 48 hours.');void invitations.reload();}catch(e){setError(toMessage(e,'Invite failed.'));}}async function update(x:Member,role:Member['role'],active:boolean){setError('');setMessage('');try{await api('member',{id:x.id,role,active,version:x.access_version});setMessage('Staff permissions updated. The next protected request uses the new membership state.');void r.reload();}catch(e){setError(toMessage(e,'Update failed.'));}}
 function changeRole(x:Member,role:Member['role']){if(role===x.role)return;if(!window.confirm(`Change ${x.email} from ${roleName(x.role)} to ${roleName(role)}?\n\n${role==='super_admin'?'Super Admins can manage staff, publish official settings, approve knowledge and restore releases.':'They will lose access to staff management, official settings, approvals and restores.'}\n\nThe change applies on their next request and is recorded in the activity log.`))return;void update(x,role,x.active);}
 function toggleActive(x:Member){if(x.active&&!window.confirm(`Suspend ${x.email}?\n\nThey will lose access to the workspace on their next request. You can reactivate them later.`))return;void update(x,x.role,!x.active);}
 async function revoke(id:string){setError('');setMessage('');try{await api('invitation-revoke',{id});setMessage('Invitation revoked.');void invitations.reload();}catch(e){setError(toMessage(e,'Request failed.'));}}return <><Notice message={message}/><Notice message={error||r.error||invitations.error} error/><div className="admin-card"><div className="admin-card-heading"><div><h3>Invite a colleague</h3><p>Only Super Admins can add staff or change access. A recent sign-in is required.</p></div><ShieldCheck size={22}/></div><form onSubmit={invite} className="admin-form-grid"><label>Email<input type="email" name="email" required maxLength={240}/></label><label>Staff role<select name="role" defaultValue="admin"><option value="admin">Admin — routine content & inquiries</option><option value="super_admin">Super Admin — elevated access & settings</option></select></label><button className="admin-button"><Plus size={15}/>Create invitation</button></form>{link&&<div className="admin-invitation-link"><label>One-time invitation link<input value={link} readOnly onFocus={e=>e.target.select()}/></label><button className="admin-button ghost" onClick={async()=>{try{await navigator.clipboard.writeText(link);setError('');setMessage('Invitation link copied.');}catch{setMessage('');setError('Select and copy the link manually.');}}}><Copy size={14}/>Copy link</button></div>}</div><div className="admin-card"><h3>Staff members</h3>{r.loading&&!r.data?<Loading/>:r.data?.map(x=><div className="admin-member" key={x.id}><div><strong>{x.display_name||x.email}</strong><span>{x.email}</span><small>{x.active?'Active':'Suspended'} · access version {x.access_version}</small></div><div className="admin-inline-actions"><select aria-label={`Role for ${x.email}`} value={x.role} onChange={e=>changeRole(x,e.target.value as Member['role'])}><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select><button className="admin-button ghost" onClick={()=>toggleActive(x)}>{x.active?'Suspend access':'Reactivate'}</button></div></div>)}<p className="admin-subtle">The last active Super Admin cannot be demoted or suspended. All role changes are audited and protected by a database transaction guard.</p></div><div className="admin-card"><h3>Invitations</h3>{invitations.data?.length?invitations.data.map(x=><div className="admin-member" key={x.id}><div><strong>{x.email}</strong><span>{x.intended_role==='super_admin'?'Super Admin':'Admin'} · {x.state}</span><small>Expires {formatDate(x.expires_at)}</small></div>{x.state==='pending'&&<button className="admin-button ghost" onClick={()=>revoke(x.id)}>Revoke</button>}</div>):<p className="admin-subtle">No invitations.</p>}</div></>;}

function Audit(){const r=useResource<{id:number;action:string;resource_id:string;email:string;created_at:string;detail:unknown}[]>('audit');return <div className="admin-card"><h3>A clear change history</h3><p>Redacted operational events. Tokens, passwords and provider keys are excluded.</p><Notice message={r.error} error/>{r.loading?<Loading/>:r.data?.map(x=><details className="admin-audit" key={x.id}><summary><strong>{x.action}</strong><span>{x.email} · {formatDate(x.created_at)}</span></summary><p>{x.resource_id}</p><pre>{JSON.stringify(x.detail,null,2)}</pre></details>)}</div>;}

/* ------------------------------------------------------------------ Moments */
function MomentsEditor({editor,goTo}:{editor:DraftEditor;goTo:(id:string)=>void}){
 const media=useResource<Media[]>('media');
 const [addErrors,setAddErrors]=useState<MomentFieldErrors>({}),[note,setNote]=useState('');
 const doc=editor.doc;
 if(!doc)return editor.loadError?<><Notice message={editor.loadError} error/><button className="admin-button ghost" onClick={()=>void editor.reload()}><RefreshCw size={14}/>Try again</button></>:<Loading/>;
 const ready=media.data?.filter(x=>x.state==='ready'&&x.variants['1440'])||[];
 const plan=introPlan(doc.moments),usedIds=plan.used.map(m=>m.id),overIds=plan.overflow.map(m=>m.id);
 function add(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setNote('');
  const form=e.currentTarget,fd=new FormData(form),asset=ready.find(x=>x.id===fd.get('asset'));
  const candidate={title:String(fd.get('title')||''),date:String(fd.get('date')||''),location:String(fd.get('location')||''),credit:asset?.credit||'',alt:asset?.alt_text||'',image:asset?.variants['1440']||'',permissionConfirmed:fd.get('permission')==='on'};
  const errors=validateMomentFields(candidate);
  if(!asset)errors.image='Choose a verified image.';
  setAddErrors(errors);
  if(Object.keys(errors).length||!asset)return;
  if(doc!.moments.length>=100){setAddErrors({image:'The gallery supports up to 100 moments.'});return;}
  editor.edit(d=>{d.moments.push({id:crypto.randomUUID(),title:candidate.title.trim(),image:asset.variants['1440'],thumbnail:asset.variants['160']||asset.variants['640'],alt:asset.alt_text,credit:asset.credit,location:candidate.location.trim(),date:candidate.date,useInIntro:fd.get('intro')==='on',permissionConfirmed:true});});
  form.reset();setNote('Added to the unsaved gallery. Save the draft, then publish it.');
 }
 const patch=(i:number,key:'title'|'date'|'location'|'credit',value:string)=>editor.edit(d=>{d.moments[i][key]=value;},[`moments.${i}.${key}`]);
 const move=(i:number,step:number)=>{const t=i+step;if(t<0||t>=doc.moments.length)return;editor.edit(d=>{[d.moments[i],d.moments[t]]=[d.moments[t],d.moments[i]];},['moments']);};
 const addErr=(k:keyof MomentFieldErrors)=>addErrors[k]?[addErrors[k]!]:[];
 return <>
  <ConflictPanel editor={editor}/>
  <Notice message={media.error} error/>
  <div className="admin-card"><div className="admin-card-heading"><div><h3>Opening sequence</h3><p>The cinematic opening shows photographs from Moments ticked “Use in opening”, in gallery order, up to {INTRO_FRAME_LIMIT} frames. This is the draft; it reaches visitors when published.</p></div></div><IntroPlanView plan={plan}/></div>
  <div className="admin-card"><h3>Add a moment</h3><p>Upload in Media library first. Choose only photos you have permission to publish. Published photos appear in the Moments gallery and its scroll effects, and can be selected for the opening.</p>
   <form onSubmit={add} className="admin-form-grid" noValidate>
    <label className="span-two">Verified image<select name="asset" aria-invalid={addErrors.image?true:undefined}><option value="">Choose an uploaded image</option>{ready.map(x=><option key={x.id} value={x.id}>{x.original_filename} — {x.credit}</option>)}</select><FieldError id="err-add-image" errors={addErr('image')}/></label>
    <label>Caption<input name="title" maxLength={120} aria-invalid={addErrors.title?true:undefined}/><FieldError id="err-add-title" errors={addErr('title')}/></label>
    <label>Date<input name="date" type="date" max={colomboToday()} aria-invalid={addErrors.date?true:undefined}/><FieldError id="err-add-date" errors={addErr('date')}/></label>
    <label className="span-two">Location<input name="location" maxLength={120} aria-invalid={addErrors.location?true:undefined}/><FieldError id="err-add-location" errors={addErr('location')}/></label>
    {(addErrors.credit||addErrors.alt)&&<p className="admin-field-error span-two"><CircleAlert size={12}/>This image has no {addErrors.credit?'credit':'alt text'}. Fix it in the Media library before using it.</p>}
    <label className="admin-check span-two"><input name="intro" type="checkbox"/>Use in the opening sequence (up to {INTRO_FRAME_LIMIT} frames, in gallery order)</label>
    <div className="span-two"><label className="admin-check"><input name="permission" type="checkbox" aria-invalid={addErrors.permissionConfirmed?true:undefined}/>We have publication rights and permission from identifiable people.</label><FieldError id="err-add-permission" errors={addErr('permissionConfirmed')}/></div>
    <div className="span-two"><button className="admin-button" disabled={!ready.length}>Add to gallery draft</button></div>
   </form>{!ready.length&&<p>No verified uploads yet. Open Media library to upload and optimise a photograph.</p>}<Notice message={note}/></div>
  <div className="admin-card"><div className="admin-card-heading"><div><h3>Gallery order / {doc.moments.length} frames</h3><p>Draft version {editor.version}. Changes stay private until published.</p></div><div className="admin-inline-actions"><EditorStatus editor={editor}/><EditorActions editor={editor} label="Save moments draft"/></div></div>
   <Notice message={editor.message}/><Notice message={editor.problem} error/>
   {Object.keys(editor.paths).some(k=>!k.startsWith('moments'))&&<p className="admin-notice error" role="alert">Other parts of the draft also need attention. <button type="button" className="text-link" onClick={()=>goTo('content')}>Open Pages & content</button></p>}
   {editor.message&&!editor.dirty&&<p className="admin-subtle"><button type="button" className="text-link" onClick={()=>goTo('publishing')}>Review and publish →</button></p>}
   <div className="admin-media-grid">{doc.moments.map((m,i)=>{
     const p=(k:string)=>`moments.${i}.${k}`,slot=usedIds.indexOf(m.id),over=overIds.includes(m.id);
     const otherErrors=['alt','image','thumbnail','permissionConfirmed','id'].flatMap(k=>errorsFor(editor.paths,p(k)));
     return <div className="admin-media-card" key={m.id}><img src={m.thumbnail} alt={m.alt} width="400" height="300"/><div className="admin-form-grid admin-moment-fields">
      <div className="span-two admin-inline-actions">{slot>=0&&<span className="pill good">Opening frame {slot+1} of {plan.used.length}</span>}{over&&<span className="pill warn">Beyond the {plan.limit}-frame limit — not shown in the opening</span>}<span className="pill">Permission confirmed</span></div>
      <TextField label="Caption" path={p('title')} value={m.title} errors={errorsFor(editor.paths,p('title'))} className="span-two" onChange={v=>patch(i,'title',v)}/>
      <TextField label="Date" path={p('date')} value={m.date} errors={errorsFor(editor.paths,p('date'))} onChange={v=>patch(i,'date',v)}/>
      <TextField label="Location" path={p('location')} value={m.location} errors={errorsFor(editor.paths,p('location'))} onChange={v=>patch(i,'location',v)}/>
      <TextField label="Credit" path={p('credit')} value={m.credit} errors={errorsFor(editor.paths,p('credit'))} className="span-two" onChange={v=>patch(i,'credit',v)}/>
      {otherErrors.length>0&&<FieldError id={errId(p('other'))} errors={otherErrors}/>}
      <label className="admin-check span-two"><input type="checkbox" checked={m.useInIntro} onChange={e=>editor.edit(d=>{d.moments[i].useInIntro=e.target.checked;})}/>Use in the opening sequence</label>
      <div className="admin-inline-actions span-two"><button className="admin-button ghost" disabled={i===0} onClick={()=>move(i,-1)}><ArrowUp size={12}/>Move up</button><button className="admin-button ghost" disabled={i===doc.moments.length-1} onClick={()=>move(i,1)}><ArrowDown size={12}/>Move down</button><button className="admin-button ghost" onClick={()=>editor.edit(d=>{d.moments=d.moments.filter(x=>x.id!==m.id);},['moments'])}>Remove from draft</button></div>
     </div></div>;})}</div>
   {!doc.moments.length&&<p>No company moments selected. The public collection is explicitly labelled illustrative until you publish your first photos.</p>}</div>
 </>;
}

/* ------------------------------------------------------------------ Portfolio links */
type PortfolioData={links:PortfolioLinkRow[];industries:{slug:string;title:string}[];baseUrl:string|null};
type PortfolioBody={company_name:string;contact_name:string;country:string;sectors:string[];roles:string[];intro_message:string;show_clients:boolean;expires_at:string|null};
type Notify=(message:string,isError?:boolean)=>void;
const portfolioStatusLabel={active:'Active',disabled:'Disabled',expired:'Expired'} as const;
const colomboDay=(iso:string)=>new Date(iso).toLocaleDateString('en-CA',{timeZone:'Asia/Colombo'});
async function copyText(text:string,done:string,notify:Notify){try{await navigator.clipboard.writeText(text);notify(done);}catch{notify('Copy is unavailable in this browser. Select the text and copy it manually.',true);}}

function PortfolioShare({link,url,notify}:{link:PortfolioLinkRow;url:string;notify:Notify}){
 return <div className="admin-share-row">
  <button type="button" className="admin-button" onClick={()=>copyText(url,'Link copied.',notify)}><Copy size={13}/>Copy link</button>
  <a className="admin-button ghost" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13}/>Open</a>
  <a className="admin-button ghost" href={portfolioWhatsAppUrl(link,url)} target="_blank" rel="noopener noreferrer"><MessageCircle size={13}/>Share on WhatsApp</a>
  <button type="button" className="admin-button ghost" onClick={()=>copyText(portfolioEmailText(link,url),'Email text copied. Paste it into a new email.',notify)}><Mail size={13}/>Copy email text</button>
 </div>;
}

function PortfolioForm({industries,initial,busy,onSubmit,onCancel}:{industries:PortfolioData['industries'];initial?:PortfolioLinkRow;busy:boolean;onSubmit:(body:PortfolioBody)=>void;onCancel:()=>void}){
 const [formError,setFormError]=useState('');
 function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setFormError('');
  const fd=new FormData(e.currentTarget),day=String(fd.get('expires')||'');
  // The expiry is the end of the chosen day in Sri Lanka (UTC+5:30, no daylight saving).
  const expires=day?new Date(`${day}T23:59:59+05:30`):null;
  if(expires&&Number.isNaN(expires.getTime())){setFormError('Choose a valid expiry date.');return;}
  onSubmit({company_name:String(fd.get('company_name')).trim(),contact_name:String(fd.get('contact_name')).trim(),country:String(fd.get('country')).trim(),sectors:fd.getAll('sectors').map(String),roles:String(fd.get('roles')).split('\n').map(x=>x.trim()).filter(Boolean),intro_message:String(fd.get('intro_message')).trim(),show_clients:fd.get('show_clients')==='on',expires_at:expires?expires.toISOString():null});
 }
 return <form className="admin-form-grid" onSubmit={submit}>
  <label>Company name<input name="company_name" required maxLength={160} defaultValue={initial?.company_name} placeholder="The company you are writing to"/></label>
  <label>Contact person <span className="admin-optional">(optional)</span><input name="contact_name" maxLength={120} defaultValue={initial?.contact_name} placeholder="Name shown on the page"/></label>
  <label>Country <span className="admin-optional">(optional)</span><input name="country" maxLength={100} defaultValue={initial?.country}/></label>
  <label>Link expires <span className="admin-optional">(optional, end of day, Sri Lanka time)</span><input name="expires" type="date" defaultValue={initial?.expires_at?colomboDay(initial.expires_at):''} min={initial?undefined:colomboDay(new Date().toISOString())}/></label>
  <fieldset className="admin-checks span-two"><legend>Sectors to put first <span className="admin-optional">(shown first and highlighted on their page)</span></legend><div className="admin-check-grid">{industries.map(x=><label className="admin-check" key={x.slug}><input type="checkbox" name="sectors" value={x.slug} defaultChecked={initial?.sectors.includes(x.slug)}/>{x.title}</label>)}</div></fieldset>
  <label className="span-two">Roles of interest <span className="admin-optional">(one per line)</span><textarea name="roles" rows={4} defaultValue={initial?.roles.join('\n')} placeholder={'Welders\nAssistant chefs'}/></label>
  <label className="span-two">Personal note <span className="admin-optional">(shown at the top of their page)</span><textarea name="intro_message" rows={4} maxLength={1200} defaultValue={initial?.intro_message} placeholder="Only write what is true and relevant to this company."/></label>
  <label className="admin-check span-two"><input type="checkbox" name="show_clients" defaultChecked={initial?.show_clients??true}/>Show the client relationships section</label>
  {formError&&<p className="admin-notice error span-two" role="alert">{formError}</p>}
  <div className="admin-inline-actions span-two"><button className="admin-button" disabled={busy}>{busy?<LoaderCircle size={15} className="spin"/>:initial?<Check size={15}/>:<Plus size={15}/>}{initial?'Save changes':'Create link'}</button><button type="button" className="admin-button ghost" onClick={onCancel}>Cancel</button></div>
 </form>;
}

function PortfolioLinks({member}:{member:Member}){
 const r=useResource<PortfolioData>('portfolio-links');
 const [editing,setEditing]=useState<PortfolioLinkRow|'new'|null>(null),[fresh,setFresh]=useState<PortfolioLinkRow|null>(null),[message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const notify:Notify=(text,isError=false)=>{setMessage(isError?'':text);setError(isError?text:'');};
 async function run(work:()=>Promise<void>,failure:string){setBusy(true);setError('');setMessage('');try{await work();}catch(e){setError(e instanceof Error?e.message:failure);}finally{setBusy(false);}}
 if(r.loading&&!r.data)return <Loading/>;
 if(!r.data)return <Notice message={r.error||'Portfolio links are unavailable.'} error/>;
 const {links,industries}=r.data,origin=r.data.baseUrl||window.location.origin,urlFor=(slug:string)=>`${origin}/for/${slug}`,title=(slug:string)=>industries.find(x=>x.slug===slug)?.title||slug;
 const save=(body:PortfolioBody)=>run(async()=>{
  if(editing==='new'){const result=await api<{link:PortfolioLinkRow}>('portfolio-link',body);setFresh(result.link);setMessage('Link created. Copy it or share it from here.');}
  else if(editing){await api('portfolio-link-update',{id:editing.id,...body});setMessage('Link updated. The web address is unchanged, so links already sent keep working.');}
  setEditing(null);await r.reload();
 },'Save failed.');
 const setActive=(link:PortfolioLinkRow,active:boolean)=>run(async()=>{await api('portfolio-link-status',{id:link.id,active});setMessage(active?'Link enabled.':'Link disabled. Visitors now see a friendly expired page.');await r.reload();},'Update failed.');
 const remove=(link:PortfolioLinkRow)=>{if(!window.confirm(`Permanently delete the link for ${link.company_name}?\n\nAnyone holding it will see a page-not-found message and its view history is lost. Inquiries already received are kept. This cannot be undone.\n\nTo stop access but keep the record, use Disable instead.`))return;void run(async()=>{await api('portfolio-link-delete',{id:link.id});setMessage('Link deleted permanently.');setFresh(x=>x?.id===link.id?null:x);await r.reload();},'Delete failed.');};
 return <>
  <Notice message={message}/><Notice message={error||r.error} error/>
  {fresh&&<div className="admin-card admin-link-ready"><div className="admin-card-heading"><div><h3>Link ready for {fresh.company_name}</h3><p>This private address is not listed anywhere on the website. Anyone who has it can open the page.</p></div><button type="button" className="admin-button ghost" onClick={()=>setFresh(null)}>Dismiss</button></div><input className="admin-link-input" readOnly value={urlFor(fresh.slug)} aria-label="Portfolio link" onFocus={e=>e.currentTarget.select()}/><PortfolioShare link={fresh} url={urlFor(fresh.slug)} notify={notify}/></div>}
  <div className="admin-card">
   <div className="admin-card-heading"><div><h3>{editing==='new'?'New portfolio link':editing?`Edit link for ${editing.company_name}`:'Personal portfolio links'}</h3><p>{editing?'Everything here is optional apart from the company name.':'Send a company its own version of the employer portfolio. Each link is private, trackable and can be switched off at any time.'}</p></div>{!editing&&<div className="admin-inline-actions"><button className="admin-button ghost" onClick={()=>void r.reload()}><RefreshCw size={14}/>Refresh</button><button className="admin-button" onClick={()=>{setEditing('new');setFresh(null);setMessage('');setError('');}}><Plus size={14}/>New link</button></div>}</div>
   {editing&&<PortfolioForm key={editing==='new'?'new':editing.id} industries={industries} initial={editing==='new'?undefined:editing} busy={busy} onSubmit={save} onCancel={()=>setEditing(null)}/>}
  </div>
  {!editing&&<div className="admin-card">
   {links.length===0?<div className="admin-empty">No links yet. Create one for a company you are about to contact.</div>:links.map(link=>{
    const url=urlFor(link.slug);
    return <details className="admin-inquiry" key={link.id}>
     <summary><div><strong>{link.company_name}</strong><span>{link.country||'Country not set'} · {link.view_count} {link.view_count===1?'view':'views'} · last viewed {link.last_viewed_at?formatDate(link.last_viewed_at):'never'} · created {formatDate(link.created_at)}{link.inquiry_count>0&&` · ${link.inquiry_count} ${link.inquiry_count===1?'inquiry':'inquiries'}`}</span></div><span className={`pill ${link.status==='active'?'good':''}`}>{portfolioStatusLabel[link.status]}</span></summary>
     <div className="admin-inquiry-body">
      <input className="admin-link-input" readOnly value={url} aria-label={`Link for ${link.company_name}`} onFocus={e=>e.currentTarget.select()}/>
      <PortfolioShare link={link} url={url} notify={notify}/>
      <dl>
       <div><dt>Contact person</dt><dd>{link.contact_name||'—'}</dd></div>
       <div><dt>Expires</dt><dd>{link.expires_at?formatDate(link.expires_at):'Never'}</dd></div>
       <div><dt>Sectors first</dt><dd>{link.sectors.length?link.sectors.map(title).join(', '):'None chosen'}</dd></div>
       <div><dt>Roles of interest</dt><dd>{link.roles.length?link.roles.join(', '):'—'}</dd></div>
       <div><dt>Client section</dt><dd>{link.show_clients?'Shown':'Hidden'}</dd></div>
       <div><dt>Created by</dt><dd>{link.created_by_email||'—'}</dd></div>
       {link.intro_message&&<div className="span-two"><dt>Personal note</dt><dd>{link.intro_message}</dd></div>}
      </dl>
      <div className="admin-inline-actions">
       <button className="admin-button ghost" onClick={()=>{setEditing(link);setFresh(null);setMessage('');setError('');}}><Pencil size={13}/>Edit</button>
       {link.is_active?<button className="admin-button ghost" disabled={busy} onClick={()=>void setActive(link,false)}>Disable</button>:<button className="admin-button" disabled={busy} onClick={()=>void setActive(link,true)}>Enable</button>}
       {can(member.role,'portfolio.delete')&&<button className="admin-button danger" disabled={busy} onClick={()=>remove(link)}><Trash2 size={13}/>Delete permanently</button>}
      </div>
     </div>
    </details>;})}
  </div>}
 </>;
}
