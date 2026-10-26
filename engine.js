import { DEFAULT_HEADINGS, SECTION_KEYS, SPECIALTIES } from './specialties.js';

export const STORE_KEY = 'evoclinica:v02:perfiles';
const ALIASES = [
  ['contexto', /\b(contexto|motivo|antecedentes|resumen|historia|curso|situaci[oó]n|ingreso|postoperatorio|seguimiento)\b/i],
  ['subjetivo', /\b(subjetiv[oa]?|anamnesis|relato|s[ií]ntomas|evoluci[oó]n referida|funcionalidad)\b/i],
  ['objetivo', /\b(objetiv[oa]?|examen|exploraci[oó]n|signos vitales|ex[aá]menes|laboratorio|resultados|evaluaci[oó]n cl[ií]nica|estado actual|hemodinamia|neurol[oó]gico|respiratori|renal|infeccios)\b/i],
  ['analisis', /\b(an[aá]lisis|impresi[oó]n|diagn[oó]stic|evaluaci[oó]n integral|problemas|valoraci[oó]n|juicio)\b/i],
  ['plan', /\b(plan|conducta|tratamiento|indicaciones|seguimiento|control|manejo|destino)\b/i],
];
const SENSITIVE = [
  ['RUT/RUN', /\b(?:\d{1,2}\.?\d{3}\.?\d{3}[-–][0-9kK]|(?:RUT|RUN)\s*[:#]?\s*\S{3,})\b/i],
  ['Correo electrónico', /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/],
  ['Teléfono', /(?:\+?56\s*9|\b9)[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/],
  ['Identificador administrativo', /\b(?:n[°ºo.]?\s*(?:ficha|historia\s*cl[ií]nica)|ficha\s*(?:cl[ií]nica)?|pasaporte|direcci[oó]n|domicilio|nombre\s*(?:completo)?|apellidos?)\s*[:#]\s*\S+/i],
];
export function scanSensitive(value) {
  const content = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  return SENSITIVE.filter(([, regex]) => regex.test(content)).map(([name]) => name);
}
export function headingKey(name) {
  const cleaned = String(name).trim();
  for (const [key, re] of ALIASES) if (re.test(cleaned)) return key;
  return null;
}
const normalize = txt => String(txt ?? '').replace(/\s+/g,' ').trim();
function checkHeading(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 90) return null;
  const inline = trimmed.match(/^([\p{L}][\p{L}\d/() .,_-]{2,58}):\s*(.*)$/u);
  if (inline && (headingKey(inline[1]) || inline[1] === inline[1].toUpperCase())) return inline[1].trim();
  if (trimmed.length <= 58 && /^[\p{L}\d /()_,.-]+$/u.test(trimmed) && trimmed === trimmed.toUpperCase() && /\p{L}/u.test(trimmed)) return trimmed;
  return null;
}
export function extractStyle(example) {
  if (typeof example !== 'string' || example.trim().length < 45 || example.length > 12000) throw Error('El ejemplo debe contener entre 45 y 12.000 caracteres.');
  const hazards=scanSensitive(example);
  if (hazards.length) throw Error('Posibles identificadores detectados: '+hazards.join(', ')+'. Retíralos antes de continuar.');
  const lines=example.split(/\r?\n/);
  const sectionEntries=[];
  let chars=0, lengths=[];
  for (const line of lines){
    const title=checkHeading(line);
    if(title){ const key=headingKey(title); if(key && !sectionEntries.some(s=>s.key===key)) sectionEntries.push({key,label:normalize(title).slice(0,60)}); }
    else if(line.trim()){chars+=line.trim().length;lengths.push(line.trim().length);}
  }
  const headings=sectionEntries;
  const upper= headings.filter(h=>h.label === h.label.toUpperCase()).length;
  const bulleted=lines.filter(l=>/^\s*[-•*]\s/.test(l)).length;
  const clinicalLines=lines.filter(l=>l.trim() && !checkHeading(l));
  const style = {
    headings,
    uppercase:headings.length?upper >= Math.ceil(headings.length/2):true,
    paragraphs:bulleted > Math.max(2,clinicalLines.length/3)?'viñetas':'narrativo',
    detail:clinicalLines.length > 12 || chars > 1000 ?'detallado':'conciso',
    avgLine:Math.round(lengths.reduce((a,b)=>a+b,0)/(lengths.length||1)),
    recognized:headings.length
  };
  return style;
}
export function defaultProfile(spec) {
  if (!SPECIALTIES[spec]) throw Error('Especialidad desconocida');
  return { version:2, specialty:spec, headings:SECTION_KEYS.map(key=>({key,label:DEFAULT_HEADINGS[key]})), uppercase:true, paragraphs:'narrativo', detail:'conciso', instruction:'', examples:0, revisions:0, updated:null };
}
export function mergeProfile(existing, extracted, spec) {
  const previous=validateProfile(existing,spec)||defaultProfile(spec);
  const matched=extracted.headings||[];
  const rest=previous.headings.filter(h=>!matched.some(m=>m.key===h.key));
  return { ...previous, headings:matched.length>=2?[...matched,...rest]:previous.headings,
    uppercase:extracted.uppercase, paragraphs:extracted.paragraphs, detail:extracted.detail,
    examples:(previous.examples||0)+1, updated:new Date().toISOString() };
}
export function validateProfile(raw,spec) {
  if (!SPECIALTIES[spec] || !raw || typeof raw!=='object') return null;
  const headings=[];
  for(const item of (Array.isArray(raw.headings)?raw.headings:[]).slice(0,12)) {
    if(!item || typeof item!=='object'||!SECTION_KEYS.includes(item.key)||typeof item.label!=='string')continue;
    if (headings.some(h=>h.key===item.key)) continue;
    const label=item.label.replace(/[\r\n<>]/g,'').trim().slice(0,60);
    if(label)headings.push({key:item.key,label});
  }
  for (const key of SECTION_KEYS) if(!headings.some(h=>h.key===key)) headings.push({key,label:DEFAULT_HEADINGS[key]});
  const instruction=typeof raw.instruction==='string'?raw.instruction.slice(0,500).trim():'';
  if(scanSensitive(instruction).length) return null;
  return { version:2,specialty:spec,headings,uppercase:raw.uppercase!==false,
    paragraphs:raw.paragraphs==='viñetas'?'viñetas':'narrativo', detail:raw.detail==='detallado'?'detallado':'conciso',
    instruction, examples:Math.min(10000,Math.max(0,Number(raw.examples)||0)),
    revisions:Math.min(10000,Math.max(0,Number(raw.revisions)||0)),
    updated:typeof raw.updated==='string'?raw.updated:null };
}
export function guidedGroups(spec, form) {
  const specialty=SPECIALTIES[spec];
  if(!specialty)throw Error('Especialidad inválida');
  return specialty.sections.map(([key,label,fields])=>({key,label,fields:fields.map(([id,fieldLabel])=>({id,label:fieldLabel,value:String(form?.[id]||'').trim()})).filter(x=>x.value)})).filter(x=>x.fields.length);
}
export function localDraft({specialty,mode,freeText='',form={},profile}) {
  const info=SPECIALTIES[specialty]; if(!info) throw Error('Especialidad inválida');
  if(mode==='libre') {
    const content=String(freeText).trim();
    if(!content)throw Error('Escribe información clínica antes de generar.');
    return `EVOLUCIÓN · ${info.name.toUpperCase()}\n\nDATOS APORTADOS (SIN REINTERPRETAR)\n${content}\n\n[Plantilla local: conserva literalmente los datos. Para redacción narrativa y adaptación al estilo, activa IA.]`;
  }
  const groups=guidedGroups(specialty,form); if(!groups.length)throw Error('Completa al menos un campo.');
  const valid=validateProfile(profile,specialty)||defaultProfile(specialty);
  const sequence=[...valid.headings.map(x=>x.key),...groups.map(x=>x.key)].filter((key,i,arr)=>arr.indexOf(key)===i);
  const sections=[];
  for(const key of sequence){
    const group=groups.find(x=>x.key===key);if(!group)continue;
    const label=valid.headings.find(x=>x.key===key)?.label||DEFAULT_HEADINGS[key];
    sections.push(`${valid.uppercase?label.toUpperCase():label}\n${group.fields.map(f=>`${f.label}: ${f.value}`).join('\n')}`);
  }
  return `EVOLUCIÓN · ${info.name.toUpperCase()}\n\n${sections.join('\n\n')}`;
}
export function prepareRequest({specialty, mode, freeText='', form={}, profile}) {
  if(!SPECIALTIES[specialty] || !['libre','guiado'].includes(mode))throw Error('Configuración inválida.');
  const active=mode==='libre'? String(freeText).trim():JSON.stringify(guidedGroups(specialty,form));
  if(active.length<15)throw Error('Introduce información clínica suficiente.');
  if(active.length>14000)throw Error('El texto clínico excede 14.000 caracteres.');
  const flags=scanSensitive(active);if(flags.length)throw Error('Posibles identificadores: '+flags.join(', ')+'. Usa solo datos sintéticos o anonimizados.');
  return {specialty,mode,clinicalData:mode==='libre'?active:guidedGroups(specialty,form),profile:validateProfile(profile,specialty)||defaultProfile(specialty)};
}
