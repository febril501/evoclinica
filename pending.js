import {cloudMe} from './tora-cloud.js';
async function refresh(){try{const u=await cloudMe();if(u.status==='approved')location.replace('/');else document.getElementById('msg').textContent=u.status==='suspended'?'Cuenta suspendida. Contacta al administrador.':'Aún pendiente de aprobación.'}catch{location.replace('/login')}}
document.getElementById('refresh').onclick=refresh;
document.getElementById('logout').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.replace('/login')};
refresh();
