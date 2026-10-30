// Garantiza la presencia y el orden de los títulos del formato personal.
// No agrega hechos clínicos: las secciones no encontradas quedan vacías.
export function ensureFormatHeadings(note,format){
 const raw=String(note||'').trim();
 const headings=format?.headings;
 if(!Array.isArray(headings)||!headings.length)return raw;
 // Sección si Gemini usó encabezados exactos; no reutilizar texto de un apartado
 // no identificable en otro. Si no se hallan encabezados, dejar el texto original
 // como nota adicional explícita, sin atribuirlo a un campo incorrecto.
 const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[*_#:\s]+/g,' ').trim();
 const lines=raw.split(/\r?\n/);const found=new Map();let active=null,unclassified=[];
 for(const line of lines){
  const cleaned=line.trim().replace(/^#{1,4}\s*/,'').replace(/\*\*/g,'');
  const colon=cleaned.indexOf(':');
  const candidate=(colon>=0?cleaned.slice(0,colon):cleaned).trim();
  const match=headings.find(h=>normalized(h)===normalized(candidate));
  if(match){
   active=match;if(!found.has(match))found.set(match,[]);
   if(colon>=0&&cleaned.slice(colon+1).trim())found.get(match).push(cleaned.slice(colon+1).trim());
   continue;
  }
  if(active)found.get(active).push(line);
  else if(line.trim())unclassified.push(line);
 }
 const parts=headings.map(h=>{const value=(found.get(h)||[]).join('\n').trim();return value?`${h.toUpperCase()}\n${value}`:h.toUpperCase()});
 if(unclassified.length)parts.push('TEXTO SIN APARTADO IDENTIFICADO\n'+unclassified.join('\n').trim());
 return parts.join('\n\n').trim();
}
