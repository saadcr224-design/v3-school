(() => {
  let registration=null, installPrompt=null, ready=false, waiting=false;
  let message='Preparing offline lessons…';
  const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function refresh(){
    document.querySelectorAll('[data-offline-status]').forEach(el=>{el.textContent=ready?(navigator.onLine?'Ready offline · 186 guides':'Offline · 186 guides available'):message;el.classList.toggle('ready',ready);});
    document.querySelectorAll('[data-install-now]').forEach(el=>{el.hidden=!installPrompt||installed();});
    document.querySelectorAll('[data-update-app]').forEach(el=>{el.hidden=!waiting;});
    document.querySelectorAll('[data-installed-status]').forEach(el=>{el.textContent=installed()?'You are using the installed app.':'Install on this device for quick access.';});
    const check=document.querySelector('#checkAnswer');if(check)check.disabled=!navigator.onLine;
    const run=document.querySelector('#run');
    if(run){run.disabled=!navigator.onLine;run.title=navigator.onLine?'':'Code execution needs an internet connection.';}
    document.querySelectorAll('[data-network-note]').forEach(el=>el.hidden=navigator.onLine);
  }
  async function checkReady(){
    const worker=navigator.serviceWorker?.controller;
    if(!worker){refresh();return;}
    const channel=new MessageChannel();
    const timeout=setTimeout(()=>{message='Offline download not confirmed. Reconnect and retry.';refresh();},7000);
    channel.port1.onmessage=e=>{clearTimeout(timeout);ready=e.data?.ready===true;message=ready?'Ready offline':'Offline files are incomplete. Reconnect and retry.';refresh();channel.port1.close();};
    worker.postMessage({type:'OFFLINE_STATUS'},[channel.port2]);
  }
  async function register(){
    if(!('serviceWorker' in navigator)||!window.isSecureContext){message='Offline installation is not supported in this browser.';refresh();return;}
    try{
      registration=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
      waiting=!!registration.waiting;
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;
        worker?.addEventListener('statechange',()=>{
          if(worker.state==='installed'){waiting=!!navigator.serviceWorker.controller;checkReady();}
          if(worker.state==='redundant'){message='Offline download failed. Reconnect and retry.';refresh();}
          refresh();
        });
      });
      await checkReady();
      navigator.serviceWorker.ready.then(checkReady);
    }catch(error){message='Offline setup failed. Reconnect and retry.';refresh();}
  }
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;refresh();});
  window.addEventListener('appinstalled',()=>{installPrompt=null;refresh();});
  window.addEventListener('online',()=>{refresh();checkReady();});
  window.addEventListener('offline',refresh);
  let applying=false;
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(applying){location.reload();return;}checkReady();});
  document.addEventListener('click',async e=>{
    if(e.target.closest('[data-install-now]')&&installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();await prompt.userChoice;refresh();}
    if(e.target.closest('[data-update-app]')&&registration?.waiting){applying=true;registration.waiting.postMessage({type:'APPLY_UPDATE'});}
    if(e.target.closest('[data-offline-retry]')){message='Checking offline download…';refresh();await register();if(registration)try{await registration.update();await checkReady();}catch{message='Cannot check for updates while disconnected.';refresh();}}
    if(e.target.closest('[data-keep-offline]')){let granted=false;try{granted=await navigator.storage?.persist?.();}catch{}const target=document.querySelector('[data-storage-status]');if(target)target.textContent=granted?'Persistent storage granted.':'This browser manages offline storage. Export progress regularly.';}
  });
  window.V3PWA={refresh,checkReady};
  register();
})();
