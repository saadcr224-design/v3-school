from pathlib import Path
p=Path('dist/app.js');s=p.read_text()
s=s.replace("practice:'Code playground'","portal:'Code portal'")
s=s.replace("${nav('practice','code')}","")
s=s.replace("${nav('progress','chart')}<div class=\"sidebar-bottom\">","${nav('progress','chart')}<div class=\"nav-label\">SEPARATE WORKSPACE</div>${nav('portal','code')}<div class=\"sidebar-bottom\">")
s=s.replace('A little practice. A big difference.','Understand one idea at a time.').replace('One concept a day is a great place to start.','Read the definition. Follow the steps. See the result.')
s=s.replace('A little curiosity. A little code. A lot of possibility.','Clear definitions. Small steps. Real understanding.')
s=s.replace('Understand it.<br>Code it. <span>Make it yours.</span>','Learn C++.<br><span>One clear step at a time.</span>')
s=s.replace('From your first line to modern C++.<br>Clear explanations in English & Urdu, with room to practice.','From the language basics to modern C++.<br>Definitions, numbered explanations, and examples in English & Urdu.')
s=s.replace("['50','Beyond-the-book topics','bolt']","[lessons.filter(x=>!x.overview).length,'Individual topic guides','bolt']")
s=s.replace("'Bite-sized lessons'","'Topics & chapter guides'")
s=s.replace('Completed — revisit or try the practice','Completed — revisit the explanation').replace('One idea, a simple example, and a little practice.','A definition, three clear steps, and an explained example.')
start=s.index('<section class="side-panel challenge"><span class="tag">A LITTLE CHALLENGE')
end=s.index('<div class="tip">',start)
s=s[:start]+'''<section class="side-panel challenge"><span class="tag">A CLEARER WAY TO LEARN</span><h3>Understand the why.</h3><p>Every lesson has a definition, numbered explanations, and an example with its output.</p><div class="reading-sequence"><span>01 · Definition</span><span>02 · Step-by-step explanation</span><span>03 · Code & result</span></div><button class="btn" data-go="learn">Find your next concept ${icon('arrow')}</button></section>'''+s[end:]
s=s.replace('Example + practice','Steps + explained example')
s=s.replace('16 book chapters. 50 added roadmap topics. Original explanations, in two languages.',"${lessons.length} topics and chapter guides · Basics, OOP, standard library, modern C++, and tools.")
# The old subtitle is inside a nested JS expression, so render dynamic text correctly.
s=s.replace("'${lessons.length} topics and chapter guides · Basics, OOP, standard library, modern C++, and tools.'","`${lessons.length} topics and chapter guides · Basics, OOP, standard library, modern C++, and tools.`")
s=s.replace("['All','Book','Foundations','OOP','Modern','Concurrency','Practical']","['All','Topics','Guides','Book','Foundations','OOP','Modern','Concurrency','Practical']")
s=s.replace("filter==='All'||filter==='Book'","filter==='All'||filter==='Topics'&&!l.overview||filter==='Guides'&&l.overview||filter==='Book'")
s=s.replace("l.definition+' '+l.urdu", "l.definition+' '+l.definitionUr+' '+l.urdu")
s=s.replace('Answers come from the 79-lesson library.', 'Answers come from the ${lessons.length}-guide library.')
s=s.replace('<button class="btn" data-action="try" data-id="${l.id}">Practice this</button>','')
s=s.replace('lesson,practice,tutor,progress','lesson,portal:practice,tutor,progress')
s=s.replace("go('practice'", "go('portal'")
s=s.replace('Your ideas. Real code.','Code portal').replace('Experiment, make mistakes, and find your way forward.','Your separate coding workspace. Lesson reading stays in the learning library.')
s=s.replace('YOUR PRACTICE PROMPT','PORTAL TASK').replace('Review the lesson','Read the related topic')
# Replace the reader, preserving progress and original IDs.
a=s.index('function lesson(){');b=s.index('\nfunction practice()',a)
s=s[:a]+'''function lesson(){
 const l=lessons.find(x=>x.id===current)||lessons[0];
 const related=lessons.filter(x=>x.group===l.group&&x.id!==l.id).sort((a,b)=>Number(a.overview)-Number(b.overview));
 const sections=[['definition','Definition'],['steps','Step by step'],['example','Code example'],['result','Expected output'],['remember','Remember']];
 return `<button class="back" data-go="learn">${icon('back')} All topics</button><div class="lesson-layout"><article class="lesson-body"><div class="reader-meta"><span class="tag">${esc(l.group)}</span><span class="tag">${l.overview?'CHAPTER GUIDE':'INDIVIDUAL TOPIC'}</span><span>${l.minutes} min read</span></div><h1>${esc(l.title)}</h1>${lang==='both'?`<div class="urdu lesson-title-ur" lang="ur">${esc(l.ur)}</div>`:''}<div class="reader-jump">${sections.map(([id,t])=>`<a href="#${id}" data-section="${id}">${t}</a>`).join('')}</div><section id="definition" class="reader-section"><div class="section-kicker">01 / THE MEANING</div><h2>What is ${esc(l.title)}?</h2><div class="definition-box"><span class="language-tag">ENGLISH DEFINITION</span><p class="definition">${esc(l.definition)}</p>${lang==='both'?`<div class="definition-ur"><span class="language-tag">اردو تعریف</span><p class="urdu" lang="ur">${esc(l.definitionUr)}</p></div>`:''}</div></section><section id="steps" class="reader-section"><div class="section-kicker">02 / BUILD YOUR UNDERSTANDING</div><h2>Let's understand it, step by step.</h2><div class="lesson-steps">${l.steps.map((st,i)=>`<div class="lesson-step"><span class="step-num">${i+1}</span><div class="step-content"><h3>${esc(st.title)}</h3><p>${esc(st.en)}</p>${lang==='both'?`<p class="urdu step-ur" lang="ur">${esc(st.ur)}</p>`:''}</div></div>`).join('')}</div></section><section id="example" class="reader-section"><div class="section-kicker">03 / SEE THE IDEA IN CODE</div><h2>A small, complete example.</h2><p class="example-intro">Read the comments, then follow the numbered explanation above. This is a complete C++23 program.</p>${codeblock(l.code)}</section><section id="result" class="reader-section"><div class="section-kicker">04 / CONNECT CODE TO RESULT</div><h2>What this program produces.</h2>${l.sampleInput?`<label class="language-tag">EXAMPLE INPUT</label><pre class="sample-input">${esc(l.sampleInput)}</pre>`:''}<div class="expected-output"><div class="code-header"><span>EXPECTED OUTPUT</span><span>✓ Verified example</span></div><pre>${esc(l.output||'(No console output)')}</pre></div><p class="small-note">${esc(l.outputNote||'Expected output for the displayed example.')}</p></section><section id="remember" class="reader-section"><div class="remember-box">${icon('spark')}<div><h3>Keep this in mind</h3><p>${esc(l.takeaway)}</p></div></div></section><div class="lesson-actions"><button class="btn ${state.done.includes(l.id)?'white':''}" data-action="complete">${icon('check')}${state.done.includes(l.id)?'Completed · undo':'I understand this topic'}</button><button class="btn white" data-action="bookmark">${icon('bookmark')}${state.saved.includes(l.id)?'Saved':'Save topic'}</button><button class="btn white" data-action="askLesson">${icon('chat')} Find related explanations</button></div><p class="small-note">${esc(l.source)} · Original learning notes and examples.</p></article><div class="reader-side"><section class="side-panel"><span class="eyebrow">ON THIS PAGE</span><nav class="page-toc">${sections.map(([id,t],i)=>`<a href="#${id}" data-section="${id}"><span>0${i+1}</span>${t}</a>`).join('')}</nav></section><section class="side-panel toc"><h3>Related topics</h3>${related.slice(0,12).map(x=>`<button data-go="lesson" data-id="${x.id}">${state.done.includes(x.id)?'✓ ':''}${esc(x.title)}</button>`).join('')||'<p>Explore the topic library for your next concept.</p>'}</section><button class="btn white" data-go="lesson" data-id="${current===lessons.length?1:current+1}">Next topic ${icon('arrow')}</button></div></div>`;
}'''+s[b:]
# Better tutor: step-based answers with a precise direct-topic match.
s=s.replace("(l.title.toLowerCase().includes(t)?5:matches(l,t)?1:0)","(l.title.toLowerCase()===t?12:l.title.toLowerCase().includes(t)?5:matches(l,t)?1:0)")
s=s.replace(".sort((a,b)=>b.s-a.s)",".sort((a,b)=>b.s-a.s||Number(a.l.overview)-Number(b.l.overview))")
s=s.replace('<p>${esc(l.explanation)}</p>${lang', '<ol class="tutor-steps">${l.steps.map(st=>`<li><b>${esc(st.title)}</b><p>${esc(st.en)}</p>${lang===\'both\'?`<p class="urdu" lang="ur">${esc(st.ur)}</p>`:\'\'}</li>`).join(\'\')}</ol>${lang')
# Preserve old saved links but expose only the portal route in navigation.
s=s.replace("const [r,id]=location.hash.slice(1).split('/');", "let [r,id]=location.hash.slice(1).split('/');if(r==='practice')r='portal';")
# Click-based section scrolling avoids corrupting the app route hash.
s += "\\n".replace('\\n','\n')+"document.addEventListener('click',e=>{const link=e.target.closest('[data-section]');if(link){e.preventDefault();document.getElementById(link.dataset.section)?.scrollIntoView({behavior:'smooth',block:'start'});}});\n"
p.write_text(s)
