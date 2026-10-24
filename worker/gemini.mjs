const usage = new Map();
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function chatRequest(request,env,fetcher=fetch){
 if(request.method!=='POST')return json({error:'Use POST.'},405);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Request origin not allowed.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Send JSON.'},415);
 if(!env.GEMINI_API_KEY)return json({error:'Gemini is not configured yet.'},503);
 // Best-effort per-isolate traffic guard; Google project quotas remain the hard usage limit.
 const who=request.headers.get('oai-authenticated-user-id')||request.headers.get('cf-connecting-ip')||'anonymous';const now=Date.now();
 for(const [key,v] of usage)if(now-v.start>60000)usage.delete(key);
 const u=usage.get(who)||{start:now,count:0};if(u.count>=8)return json({error:'Please wait a minute before asking again.'},429);u.count++;usage.set(who,u);
 let body;try{const raw=await request.text();if(raw.length>24000)return json({error:'Conversation is too long. Start a new chat.'},413);body=JSON.parse(raw);}catch{return json({error:'Invalid question.'},400);}
 const m=body.messages;if(!Array.isArray(m)||!m.length||m.length>12||m.some((x,i)=>!x||x.role!==(i%2?'assistant':'user')||typeof x.text!=='string'||!x.text.trim()||x.text.length>6000)||m.at(-1).role!=='user')return json({error:'Send a question of up to 6,000 characters.'},400);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
 try{
 const model=env.GEMINI_MODEL||'gemini-flash-latest';
 const response=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},signal:controller.signal,body:JSON.stringify({systemInstruction:{parts:[{text:'You are V3school, a helpful student tutor powered by Gemini. Answer general questions as well as programming questions. Be accurate, concise, friendly and transparent about uncertainty. Do not claim live web access or code execution. For learning topics give a specific definition, numbered simple steps, then a small example when useful. For C++ show safe beginner-friendly modern C++ code and explain errors and corrections. '+(body.language==='en'?'Reply in English unless the user requests another language.':'Explain in clear English and Urdu (Urdu script), unless the user requests one language. Keep code in its original language.')}]},contents:m.map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:x.text}]})),generationConfig:{maxOutputTokens:2048}})});
 if(!response.ok){return json({error:response.status===429?'Gemini quota is temporarily exhausted. Try later or check the Google project quota.':response.status===401||response.status===403?'Google rejected the Gemini credential. The app owner needs to replace or enable the key.':response.status===400?'Google could not accept this request. Check the key configuration or try a shorter question.':'Gemini is temporarily unavailable. Please try again.'},response.status===429?429:502);}
 const data=await response.json(),candidate=data.candidates?.[0];const text=(candidate?.content?.parts||[]).filter(x=>!x.thought).map(x=>x.text||'').join('');if(!text)return json({error:'Gemini returned no answer. Try rephrasing your question.'},502);
 return json({text,truncated:candidate.finishReason==='MAX_TOKENS'});
 }catch{return json({error:'Gemini could not be reached. Please try again.'},502);}finally{clearTimeout(timer);}
}
