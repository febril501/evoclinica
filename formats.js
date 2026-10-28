import {FLOW_SPECIALTIES} from './workflow-config.js';
import {defaultFormat,loadFormat,saveFormat,validateClinicalFormat,parseFormatHeadings,userFormatsKey} from './clinical-formats.js';
const $=id=>document.getElementById(id);const user=window.EVO_USER||'local';
function notice(msg,error=false){$('fmt-status').textContent=msg;$('fmt-status').style.color=error?'var(--accent)':'var(--green)'}
function load(){const sp=$('fmt-specialty').value;const f=loadFormat(sp,user);$('fmt-name').value=f.name;$('fmt-headings').value=f.headings.join('\n');$('fmt-instruction').value=f.instruction;$('fmt-status').textContent=f.updatedAt?'Formato guardado en este navegador.':'Sugerencia inicial: puedes personalizarla y guardarla.'}
function fillDefault(){const f=defaultFormat($('fmt-specialty').value);$('fmt-name').value=f.name;$('fmt-headings').value=f.headings.join('\n');$('fmt-instruction').value=f.instruction;notice('Sugerencia restaurada en el editor. Presiona Guardar para aplicarla.')}
function save(){try{const specialty=$('fmt-specialty').value;const f={specialty,name:$('fmt-name').value,headings:$('fmt-headings').value.split('\n').map(x=>x.trim()).filter(Boolean),instruction:$('fmt-instruction').value};saveFormat(f,user);notice('✓ Formato guardado. TORA lo utilizará automáticamente al generar evoluciones.')}catch(e){notice(e.message,true)}}
function extract(){const text=$('fmt-example').value;
 if(/\b(?:\d{1,2}\.?\d{3}\.?\d{3}[-–][0-9kK]|\+56\s*9\d+|@\w+\.\w+)\b/i.test(text)){$('fmt-extract-info').textContent='El texto podría contener identificadores. Usa solo títulos vacíos.';return}
 const titles=parseFormatHeadings(text);if(titles.length<2){$('fmt-extract-info').textContent='No detecté al menos dos títulos. Escríbelos uno por línea terminados en dos puntos o en mayúsculas.';return}
 $('fmt-headings').value=titles.join('\n');$('fmt-example').value='';$('fmt-extract-info').textContent=`${titles.length} títulos detectados. Revisa el editor y presiona Guardar.`;
}
function exportFormats(){let parsed={};try{parsed=JSON.parse(localStorage.getItem(userFormatsKey(user))||'{}')}catch{}
 const output={kind:'tora-formats',version:1,formats:parsed};const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='TORA_mis_formatos.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)
}
async function importFormats(evt){const file=evt.target.files?.[0];if(!file)return;try{if(file.size>50000)throw Error('Archivo demasiado grande.');const data=JSON.parse(await file.text());if(data.kind!=='tora-formats'||data.version!==1||!data.formats||typeof data.formats!=='object')throw Error('Respaldo incompatible.');let count=0;for(const [spec,format] of Object.entries(data.formats)){if(FLOW_SPECIALTIES[spec]){saveFormat(validateClinicalFormat(format,spec),user);count++}}if(!count)throw Error('No se encontraron formatos válidos.');load();notice(`${count} formato(s) importado(s) correctamente.`)}catch(e){notice(e.message,true)}finally{evt.target.value=''}}
for(const [id,sp] of Object.entries(FLOW_SPECIALTIES)){const op=document.createElement('option');op.value=id;op.textContent=sp.name;$('fmt-specialty').append(op)}
$('fmt-specialty').onchange=load;$('fmt-save').onclick=save;$('fmt-restore').onclick=fillDefault;$('fmt-extract').onclick=extract;$('fmt-export').onclick=exportFormats;$('fmt-import').onchange=importFormats;$('logout').onclick=()=>fetch('/api/logout',{method:'POST'}).finally(()=>location.href='/login');$('username').textContent=user;
const requested=new URLSearchParams(location.search).get('especialidad');if(requested&&FLOW_SPECIALTIES[requested])$('fmt-specialty').value=requested;load();
