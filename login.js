import {cloudRequest,cloudMode} from './tora-cloud.js';
const $=id=>document.getElementById(id);
let mode='login',cloud=false;
function setMode(next){mode=next;const register=next==='register',forgot=next==='recover',reset=next==='reset';
 $('auth-tabs').classList.toggle('hidden',forgot||reset||!cloud);
 $('tab-login').classList.toggle('active',next==='login');$('tab-register').classList.toggle('active',register);
 $('name-wrap').classList.toggle('hidden',!register);$('password-repeat-wrap').classList.toggle('hidden',!register);
 $('pass').required=!forgot;$('user').required=!reset;$('pass').minLength=register||reset?12:1;
 $('pass').classList.toggle('hidden',forgot);
 const passLabel=document.querySelector('label[for="pass"]');passLabel.classList.toggle('hidden',forgot);
 $('pass').autocomplete=register||reset?'new-password':'current-password';
 $('user').classList.toggle('hidden',reset);$('user-label').classList.toggle('hidden',reset);
 $('forgot').classList.toggle('hidden',!cloud||register||forgot||reset);
 $('intro').textContent=forgot?'Te enviaremos un enlace para recuperar el acceso.':reset?'Elige una nueva contraseña segura.':register?'Regístrate con tu correo. El administrador deberá aprobar tu acceso.':'Tu espacio privado de documentación clínica académica.';
 $('submit').textContent=register?'Crear mi cuenta':forgot?'Enviar instrucciones':reset?'Cambiar contraseña':'Ingresar a TORA';
 $('msg').textContent='';
}
async function handleRecoveryFragment(){
 const hash=new URLSearchParams(location.hash.slice(1));
 const access_token=hash.get('access_token'),refresh_token=hash.get('refresh_token');
 if(!access_token||!refresh_token)return;
 const type=hash.get('type');
 history.replaceState(null,'',location.pathname+location.search); // eliminar inmediatamente tokens visibles de la URL
 try{await cloudRequest('/api/auth/adopt',{method:'POST',body:JSON.stringify({access_token,refresh_token,expires_in:Number(hash.get('expires_in'))||3600})});
  if(type==='recovery'){setMode('reset');return}
  location.replace('/');
 }catch(e){$('msg').textContent='No pudimos activar el enlace. '+e.message}
}
$('tab-login').onclick=()=>setMode('login');$('tab-register').onclick=()=>setMode('register');$('forgot').onclick=()=>setMode('recover');
$('login-form').onsubmit=async event=>{event.preventDefault();const btn=$('submit');btn.disabled=true;$('msg').textContent='';
 try{
  const email=$('user').value.trim(),password=$('pass').value;
  if(mode==='register'){
   if(password!==$('password_repeat').value)throw Error('Las contraseñas no coinciden.');
   const r=await cloudRequest('/api/auth/register',{method:'POST',body:JSON.stringify({email,password,display_name:$('display_name').value.trim()})});$('msg').textContent=r.message;return;
  }
  if(mode==='recover'){const r=await cloudRequest('/api/auth/recover',{method:'POST',body:JSON.stringify({email})});$('msg').textContent=r.message;return}
  if(mode==='reset'){await cloudRequest('/api/auth/password',{method:'POST',body:JSON.stringify({password})});$('msg').textContent='Contraseña actualizada. Ingresa nuevamente.';await fetch('/api/logout',{method:'POST'});setMode('login');return}
  if(cloud)await cloudRequest('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});
  else await cloudRequest('/api/login',{method:'POST',body:JSON.stringify({username:email,password})});
  location.replace('/');
 }catch(e){$('msg').textContent=e.message}finally{btn.disabled=false}
};
cloud=await cloudMode();$('auth-tabs').classList.toggle('hidden',!cloud);$('forgot').classList.toggle('hidden',!cloud);if(!cloud){$('user-label').textContent='Usuario';$('user').placeholder='Tu usuario';}
await handleRecoveryFragment();
