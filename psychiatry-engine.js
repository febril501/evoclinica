import { scanSensitive } from './engine.js';

// Datos y reglas de redacción: nunca se infieren exploraciones a partir de campos vacíos.
export const PSY_STORE='evoclinica:psychiatry:styles:v1';
export const COMPONENTS=[
 {id:'conciencia',label:'Conciencia y orientación',short:'Conciencia',normal:'Vigil y orientado en tiempo, espacio y persona.',options:['Compromiso de conciencia','Desorientación temporal','Desorientación espacial','Desorientación autopsíquica','Somnolencia','Hipervigilancia']},
 {id:'presentacion',label:'Presentación, vestimenta e higiene',short:'Presentación',normal:'Presentación e higiene adecuadas al contexto.',options:['Higiene descuidada','Vestimenta inadecuada','Aspecto extravagante','Autocuidado disminuido','Edad aparente discordante']},
 {id:'contacto',label:'Contacto visual y actitud',short:'Contacto y actitud',normal:'Contacto visual adecuado y actitud cooperadora durante la entrevista.',options:['Contacto visual escaso','Actitud poco cooperadora','Hostilidad','Actitud suspicaz','Pseudocontacto','Reticencia']},
 {id:'psicomotricidad',label:'Conducta y psicomotricidad',short:'Psicomotricidad',normal:'Actividad psicomotora sin alteraciones observadas.',options:['Inquietud psicomotora','Agitación','Retardo psicomotor','Estereotipias','Manierismos','Catatonía']},
 {id:'animo',label:'Ánimo subjetivo',short:'Ánimo',normal:'Refiere ánimo eutímico.',options:['Ánimo depresivo','Ánimo ansioso','Ánimo irritable','Ánimo elevado','Labilidad subjetiva','Ánimo disfórico']},
 {id:'afecto',label:'Afectividad',short:'Afecto',normal:'Afecto de rango y reactividad conservados, congruente con el discurso.',options:['Afecto restringido','Afecto embotado','Afecto aplanado','Hiporreactividad','Labilidad afectiva','Incongruencia afectiva','Modulación disminuida']},
 {id:'lenguaje',label:'Lenguaje',short:'Lenguaje',normal:'Lenguaje espontáneo, fluido y coherente, de velocidad conservada.',options:['Pobreza del habla','Logorrea','Bradifemia','Presión del habla','Mutismo','Disartria','Verbigeración','Perseveración verbal']},
 {id:'pensamiento',label:'Pensamiento: velocidad, curso y contenido',short:'Pensamiento',normal:'Pensamiento de velocidad y curso formal conservados, sin alteraciones del contenido pesquisadas.',options:['Taquipsiquia','Bradipsiquia','Tangencialidad','Circunstancialidad','Fuga de ideas','Bloqueos','Ideas delirantes','Ideas sobrevaloradas','Rumiación']},
 {id:'sensopercepcion',label:'Sensopercepción',short:'Sensopercepción',normal:'Sin alteraciones sensoperceptivas pesquisadas durante la evaluación.',options:['Alucinaciones auditivas','Alucinaciones visuales','Ilusiones','Despersonalización','Desrealización','Alteraciones perceptuales por precisar']},
 {id:'insight',label:'Insight y conciencia de enfermedad',short:'Insight',normal:'Conciencia de enfermedad conservada según evaluación dirigida.',options:['Insight parcial','Insight ausente','Conciencia de enfermedad fluctuante','Insight intelectual sin repercusión conductual']},
 {id:'juicio',label:'Juicio de realidad',short:'Juicio de realidad',normal:'Juicio de realidad conservado según evaluación.',options:['Juicio de realidad alterado','Juicio de realidad parcialmente conservado','Evaluación insuficiente']},
 {id:'riesgo',label:'Suicidalidad y autolesividad',short:'Suicidalidad',normal:'En evaluación dirigida, niega ideación suicida y autolesiva actual.',options:['Ideación suicida pasiva','Ideación suicida activa','Plan suicida referido','Conducta autolesiva referida','Antecedentes de intento suicida','Riesgo no aclarado']},
];
export const CRITICAL=new Set(['pensamiento','sensopercepcion','insight','juicio','riesgo']);
export const PRESETS={
 breve:{name:'Control breve',detail:'breve',paragraphs:1},
 completo:{name:'Examen mental completo',detail:'completo',paragraphs:3},
 ingreso:{name:'Ingreso hospitalario',detail:'completo',paragraphs:3},
 ambulatorio:{name:'Control ambulatorio',detail:'medio',paragraphs:2},
 personalizado:{name:'Personalizado',detail:'medio',paragraphs:2},
};
const tidy=s=>String(s??'').replace(/\s+/g,' ').trim();
export function emptyForm(){return Object.fromEntries(COMPONENTS.map(c=>[c.id,{status:'no_evaluado',selected:[],detail:''}]));}
export function validForm(input){
 const out=emptyForm();for(const c of COMPONENTS){const v=input?.[c.id];if(!v)continue;const status=['normal','alterado','no_evaluado'].includes(v.status)?v.status:'no_evaluado';out[c.id]={status,selected:status==='alterado'&&Array.isArray(v.selected)?v.selected.filter(x=>c.options.includes(x)).slice(0,8):[],detail:status==='alterado'?String(v.detail||'').slice(0,750).trim():''};}return out;
}
export function initialStyles(){return Object.fromEntries(Object.entries(PRESETS).map(([key,p])=>[key,{
 id:key,name:p.name,detail:p.detail,paragraphs:p.paragraphs,order:COMPONENTS.map(c=>c.id), expressions:['impresiona','refiere'],avoid:[],instruction:'',baseline:Object.fromEntries(COMPONENTS.map(c=>[c.id,c.normal])),examples:0,revisions:0,updated:null
}]));}
export function validateStyle(raw){
 if(!raw||typeof raw!=='object')return null;
 const order=Array.isArray(raw.order)?raw.order.filter(x=>COMPONENTS.some(c=>c.id===x)):[];
 const unique=[...new Set([...order,...COMPONENTS.map(c=>c.id)])];
 const instruction=String(raw.instruction||'').slice(0,500).trim();
 const avoid=Array.isArray(raw.avoid)?raw.avoid.filter(x=>typeof x==='string').map(x=>x.slice(0,50)).slice(0,12):[];
 const baseline=Object.fromEntries(COMPONENTS.map(c=>[c.id,typeof raw.baseline?.[c.id]==='string'&&raw.baseline[c.id].trim()?raw.baseline[c.id].replace(/[\r\n<>]/g,' ').slice(0,280).trim():c.normal]));
 const expressions=Array.isArray(raw.expressions)?raw.expressions.filter(x=>typeof x==='string').map(x=>x.slice(0,50)).slice(0,12):[];
 if(scanSensitive([instruction,...avoid,...expressions,...Object.values(baseline)].join(' ')).length)return null;
 // Una frase normal configurada para un componente no puede negar hallazgos críticos de otro.
 const protectedTopics=[['riesgo',/\b(suicid\w*|autolesiv\w*|autol[ií]tic\w*)\b/i],['sensopercepcion',/\b(alucinaci\w*|sensopercepci[oó]n)\b/i],['juicio',/\b(juicio de realidad)\b/i],['insight',/\b(insight|conciencia de enfermedad)\b/i],['pensamiento',/\b(ideas delirantes|curso del pensamiento|contenido del pensamiento)\b/i]];
 for(const [component,value] of Object.entries(baseline)){for(const [owner,pattern] of protectedTopics){if(owner!==component&&pattern.test(value))return null}}

 return {id:String(raw.id||'personalizado').slice(0,50),name:String(raw.name||'Personalizado').slice(0,65),detail:['breve','medio','completo'].includes(raw.detail)?raw.detail:'medio',paragraphs:Math.min(5,Math.max(1,Number(raw.paragraphs)||2)),order:unique,expressions,avoid,instruction,baseline,examples:Math.max(0,Math.min(10000,Number(raw.examples)||0)),revisions:Math.max(0,Math.min(10000,Number(raw.revisions)||0)),updated:typeof raw.updated==='string'?raw.updated:null};
}
export function inspectExample(text){
 const src=String(text||'').trim();if(src.length<70||src.length>12000)throw Error('Introduce un examen mental de 70 a 12.000 caracteres.');
 const hazards=scanSensitive(src);if(hazards.length)throw Error('Posibles identificadores: '+hazards.join(', ')+'. Elimínalos antes de analizar.');
 const low=src.toLowerCase();
 const synonyms={conciencia:/\b(vigil|alerta|orientad|clote|conscienc)/i,presentacion:/\b(vestiment|presentaci[oó]n|higiene|aspecto|edad aparente)/i,contacto:/\b(contacto visual|mirada|cooperad|colaborad|actitud|pseudocontacto)/i,psicomotricidad:/\b(psicomotor|agitaci[oó]n|inquietud|retardo motor)/i,animo:/\b([aá]nimo|eutimi|tristeza|humor depresiv)/i,afecto:/\b(afect|reactividad|modulaci[oó]n|congruen)/i,lenguaje:/\b(lenguaje|habla|fluidez|discurso)/i,pensamiento:/\b(pensamiento|tangenci|circunstanci|ideas deliran)/i,sensopercepcion:/\b(sensopercep|alucinaci|ilusiones|perceptual)/i,insight:/\b(insight|conciencia de enfermedad)/i,juicio:/\b(juicio de realidad|juicio conservad)/i,riesgo:/\b(suicid|autolesiv|autol[ií]tic)/i};
 const found=[];for(const [id,re]of Object.entries(synonyms)){const hit=re.exec(low);if(hit)found.push({id,position:hit.index});}found.sort((a,b)=>a.position-b.position);
 const paras=src.split(/\n\s*\n/).filter(x=>x.trim());
 const expressions=['impresiona','refiere','se objetiva','no se evidencia','se observa','se pesquisa'].filter(x=>low.includes(x));
 const detail=src.length<430?'breve':src.length<1000?'medio':'completo';
 return {order:found.map(x=>x.id),detected:found.map(x=>COMPONENTS.find(c=>c.id===x.id).short),expressions,paragraphs:Math.min(5,Math.max(1,paras.length)),detail,chars:src.length};
}
export function learnStyle(profile,analysis,kind='example'){
 const safe=validateStyle(profile);if(!safe)throw Error('Estilo inválido');
 const order=analysis.order?.length>=3?[...new Set([...analysis.order,...safe.order])]:safe.order;
 return {...safe,order,detail:analysis.detail||safe.detail,paragraphs:analysis.paragraphs||safe.paragraphs,expressions:[...new Set([...safe.expressions,...(analysis.expressions||[])])].slice(0,12),examples:safe.examples+(kind==='example'?1:0),revisions:safe.revisions+(kind==='revision'?1:0),updated:new Date().toISOString()};
}
const ABNORMAL_HINTS={
 conciencia:/\b(desorientad|somnolient|obnubilad|compromiso de conciencia)\w*\b/i,
 presentacion:/\b(higiene descuid|desaliñad|vestimenta inadecuad|autocuidado disminuid)\w*\b/i,
 contacto:/\b(poco cooperador|no coopera|no mira|contacto visual escaso|hostil|suspicaz|pseudocontacto)\w*\b/i,
 psicomotricidad:/\b(inquietud|agitaci[oó]n|retardo psicomotor|estereotipi|manierism)\w*\b/i,
 animo:/\b(depresiv|triste|ansios|irritab|disf[oó]ric|elevad)\w*\b/i,
 afecto:/\b(restringid|embotad|aplanad|incongruen|labil|hiporreactiv)\w*\b/i,
 lenguaje:/\b(logorrea|mutismo|bradifemia|disartria|verbigeraci[oó]n|perseveraci[oó]n)\w*\b/i
};
export function mergeNormals(form,confirmedRemainder=false,freeText=''){
 const source=String(freeText||'');
 const f=validForm(form);if(confirmedRemainder){
  for(const c of COMPONENTS){if(!CRITICAL.has(c.id) && f[c.id].status==='no_evaluado' && !(ABNORMAL_HINTS[c.id]?.test(source)))f[c.id]={status:'normal',selected:[],detail:''};}
 }return f;
}
export function clinicalInput({freeText='',form={},confirmRemainder=false,previous='',changes=''}){
 const validated=mergeNormals(form,confirmRemainder,freeText+' '+changes);
 const provided=COMPONENTS.filter(c=>validated[c.id].status!=='no_evaluado').map(c=>({id:c.id,label:c.label,status:validated[c.id].status,findings:validated[c.id].status==='normal'?[c.normal]:[...validated[c.id].selected,validated[c.id].detail].filter(Boolean)}));
 return {freeText:String(freeText||'').trim().slice(0,12000),components:provided,notEvaluated:COMPONENTS.filter(c=>validated[c.id].status==='no_evaluado').map(c=>c.id),previous:String(previous||'').trim().slice(0,10000),changes:String(changes||'').trim().slice(0,7000)};
}
export function localExam({freeText='',form={},confirmRemainder=false,profile}){
 const p=validateStyle(profile)||initialStyles().completo;const f=mergeNormals(form,confirmRemainder,freeText);const pieces=[];
 for(const id of p.order){const c=COMPONENTS.find(x=>x.id===id),value=f[id];if(value.status==='no_evaluado')continue;
  if(value.status==='normal')pieces.push(p.baseline[id]||c.normal);
  else {const content=[...value.selected,value.detail].filter(Boolean).join('. ');if(content)pieces.push(content.replace(/\.$/,'')+'.');}
 }
 const raw=String(freeText).trim();if(!pieces.length&&!raw)throw Error('Introduce al menos un hallazgo clínico confirmado.');
 let paras=[];
 if(pieces.length){const chunk=Math.ceil(pieces.length/Math.min(p.paragraphs,pieces.length));for(let i=0;i<pieces.length;i+=chunk)paras.push(pieces.slice(i,i+chunk).join(' '));}
 if(raw)paras.push(raw.replace(/\s+/g,' ').trim());
 const note=paras.join('\n\n');const warnings=detectContradictions({freeText,form:f,confirmRemainder});
 return {note,warnings,missing:COMPONENTS.filter(c=>f[c.id].status==='no_evaluado').map(c=>c.label),origin:'plantilla'};
}
export function detectContradictions({freeText='',form={},confirmRemainder=false,previous='',changes=''}){
 const f=mergeNormals(form,confirmRemainder,freeText+' '+changes),warnings=[];
 const low=tidy(freeText+' '+changes).toLowerCase();
 const explicit=(id)=>f[id]?.status==='normal';
 if(/\b(eut[ií]mic[oa]|[aá]nimo (?:normal|conservado))\b/i.test(low)&&/\b(tristeza persistente|[aá]nimo depresivo|se siente triste)\b/i.test(low))warnings.push('Ánimo descrito como eutímico y depresivo: confirmar temporalidad y distinción subjetiva.');
 if(/\b(sin alteraciones (?:del )?pensamiento|pensamiento normal)\b/i.test(low)&&/\b(tangencial|circunstancial|fuga de ideas|ideas delirantes)\b/i.test(low))warnings.push('Pensamiento descrito como normal y alterado: diferenciar velocidad, curso y contenido.');
 if(/\b(insight conservado|conciencia de enfermedad conservada)\b/i.test(low)&&/\b(insight parcial|insight ausente|sin conciencia de enfermedad)\b/i.test(low))warnings.push('Insight contradictorio: revisar grado de conciencia de enfermedad.');
 if(/\b(niega alucinaciones)\b/i.test(low)&&/\b(sensopercepci[oó]n [ií]ntegra)\b/i.test(low))warnings.push('Negación de alucinaciones no confirma evaluación íntegra de sensopercepción.');
 if(explicit('animo')&&/\b(depresiv|triste|disfor|irritable|ansios)\b/i.test(low))warnings.push('Formulario confirma ánimo normal, pero el texto describe ánimo alterado.');
 if(explicit('pensamiento')&&/\b(tangencial|circunstancial|delirant|bradipsiquia|taquipsiquia)\b/i.test(low))warnings.push('Formulario confirma pensamiento normal, pero el texto registra alteraciones.');
 if(explicit('riesgo')&&/\b(ideaci[oó]n suicida activa|plan suicida|se autolesion|idea suicida presente)\b/i.test(low))warnings.push('Suicidalidad negativa confirmada contradice hallazgos de riesgo en el texto.');
 for(const c of COMPONENTS){const val=f[c.id];if(val.status==='alterado'&&!val.selected.length&&!val.detail)warnings.push(`«${c.label}» marcado alterado sin observación específica.`);}
 if(previous&&changes.length===0)warnings.push('Se aportó examen anterior sin cambios actuales: no trasladar automáticamente hallazgos al examen actual.');
 return [...new Set(warnings)];
}
export function validatePsyPayload(raw){
 if(!raw || !['generate','rewrite','order','expand','summarize','update','assistant'].includes(raw.action))throw Error('Acción inválida.');
 const profile=validateStyle(raw.profile);if(!profile)throw Error('Perfil de estilo inválido.');
 const input=clinicalInput(raw);
 for(const item of input.components){if(item.status==='normal')item.findings=[profile.baseline[item.id]||COMPONENTS.find(c=>c.id===item.id).normal];}
 const current=String(raw.current||'').trim().slice(0,14000);
 const instruction=String(raw.instruction||'').trim().slice(0,800);
 if(raw.action!=='generate'&&!current&&!(raw.action==='update'&&input.previous&&input.changes))throw Error('Para esta acción necesitas un texto en el editor.');
 if(raw.action==='generate'&&!input.freeText&&!input.components.length&&!input.changes)throw Error('Introduce hallazgos nuevos.');
 if(raw.action==='update'&&!input.changes)throw Error('Para actualizar, describe los cambios de la nueva evaluación.');
 const text=JSON.stringify({input,current,instruction,profile});if(text.length>26000)throw Error('Datos demasiado extensos.');
 const hazards=scanSensitive(text);if(hazards.length)throw Error('Posibles identificadores: '+hazards.join(', ')+'. No envíes datos identificables.');
 return {action:raw.action,input,current,instruction,profile,localWarnings:detectContradictions(raw)};
}
