(()=>{
  const key='tora:appearance';
  let current='light';
  try{current=localStorage.getItem(key)==='dark'?'dark':'light'}catch{}
  function setTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';document.querySelectorAll('#theme-toggle').forEach(i=>i.checked=dark);try{localStorage.setItem(key,dark?'dark':'light')}catch{}}
  setTheme(current==='dark');
  window.ToraTheme={toggle:()=>setTheme(document.documentElement.dataset.theme!=='dark'),setTheme};
  document.addEventListener('DOMContentLoaded',()=>{
    setTheme(document.documentElement.dataset.theme==='dark');
    document.querySelectorAll('#theme-toggle').forEach(i=>i.addEventListener('change',()=>setTheme(i.checked)));
    document.querySelectorAll('#today').forEach(e=>e.textContent=new Intl.DateTimeFormat('es-CL',{day:'numeric',month:'short',year:'numeric'}).format(new Date()));
    document.querySelectorAll('#avatar').forEach(e=>{const name=window.EVO_USER||'Usuario';e.textContent=name.trim().slice(0,2).toUpperCase()});
  });
})();
