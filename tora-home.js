import {FLOW_SPECIALTIES} from './workflow-config.js';
const $=id=>document.getElementById(id);
const path=location.pathname;
const view=path==='/especialidades'?'specialties':path==='/configuracion'?'settings':'home';
for(const v of ['home','specialties','settings']){const e=$(v+'-view');if(e)e.classList.toggle('hidden',v!==view)}
const labels={home:'Inicio',specialties:'Especialidades',settings:'Configuración'};
$('crumb').textContent=labels[view];
document.querySelectorAll('[data-nav]').forEach(a=>{const isCurrent=a.dataset.nav===view;a.classList.toggle('active',isCurrent);if(isCurrent)a.setAttribute('aria-current','page')});
$('username').textContent=window.EVO_USER||'Usuario';
const root=$('specialty-grid');const icons={interna:'♡',ginecologia:'♧',psiquiatria:'♧',traumatologia:'⌁',urgencias:'✚',uci:'▥',cirugia:'✂',pediatria:'♙',aps:'⌂'};
for(const [id,spec] of Object.entries(FLOW_SPECIALTIES)){
 const a=document.createElement('a');a.className='specialty-link';a.href='/flujo?especialidad='+encodeURIComponent(id);const icon=document.createElement('span');icon.className='symbol';icon.textContent=icons[id]||'✦';const strong=document.createElement('strong');strong.textContent=spec.name;const small=document.createElement('small');small.textContent='Ingreso · Evolución del día · Control';a.append(icon,strong,small);root.append(a)
}
$('settings-theme').onclick=()=>window.ToraTheme?.toggle();
$('logout').onclick=()=>fetch('/api/logout',{method:'POST',headers:{'Content-Type':'application/json'}}).finally(()=>location.href='/login');
fetch('/api/status').then(r=>r.json()).then(v=>{const m=v.aiConfigured?'● Gemini conectado':'○ IA no configurada';$('home-ai').textContent=m;$('settings-ai').textContent=v.aiConfigured?'Gemini está configurado en el servidor.':'Gemini no está configurado. Las plantillas locales siguen disponibles.'}).catch(()=>{$('home-ai').textContent='Servidor no disponible';$('settings-ai').textContent='No se pudo consultar el estado del servidor.'});
