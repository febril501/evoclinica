import {FLOW_SPECIALTIES,DOC_TYPES} from './workflow-config.js';
import {scanSensitive,validateProfile} from './engine.js';

const strip=s=>typeof s==='string'?s.trim():'';
const MAX_NOTE=2200;
export function presentSection(section,original){
  // Coincidencias SOLO orientativas. No transformarlas automáticamente en hallazgos de hoy.
  if(!strip(original))return [];
  const fragment=original.split(/(?<=[.;\n])\s+/).map(v=>v.trim()).filter(v=>v.length>8);
  const words=section.keywords||[];
  return fragment.filter(p=>words.some(w=>p.toLocaleLowerCase('es').includes(w.toLocaleLowerCase('es')))).slice(0,3).map(s=>s.slice(0,350));
}
export function emptyWorkflow(specialty='interna',docType='diaria'){
  if(!FLOW_SPECIALTIES[specialty])specialty='interna';
  if(!DOC_TYPES[docType])docType='diaria';
  return {specialty,docType,previous:'',general:'',sections:FLOW_SPECIALTIES[specialty].sections.map(s=>({id:s.id,status:'pendiente',notes:'',selected:[],source:'no_precisada'})),obstetrics:{pregnancy:'no_informado',gestas:'',partos:'',perdidas:'',cesareas:'',vivos:'',fur:'',eg:'',fpp:''},trauma:{region:'rodilla',side:'no_informado',maneuver:'',result:''},custom:[],format:'adaptable',profile:null};
}
export function validateWorkflow(input){
  if(!input||typeof input!=='object'||!FLOW_SPECIALTIES[input.specialty]||!DOC_TYPES[input.docType])throw Error('Especialidad o modalidad inválida.');
  const spec=FLOW_SPECIALTIES[input.specialty];
  const previous=strip(input.previous),general=strip(input.general);
  if(previous.length>12000||general.length>7000)throw Error('Texto demasiado extenso.');
  const allowed=new Map(spec.sections.map(s=>[s.id,s]));
  if(!Array.isArray(input.sections)||input.sections.length>spec.sections.length+4)throw Error('Apartados inválidos.');
  const statuses=['pendiente','cambio','igual','nuevo'];
  const sourceChoices=['no_precisada','observado','referido','documentado'];
  const seen=new Set();const sections=[];
  for(const item of input.sections){
    if(!item||!allowed.has(item.id)||seen.has(item.id))throw Error('Apartado desconocido o duplicado.');
    seen.add(item.id);const definition=allowed.get(item.id);
    if(!statuses.includes(item.status))throw Error('Estado de apartado inválido.');
    const notes=strip(item.notes);if(notes.length>MAX_NOTE)throw Error('Observación demasiado extensa.');
    const selected=Array.isArray(item.selected)?item.selected.filter(v=>typeof v==='string'&&definition.quick.includes(v)).slice(0,8):[];
    const source=sourceChoices.includes(item.source)?item.source:'no_precisada';
    if(item.status==='pendiente'&&(notes||selected.length))throw Error('Un apartado no evaluado no puede registrar hallazgos actuales.');
    // Sin cambios no autoriza copiar datos previos por omisión. Se requiere especificar hallazgo.
    if(item.status==='igual'&&!notes&&!selected.length)throw Error(`En «${definition.label}», especifica el hallazgo confirmado hoy o marca No evaluado.`);
    if(item.status!=='pendiente'&&!notes&&!selected.length)throw Error(`Describe el hallazgo actual en «${definition.label}».`);
    sections.push({id:item.id,label:definition.label,status:item.status,notes,selected,source,priorClues:input.docType==='diaria'?presentSection(definition,previous):[]});
  }
  let obs=null;
  if(input.specialty==='ginecologia'){
    const src=input.obstetrics||{};
    const pregnancy=['si','no','no_informado'].includes(src.pregnancy)?src.pregnancy:'no_informado';
    obs={pregnancy};
    for(const k of ['gestas','partos','perdidas','cesareas','vivos']){
      const value=strip(src[k]);if(value&&!/^(?:0|[1-9]\d{0,2})$/.test(value))throw Error('Los antecedentes ginecoobstétricos deben ser números enteros no negativos.');
      obs[k]=value;
    }
    for(const k of ['fur','eg','fpp'])obs[k]=strip(src[k]).slice(0,80);
    if(pregnancy!=='si'){obs.eg='';obs.fpp='';}
  }
  let trauma=null;
  if(input.specialty==='traumatologia'){
    const src=input.trauma||{};
    trauma={region:['rodilla','hombro','tobillo','cadera','columna','otra'].includes(src.region)?src.region:'otra',side:['derecha','izquierda','bilateral','no_informado'].includes(src.side)?src.side:'no_informado',maneuver:strip(src.maneuver).slice(0,70),result:strip(src.result).slice(0,200)};
    if(trauma.maneuver&&!trauma.result)throw Error('Para registrar una maniobra, especifica el resultado confirmado.');
  }
  if(!Array.isArray(input.custom)||input.custom.length>4)throw Error('Máximo cuatro apartados personalizados.');
  const custom=input.custom.map((s,i)=>({id:'personal_'+i,label:strip(s.label).slice(0,65),status:statuses.includes(s.status)?s.status:'pendiente',notes:strip(s.notes).slice(0,MAX_NOTE),source:sourceChoices.includes(s.source)?s.source:'no_precisada'}));
  if(custom.some(s=>!s.label||s.status==='pendiente'&&s.notes||s.status!=='pendiente'&&!s.notes))throw Error('Revisa los apartados personalizados y sus observaciones.');
  const obsData=obs?Object.entries(obs).filter(([k,v])=>Boolean(v)&&v!=='no_informado').map(([k,v])=>`${k}: ${v}`).join(' '):'';
  const traumaData=trauma&&(trauma.result||trauma.side!=='no_informado')?[trauma.region,trauma.side!=='no_informado'?trauma.side:'',trauma.maneuver,trauma.result].join(' '):'';
  const info=[general,...sections.flatMap(s=>[s.notes,...s.selected]),...custom.map(s=>s.notes),obsData,traumaData].join(' ').trim();
  if(info.length<12)throw Error('Escribe al menos un hallazgo actual o información del ingreso/control.');
  if(input.docType==='diaria'&&!previous)throw Error('Pega la evolución anterior para utilizar el comparador; para una evaluación sin evolución previa, usa Ingreso o Control.');
  if(input.docType==='diaria'&&!general&&!sections.some(s=>s.status!=='pendiente')&&!custom.some(s=>s.status!=='pendiente'))throw Error('Registra al menos un cambio o hallazgo del día.');
  const allText=[previous,info,typeof input.profile?.instruction==='string'?input.profile.instruction:''].join('\n');
  const hazards=scanSensitive(allText);if(hazards.length)throw Error('Posibles identificadores detectados: '+hazards.join(', ')+'. Usa solo casos ficticios.');
  const format=['adaptable','narrativo','sistemas','problemas'].includes(input.format)?input.format:'adaptable';
  const profile=validateProfile(input.profile,input.specialty);
  return {specialty:input.specialty,specialtyName:spec.name,docType:input.docType,docTypeName:DOC_TYPES[input.docType].label,previous:input.docType==='diaria'?previous:'',general,sections,obstetrics:obs,trauma,custom,format,profile};
}
export function workflowFindings(data){
 const warnings=[],missing=[];
 if(data.docType==='diaria'&&data.previous){
   for(const part of data.sections.filter(s=>s.status==='pendiente'&&s.priorClues.length))missing.push(`${part.label}: hay datos en la evolución anterior sin reevaluación documentada.`);
 }
 for(const part of [...data.sections,...data.custom]){
   if(part.status==='pendiente')continue;
   if(part.status==='igual'&&!part.notes&&!part.selected?.length)warnings.push(`${part.label}: no se detalló lo confirmado.`);
   if(part.source==='no_precisada')warnings.push(`${part.label}: no se precisó si es referido, observado o documentado.`);
 }
 if(data.specialty==='psiquiatria'&&data.docType==='diaria'&&!data.sections.some(s=>s.id==='riesgo'&&s.status!=='pendiente'))missing.push('Riesgo suicida: sin reevaluación actual documentada; no debe interpretarse como negativo.');
 if(data.specialty==='ginecologia'&&data.obstetrics?.pregnancy==='si'&&!data.obstetrics.eg)missing.push('Gestación actual: edad gestacional no informada.');
 if(data.specialty==='traumatologia'&&data.trauma?.maneuver&&!data.trauma.result)warnings.push('Maniobra consignada sin resultado.');
 return {warnings,missing};
}
export function workflowLocalDraft(data){
 const title=`${data.docTypeName.toUpperCase()} · ${data.specialtyName.toUpperCase()}`;
 const lines=[title];
 // El borrador local nunca copia los datos anteriores; solo los cambios actuales confirmados.
 if(data.docType==='diaria')lines.push('\n[La evolución anterior se utilizó únicamente para la revisión comparativa; no se incorpora aquí como exploración actual.]');
 if(data.general)lines.push('\nNOVEDADES REGISTRADAS HOY\n'+data.general);
 if(data.obstetrics&&Object.values(data.obstetrics).some(v=>v&&v!=='no_informado')){
   const p=data.obstetrics;const values=[['Gestas',p.gestas],['Partos',p.partos],['Pérdidas',p.perdidas],['Cesáreas',p.cesareas],['Hijos vivos',p.vivos],['FUR',p.fur],['EG',p.eg],['FPP',p.fpp]].filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`);
   if(p.pregnancy!=='no_informado')values.unshift(`Gestación actual declarada: ${p.pregnancy==='si'?'sí':'no'}`);
   if(values.length)lines.push('\nANTECEDENTES DECLARADOS\n'+values.join(' · '));
 }
 if(data.trauma&&(data.trauma.result||data.trauma.side!=='no_informado')){
   lines.push('\nLOCALIZACIÓN / MANIOBRA\n'+`Región: ${data.trauma.region}`+(data.trauma.side!=='no_informado'?` · Lado: ${data.trauma.side}`:'')+(data.trauma.result?` · ${data.trauma.maneuver}: ${data.trauma.result}`:''));
 }
 for(const s of [...data.sections,...data.custom]){
   if(s.status==='pendiente')continue;
   const pieces=[...(s.selected||[]),s.notes].filter(Boolean);
   lines.push(`\n${s.label.toUpperCase()} [${s.status==='igual'?'REEVALUADO SIN CAMBIOS':s.status==='cambio'?'CAMBIÓ':'NUEVO'}]`+'\n'+pieces.join('. ')+(s.source==='no_precisada'?'':'\nFuente: '+s.source));
 }
 const {warnings,missing}=workflowFindings(data);
 if(missing.length)lines.push('\nPOR REEVALUAR (NO INCORPORADO COMO HALLAZGO ACTUAL)\n'+missing.join('\n'));
 return {note:lines.join('\n').trim(),warnings,missing};
}
