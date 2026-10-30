import {cloudMe,cloudRequest,installAdminNav} from './tora-cloud.js';
const $=id=>document.getElementById(id);
const me=await cloudMe().catch(()=>null);
$('name').textContent=me?.username||'Usuario';
$('role').textContent=me?.cloud?`Estado: ${me.status} · Tipo de cuenta: ${me.role}`:'Modo de acceso anterior. Las contraseñas se configuran desde Render.';
$('change-password').disabled=!me?.cloud;
$('change-password').onclick=async()=>{const pass=$('new-password').value;try{await cloudRequest('/api/auth/password',{method:'POST',body:JSON.stringify({password:pass})});$('notice').textContent='Contraseña actualizada.';$('new-password').value=''}catch(e){$('notice').textContent=e.message}};
$('logout').onclick=()=>fetch('/api/logout',{method:'POST'}).finally(()=>location.replace('/login'));
installAdminNav(me);
