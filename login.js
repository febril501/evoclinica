document.querySelector('#login-form').addEventListener('submit',async event=>{
 event.preventDefault();const btn=document.querySelector('#submit'),msg=document.querySelector('#msg');btn.disabled=true;msg.textContent='';
 try{const username=document.querySelector('#user').value.trim(),password=document.querySelector('#pass').value;
 const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password}),credentials:'same-origin'});
 const body=await res.json();if(!res.ok)throw new Error(body.error||'Error de ingreso.');location.assign('/');
 }catch(err){msg.textContent=err.message;}finally{btn.disabled=false}
});