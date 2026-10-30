import {remoteEvolutions,remoteSaveEvolution,remoteDeleteEvolution,cloudMe,installAdminNav} from './tora-cloud.js';
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const d=document.createElement(tag);if(cls)d.className=cls;if(text!==undefined)d.textContent=text;return d};
let all=[];
const notice=text=>$('notice').textContent=text;
function draw(){const q=$('search').value.trim().toLocaleLowerCase('es'),root=$('evolutions-list');root.replaceChildren();
 const records=all.filter(x=>`${x.title} ${x.specialty}`.toLocaleLowerCase('es').includes(q));if(!records.length){root.append(el('p','input-hint','No hay evoluciones guardadas que coincidan.'));return}
 for(const record of records){const card=el('div','card');card.style.marginTop='12px';const h=el('h3','',record.title);h.style.margin='0 0 6px';const meta=el('p','input-hint',`${record.specialty} · ${new Date(record.updated_at).toLocaleString('es-CL')} · ${record.status==='final'?'Revisada':'Borrador'}`);const editor=el('textarea');editor.value=record.content;editor.rows=8;editor.style.width='100%';editor.maxLength=16000;const titleLabel=el('label','','Título');const input=el('input');input.value=record.title;input.maxLength=180;const controls=el('div','action-grid');
 const save=el('button','button soft','Guardar cambios'),prev=el('button','button soft','Usar como evolución anterior'),copy=el('button','button soft','Copiar'),del=el('button','button soft','Eliminar');
 for(const b of [save,prev,copy,del])b.type='button';
 save.onclick=async()=>{if(!confirm('¿Confirmas que este documento contiene solo datos ficticios o desidentificados?'))return;try{const result=await remoteSaveEvolution({...record,title:input.value,content:editor.value});if(!result?.length)throw Error('No se guardaron los cambios.');notice('Cambios guardados.');await refresh()}catch(e){notice(e.message)}};
 prev.onclick=()=>location.assign('/flujo?tipo=diaria&desde='+encodeURIComponent(record.id));
 copy.onclick=()=>navigator.clipboard.writeText(editor.value).then(()=>notice('Copiado.')).catch(()=>notice('No se pudo copiar.'));
 del.onclick=async()=>{if(!confirm('¿Eliminar definitivamente esta evolución?'))return;try{const result=await remoteDeleteEvolution(record.id);if(!result?.length)throw Error('No se eliminó el registro.');notice('Evolución eliminada.');await refresh()}catch(e){notice(e.message)}};
 controls.append(save,prev,copy,del);card.append(h,meta,titleLabel,input,editor,controls);root.append(card)
 }
}
async function refresh(){try{all=await remoteEvolutions();draw()}catch(e){notice(e.message)}}
$('search').oninput=draw;$('logout').onclick=()=>fetch('/api/logout',{method:'POST'}).finally(()=>location.replace('/login'));
const me=await cloudMe().catch(()=>null);if(!me?.cloud){$('evolutions-list').textContent='Activa Supabase para guardar evoluciones.'}else{installAdminNav(me);await refresh()}
