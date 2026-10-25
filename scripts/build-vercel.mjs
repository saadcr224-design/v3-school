import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.vercel/output');
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(path.join(root, 'public'), path.join(output, 'static'), {recursive:true});
const fn = path.join(output, 'functions/api/chat.func');
await mkdir(fn, {recursive:true});
await cp(path.join(root, 'deployment/vercel/chat.mjs'), path.join(fn, 'index.mjs'));
await cp(path.join(root, 'worker/gemini.mjs'), path.join(fn, 'gemini.mjs'));
await writeFile(path.join(fn, '.vc-config.json'), JSON.stringify({runtime:'nodejs22.x',handler:'index.mjs',launcherType:'Nodejs',maxDuration:60}));
await writeFile(path.join(output, 'config.json'), JSON.stringify({version:3,routes:[
  {src:'/sw.js',headers:{'Cache-Control':'no-cache, no-store, must-revalidate'},continue:true},
  {src:'/(app.js|pwa.js|style.css|lessons.json|manifest.webmanifest)',headers:{'Cache-Control':'public, max-age=0, must-revalidate'},continue:true},
  {src:'/',dest:'/index.html'},
  {handle:'filesystem'}
]}, null, 2));
const lessons=JSON.parse(await readFile(path.join(output,'static/lessons.json'),'utf8'));
if(lessons.length!==186)throw new Error('Expected all 186 guides');
console.log(`Built V3school for Vercel: ${lessons.length} guides, static PWA, and /api/chat Node.js function.`);
