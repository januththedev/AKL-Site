import { spawn } from 'node:child_process';
// The managed preview may supply Vite-style host/strictPort flags to a migrated
// project. Translate the transport flags without starting a second dev server.
const raw=process.argv.slice(2),production=raw.includes('--production');
const input=raw.filter(x=>x!=='--production'),args=[];
for(let i=0;i<input.length;i++){
 if(input[i]==='--strictPort')continue;
 if(input[i]==='--host'){args.push('--hostname',input[++i]||'0.0.0.0');continue;}
 args.push(input[i]);
}
if(!args.includes('--hostname'))args.push('--hostname','0.0.0.0');
// Keep dev/build on the same stable bundler while migrating from Vite.
if(!production&&!args.includes('--webpack')&&!args.includes('--turbopack'))args.push('--webpack');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',production?'start':'dev',...args],{stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
