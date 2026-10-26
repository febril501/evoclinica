export const SPECIALTIES = {
  interna: {
    name: 'Medicina Interna', abbr: 'MI', icon: '🩺',
    subtitle: 'Evolución hospitalaria y problemas activos',
    sections: [
      ['contexto','Contexto clínico',[['motivo','Motivo de hospitalización','Motivo de ingreso / día de hospitalización, sin identificadores'],['eventos','Eventos relevantes desde la evolución previa','Cambios clínicos, eventos y respuesta observada']]],
      ['subjetivo','Subjetivo',[['sintomas','Síntomas y evolución referida','Lo que el paciente refiere hoy']]],
      ['objetivo','Objetivo',[['vitales','Signos vitales','Solo mediciones disponibles, con unidades'],['examen','Examen físico dirigido','Hallazgos positivos y negativos realmente evaluados'],['estudios','Laboratorio e imágenes','Valores y resultados disponibles; fechas si son relevantes']]],
      ['analisis','Análisis por problemas',[['problemas','Problemas clínicos y razonamiento documentado','Problemas y evaluación clínica ya realizada']]],
      ['plan','Plan',[['conducta','Conductas y seguimiento','Indicaciones efectivamente definidas por el equipo']]],
    ]
  },
  uci: {
    name: 'UCI / UPC', abbr: 'UCI', icon: '🫀', subtitle: 'Evolución por sistemas y soporte',
    sections: [
      ['contexto','Resumen de situación',[['motivo','Motivo de ingreso y días críticos','Diagnósticos y contexto confirmados'],['eventos','Eventos últimas 24 horas','Eventos realmente ocurridos']]],
      ['objetivo','Estado actual',[['vitales','Hemodinamia y signos vitales','PAM, FC, dosis vasoactivas si existen'],['neurologico','Neurológico y sedación','RASS, Glasgow, pupilas si fueron evaluados'],['respiratorio','Respiratorio y soporte','Oxígeno, VM, gases, parámetros disponibles'],['renal','Renal, diuresis y balance','Diuresis, balance, creatinina, soporte renal'],['infeccioso','Infeccioso y antimicrobianos','Foco, cultivos, antimicrobianos y evolución'],['estudios','Otros exámenes pertinentes','Resultados verificados']]],
      ['analisis','Evaluación',[['problemas','Problemas prioritarios por sistemas','Razonamiento documentado / respuesta al soporte']]],
      ['plan','Plan por sistemas',[['conducta','Conductas actuales','Solo órdenes o decisiones realmente tomadas']]],
    ]
  },
  psiquiatria: {
    name: 'Psiquiatría', abbr: 'PSQ', icon: '🧠', subtitle: 'Anamnesis de seguimiento y examen mental',
    sections: [
      ['contexto','Seguimiento',[['motivo','Motivo y contexto','Seguimiento / motivo de control'],['eventos','Eventos desde último control','Adherencia, funcionamiento, hechos relevantes']]],
      ['subjetivo','Relato clínico',[['sintomas','Síntomas y vivencia subjetiva','Estado anímico y evolución referida']]],
      ['objetivo','Examen mental',[['mental','Examen mental observado','Conciencia, contacto, actitud, psicomotricidad, ánimo, afecto, lenguaje, pensamiento, sensopercepción, insight: solo lo evaluado'],['riesgo','Evaluación de riesgo','Registrar solo indagaciones y respuestas efectivamente obtenidas']]],
      ['analisis','Impresión clínica',[['problemas','Evaluación / evolución','Hipótesis o diagnósticos registrados por el clínico']]],
      ['plan','Plan',[['conducta','Manejo y seguimiento','Intervenciones, indicaciones, derivaciones definidas']]],
    ]
  },
  urgencias: {
    name: 'Urgencias', abbr: 'URG', icon: '🚑', subtitle: 'Reevaluación, respuesta y destino',
    sections: [
      ['contexto','Motivo y curso',[['motivo','Motivo de consulta','Descripción acotada'],['eventos','Curso durante observación','Hechos y cambios tras intervenciones']]],
      ['subjetivo','Reevaluación clínica',[['sintomas','Síntomas actuales','Cambios de síntomas según paciente']]],
      ['objetivo','Objetivo',[['vitales','Signos vitales de control','Parámetros conocidos'],['examen','Examen físico de reevaluación','Hallazgos examinados'],['estudios','Exámenes','Solo resultados disponibles']]],
      ['analisis','Evaluación',[['problemas','Impresión diagnóstica actual','Problemas identificados']]],
      ['plan','Conducta y destino',[['conducta','Intervenciones y destino','Tratamiento realizado, alta/ingreso o pendientes confirmados']]],
    ]
  },
  traumatologia: {
    name: 'Traumatología', abbr: 'TRA', icon: '🦴', subtitle: 'Examen musculoesquelético y conducta',
    sections: [
      ['contexto','Antecedentes',[['motivo','Mecanismo y lesión','Lesión / lateralidad / día evolutivo'],['eventos','Eventos desde control','Procedimientos / inmovilización realizados']]],
      ['subjetivo','Síntomas',[['sintomas','Dolor y funcionalidad','Dolor, parestesias, limitaciones referidas']]],
      ['objetivo','Examen dirigido',[['examen','Examen musculoesquelético','Piel, movilidad, estabilidad, neurovascular distal: solo evaluado'],['estudios','Imágenes','Hallazgos imagenológicos informados']]],
      ['analisis','Diagnóstico y evolución',[['problemas','Evaluación','Diagnóstico y evolución documentados']]],
      ['plan','Conducta',[['conducta','Tratamiento / carga / control','Inmovilización, analgesia, kinesio, cirugía, control: si están indicados']]],
    ]
  },
  cirugia: {
    name: 'Cirugía', abbr: 'CIR', icon: '🏥', subtitle: 'Control perioperatorio y evolución',
    sections: [
      ['contexto','Contexto',[['motivo','Diagnóstico y procedimiento','Procedimiento / día postoperatorio, si corresponde'],['eventos','Últimas 24 horas','Incidencias reales']]],
      ['subjetivo','Evolución subjetiva',[['sintomas','Dolor, náuseas y tolerancia','Síntomas referidos y tolerancia a vía oral']]],
      ['objetivo','Evaluación',[['vitales','Signos vitales','Solo observados'],['examen','Examen y herida','Abdomen, herida, drenajes, tránsito: solo observados'],['estudios','Estudios','Resultados de exámenes']]],
      ['analisis','Análisis',[['problemas','Situación actual','Problemas identificados']]],
      ['plan','Plan',[['conducta','Indicaciones / control','Medidas ya establecidas por el equipo']]],
    ]
  },
  pediatria: {
    name: 'Pediatría', abbr: 'PED', icon: '🧸', subtitle: 'Seguimiento clínico pediátrico',
    sections: [
      ['contexto','Contexto',[['motivo','Motivo y etapa de hospitalización','Antecedentes relevantes sin datos personales'],['eventos','Evolución desde control','Cuidados y eventos reportados']]],
      ['subjetivo','Evolución referida',[['sintomas','Síntomas / alimentación / eliminación','Lo referido por cuidador o paciente']]],
      ['objetivo','Evaluación clínica',[['vitales','Signos vitales / antropometría','Valores disponibles con unidades'],['examen','Examen físico','Solo hallazgos evaluados'],['estudios','Exámenes','Resultados confirmados']]],
      ['analisis','Evaluación',[['problemas','Problemas clínicos','Problemas y evolución']]],
      ['plan','Plan',[['conducta','Manejo y educación','Intervenciones e indicaciones definidas']]],
    ]
  },
  aps: {
    name: 'Atención Primaria', abbr: 'APS', icon: '🌿', subtitle: 'Control longitudinal y acuerdos',
    sections: [
      ['contexto','Motivo del control',[['motivo','Motivo y problemas en seguimiento','Control de crónicos u otra consulta'],['eventos','Adherencia y antecedentes nuevos','Cambios desde último control']]],
      ['subjetivo','Anamnesis',[['sintomas','Síntomas y funcionalidad','Relato del paciente']]],
      ['objetivo','Evaluación',[['vitales','Signos vitales y mediciones','Valores existentes'],['examen','Examen físico dirigido','Hallazgos observados'],['estudios','Exámenes recientes','Resultados disponibles']]],
      ['analisis','Evaluación integral',[['problemas','Problemas y metas','Evaluación clínica documentada']]],
      ['plan','Plan y seguimiento',[['conducta','Acuerdos y control','Tratamientos, educación y controles acordados']]],
    ]
  }
};

export const DEFAULT_HEADINGS = {
  contexto:'CONTEXTO CLÍNICO', subjetivo:'SUBJETIVO', objetivo:'OBJETIVO',
  analisis:'ANÁLISIS', plan:'PLAN'
};
export const SECTION_KEYS = Object.keys(DEFAULT_HEADINGS);
