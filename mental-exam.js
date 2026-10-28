// TORA · Catálogo de hallazgos psicopatológicos inspirado en clases 6, 7 y 8.
// Las opciones no constituyen diagnósticos y requieren constatación clínica explícita.
const f=(id,label,options)=>({id,label,options});
const d=(id,label,description,fields)=>({id,label,description,fields});
export const MENTAL_DOMAINS=[
 d('consciencia','Conciencia, atención y orientación','Instrumentos del vivenciar: evaluar por separado nivel de alerta, orientación, atención y memoria.',[
  f('alerta','Estado de conciencia',['Vigil','Somnoliento','Obnubilado','Estuporoso']),
  f('orientacion','Orientación',['Orientado en tiempo, espacio y persona','Desorientación temporal','Desorientación espacial','Desorientación personal']),
  f('atencion','Atención',['Atención conservada tras exploración','Hipoprosexia','Hiperprosexia','Distraibilidad']),
  f('memoria','Memoria',['Memoria explorada sin alteraciones','Dificultad de evocación','Compromiso de fijación','Amnesia referida'])]),
 d('apariencia','Presentación y apariencia','Edad aparente versus cronológica, contextura, higiene, vestimenta y contacto visual.',[
  f('edad','Edad aparente',['Acorde con edad cronológica','Aparenta mayor edad que la cronológica','Aparenta menor edad que la cronológica']),
  f('biotipo','Contextura',['Ectomórfica','Mesomórfica','Endomórfica']),
  f('higiene','Higiene y cuidado',['Cuidado personal adecuado','Higiene descuidada','Higiene muy descuidada']),
  f('vestimenta','Vestimenta',['Adecuada a clima y contexto','Inadecuada al clima o contexto','Extravagante o llamativa']),
  f('mirada','Contacto ocular',['Adecuado y sostenido','Intermitente','Escaso','Evitativo','Fijo o intenso'])]),
 d('actitud','Actitud durante entrevista','Describe relación con el entrevistador; no equiparar actitud con diagnóstico.',[
  f('tipo','Actitud observada',['Colaboradora','Poco colaboradora','Defensiva','Suspicaz','Hostil','Desinteresada','Facilitada','Seductora','Chancera','Tensa o ansiosa'])]),
 d('psicomotricidad','Psicomotricidad y conación','Actividad espontánea, mímica, movimientos accesorios, postura y fenómenos motores.',[
  f('actividad','Actividad psicomotora',['Sin alteraciones observadas','Inquietud psicomotora','Agitación psicomotora','Inhibición psicomotriz','Hipocinesia','Acinesia','Estupor']),
  f('mimica','Mímica y expresividad',['Expresividad gestual conservada','Hipomimia','Amimia','Gestualidad aumentada']),
  f('fenomeno','Fenómenos específicos',['Tics','Estereotipias','Manierismos','Ecopraxia','Perseveración motora','Catalepsia','Negativismo','Movimientos involuntarios'])]),
 d('animo','Estado de ánimo','Separa ánimo subjetivo referido de afectividad observada.',[
  f('humor','Ánimo referido',['Eutímico referido','Tristeza o ánimo depresivo referido','Ansiedad referida','Irritabilidad referida','Euforia referida','Disforia referida','Ánimo expansivo referido'])]),
 d('afectividad','Afectividad','Rango, intensidad, reactividad, modulación y congruencia no son sinónimos.',[
  f('rango','Rango o intensidad afectiva',['Afecto de rango conservado','Afecto restringido','Afecto embotado','Afecto aplanado','Afecto exaltado']),
  f('modulacion','Modulación y reactividad',['Afecto modulado','Hiporreactividad afectiva','Afecto lábil','Incontinencia afectiva']),
  f('congruencia','Congruencia',['Congruente con relato y ánimo','Discordante con relato o ánimo'])]),
 d('lenguaje','Lenguaje y habla','No confundir comprensibilidad del discurso con normalidad del contenido.',[
  f('expresion','Expresión verbal',['Espontánea','Escasa espontaneidad','Logorrea','Mutismo']),
  f('fluidez','Fluidez y articulación',['Fluidez conservada','Disartria','Disfluencia']),
  f('velocidad','Ritmo de habla',['Normofluente','Taquilalia','Bradilalia']),
  f('prosodia','Prosodia',['Prosodia conservada','Monótona','Aumentada'])]),
 d('pensamiento_velocidad','Pensamiento: velocidad','Taquipsiquia y bradipsiquia describen velocidad del pensamiento, no necesariamente su estructura.',[
  f('tipo','Velocidad',['Sin alteración de velocidad constatada','Taquipsiquia','Bradipsiquia'])]),
 d('pensamiento_curso','Pensamiento: curso formal','Circunstancialidad, tangencialidad y disgregación son fenómenos distintos.',[
  f('tipo','Curso formal',['Dirigido a meta y coherente','Circunstancial','Tangencial','Asociaciones laxas','Disgregación','Ideofugalidad','Fuga de ideas','Bloqueos','Perseveración','Pararrespuestas','Neologismos','Pensamiento en tropel'])]),
 d('pensamiento_contenido','Pensamiento: contenido','Describe las ideas y vivencias específicas; no clasificar un delirio solo por la temática.',[
  f('tipo','Fenómenos identificados',['Ideas delirantes','Ideas de características deliroides','Ideas deliriosas (contexto orgánico evaluado)','Ideas obsesivas','Ideas sobrevaloradas','Ideas de perjuicio','Ideas de referencia','Ideas de grandeza','Ideas de culpa','Vivencias de influencia del pensamiento','Robo del pensamiento','Inserción del pensamiento','Difusión del pensamiento']),
  f('conviccion','Relación con la creencia',['Convicción firme','Cuestiona parcialmente la creencia','Reconoce carácter irracional y la rechaza','Vivencia ajena o impuesta'])]),
 d('sensopercepcion','Sensopercepción','Distinguir percepción alterada con objeto real (ilusión) de percepción sin estímulo externo (alucinación).',[
  f('tipo','Fenómeno',['Sin fenómenos alterados tras exploración','Ilusión','Alucinación','Pseudoalucinación','Alteración de intensidad perceptiva','Desrealización','Despersonalización']),
  f('modalidad','Modalidad',['Auditiva','Visual','Táctil','Olfatoria','Gustativa','Cinestésica']),
  f('detalle','Características',['Voces dialogantes','Voces comentadoras','Voces imperativas','Experiencia de ubicación extracorpórea','Experiencia localizada en espacio interno'])]),
 d('insight','Insight o conciencia de enfermedad','Noción de enfermedad, atribución de síntomas y necesidad de tratamiento se exploran por separado.',[
  f('nivel','Insight',['Conservado tras exploración','Parcial','Ausente']),
  f('atribucion','Atribución de las experiencias',['Reconoce relación con enfermedad','Atribuye vivencias a causas externas','Reconoce necesidad de tratamiento'])]),
 d('juicio','Juicio de realidad','Evaluar diferenciación realidad externa/vivencia interna y prueba de realidad.',[
  f('nivel','Juicio de realidad',['Conservado tras exploración','Parcialmente comprometido','Alterado'])]),
 d('riesgo','Suicidalidad y autolesividad','Registrar exploración directa. No se infiere ausencia de riesgo por omisión.',[
  f('ideacion','Ideación actual',['Niega ideación suicida tras exploración directa','Refiere ideación pasiva de muerte','Refiere ideación suicida activa']),
  f('plan','Plan e intención',['Niega plan tras exploración directa','Refiere plan suicida','Refiere intención suicida','Refiere acceso a medios']),
  f('antecedentes','Antecedentes referidos',['Refiere intentos previos','Refiere autolesiones previas','Niega intentos previos tras exploración directa'])])
];
const validSources=['referido','observado','documentado'];
export function emptyMentalExam(){return []}
export function validateMentalExam(input){
 if(input===undefined||input===null)return [];
 if(!Array.isArray(input)||input.length>MENTAL_DOMAINS.length)throw Error('Formulario de examen mental inválido.');
 const defs=new Map(MENTAL_DOMAINS.map(s=>[s.id,s]));const seen=new Set();const output=[];
 for(const item of input){
  if(!item||!defs.has(item.id)||seen.has(item.id))throw Error('Componente del examen mental desconocido o duplicado.');seen.add(item.id);
  const def=defs.get(item.id);const picked=item.fields;
  if(!picked||typeof picked!=='object'||Array.isArray(picked))throw Error('Selecciones del examen mental inválidas.');
  const fields={};for(const [key,value] of Object.entries(picked)){
    const field=def.fields.find(x=>x.id===key);if(!field)throw Error('Hallazgo psicopatológico inválido.');const values=Array.isArray(value)?value:[value];if(!values.length||values.length>8||values.some(v=>typeof v!=='string'||!field.options.includes(v)))throw Error('Hallazgo psicopatológico inválido.');if(new Set(values).size!==values.length)throw Error('Hallazgo psicopatológico duplicado.');if(values.length>1&&values.some(v=>/^(Sin |Niega |Conservad|Dirigido a meta|Normofluente|Acorde |Eutímico)/.test(v)))throw Error('No combines normalidad o negación con hallazgos patológicos en la misma categoría.');fields[key]=values;
  }
  const notes=typeof item.notes==='string'?item.notes.trim():'';
  if(notes.length>1600)throw Error('Descripción psicopatológica demasiado extensa.');
  if(!Object.keys(fields).length&&!notes)continue;
  output.push({id:item.id,label:def.label,fields,notes,source:validSources.includes(item.source)?item.source:'no_precisada'});
 }
 return output;
}
export function mentalExamFacts(items){return items.map(x=>`${x.label}: ${Object.values(x.fields).flat().join('; ')}${x.notes?' · '+x.notes:''}${x.source&&x.source!=='no_precisada'?' [Fuente: '+x.source+']':''}`).join('\n')}
