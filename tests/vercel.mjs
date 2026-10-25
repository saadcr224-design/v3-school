import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Readable} from 'node:stream';
import handler from '../.vercel/output/functions/api/chat.func/index.mjs';
const config=JSON.parse(await readFile('.vercel/output/config.json','utf8'));
assert.equal(config.version,3);
assert(config.routes.some(r=>r.src==='/'&&r.dest==='/index.html'));
assert.equal(JSON.parse(await readFile('.vercel/output/static/lessons.json')).length,186);
assert((await readFile('.vercel/output/static/index.html','utf8')).includes('data-v3school-app'));
assert.equal(JSON.parse(await readFile('.vercel/output/functions/api/chat.func/.vc-config.json')).runtime,'nodejs22.x');
const originalFetch=globalThis.fetch,originalKey=process.env.GEMINI_API_KEY;
async function invoke(body,headers={},method='POST'){
 const req=Readable.from(body===null?[]:[Buffer.from(typeof body==='string'?body:JSON.stringify(body))]);
 req.method=method;req.headers={host:'v3school.test','content-type':'application/json',origin:'https://v3school.test',...headers};
 const res={headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v},end(body){this.body=JSON.parse(body)}};
 await handler(req,res);return res;
}
try{
 delete process.env.GEMINI_API_KEY;
 let r=await invoke({messages:[{role:'user',text:'Hello'}]});assert.equal(r.statusCode,503);
 process.env.GEMINI_API_KEY='test-only';let calls=0;
 globalThis.fetch=async(url,options)=>{calls++;assert(url.startsWith('https://generativelanguage.googleapis.com/'));assert.equal(options.headers['x-goog-api-key'],'test-only');assert.equal(JSON.parse(options.body).contents[0].parts[0].text,'Hello');return Response.json({candidates:[{content:{parts:[{text:'Hello! السلام علیکم'}]},finishReason:'STOP'}]});};
 r=await invoke({messages:[{role:'user',text:'Hello'}]});assert.equal(r.statusCode,200);assert(r.body.text.includes('السلام'));assert.equal(r.headers['cache-control'],'no-store');
 r=await invoke({messages:[]});assert.equal(r.statusCode,400);
 r=await invoke({}, {origin:'https://evil.test'});assert.equal(r.statusCode,403);
 r=await invoke(null,{},'GET');assert.equal(r.statusCode,405);
 r=await invoke('x'.repeat(96001));assert.equal(r.statusCode,413);
 assert.equal(calls,1);
 console.log('PASS: Vercel output, PWA assets, 186 lessons, Gemini adapter, missing key, malformed input, origin validation, body size and method checks.');
}finally{globalThis.fetch=originalFetch;if(originalKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalKey;}
