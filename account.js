const exit=document.createElement('button');
exit.type='button';exit.textContent='Cerrar sesión';exit.title='Salir de EvoClínica';
exit.style.cssText='position:fixed;z-index:9999;right:16px;bottom:16px;background:#123e38;color:white;border:1px solid #bed3cc;border-radius:10px;padding:10px 16px;font:600 13px system-ui;cursor:pointer;box-shadow:0 3px 15px #0003';
exit.addEventListener('click',async()=>{try{await fetch('/api/logout',{method:'POST'});}finally{location.replace('/login')}});
document.body.append(exit);
