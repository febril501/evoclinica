(()=>{
  const key='tora:appearance';
  let current='light',cloud=false;
  try{current=localStorage.getItem(key)==='dark'?'dark':'light'}catch{}
  function setTheme(dark,persist=true){document.documentElement.dataset.theme=dark?'dark':'light';document.querySelectorAll('#theme-toggle').forEach(i=>i.checked=dark);try{localStorage.setItem(key,dark?'dark':'light')}catch{};if(cloud&&persist)fetch('/api/data/preferences',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme:dark?'dark':'light'})}).catch(()=>{})}
  setTheme(current==='dark',false);
  fetch('/api/me').then(r=>r.json()).then(async me=>{if(!me.cloud)return;const r=await fetch('/api/data/preferences');if(!r.ok)return;const prefs=await r.json();if(['dark','light'].includes(prefs.theme))setTheme(prefs.theme==='dark',false);cloud=true}).catch(()=>{});
  window.ToraTheme={toggle:()=>setTheme(document.documentElement.dataset.theme!=='dark'),setTheme};
  document.addEventListener('DOMContentLoaded',()=>{
    setTheme(document.documentElement.dataset.theme==='dark');
    document.querySelectorAll('#theme-toggle').forEach(i=>i.addEventListener('change',()=>setTheme(i.checked)));
    document.querySelectorAll('#today').forEach(e=>e.textContent=new Intl.DateTimeFormat('es-CL',{day:'numeric',month:'short',year:'numeric'}).format(new Date()));
    document.querySelectorAll('#avatar').forEach(e=>{const name=window.TORA_DISPLAY_NAME||window.EVO_USER||'Usuario';e.textContent=name.trim().slice(0,2).toUpperCase()});
  });
})();
