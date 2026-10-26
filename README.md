# EvoClínica 0.3 — Examen mental y evoluciones clínicas

**Proyecto personal funcional / prototipo experimental.** Incluye las ocho especialidades de EvoClínica 0.2 y un nuevo módulo especializado de **Psiquiatría → Examen mental**. Es una herramienta de **documentación y revisión**, no de diagnóstico ni de tratamiento.

## Qué contiene el módulo de Psiquiatría

- **Texto libre + formulario simultáneos:** 12 componentes de examen mental; cada uno en estado **No evaluado**, **Normal confirmado** o **Alterado**. Los alterados ofrecen categorías psicopatológicas y campos adicionales.
- **Plantilla basal editable**, independiente por estilo: se aplica solo a hallazgos confirmados; nunca completa automáticamente suicidalidad, contenido del pensamiento, sensopercepción, insight o juicio de realidad a partir de «resto normal».
- **5 estilos:** control breve, examen completo, ingreso, ambulatorio y personalizado; permiten editar extensión, párrafos, orden de 12 componentes, frases normales y expresiones a evitar.
- **Biblioteca de ejemplos:** analiza textos ficticios o desidentificados para recuperar orden aproximado, expresiones frecuentes y longitud. Tras aprobación, guarda **solo las preferencias abstractas**, no el examen antiguo.
- **Redacción narrativa con IA opcional:** generación, reescritura, orden, ampliación limitada a hechos constatados, resumen, actualización desde examen previo y asistente de instrucciones.
- **Revisión de cambios:** las transformaciones aparecen como propuestas, que pueden aceptarse o rechazarse. Si se conservan igual número de párrafos, se permite aceptar **párrafos individuales**.
- **Alertas preliminares de contradicción** y estado de secciones no exploradas; editor completo, historial de hasta 10 versiones **durante la sesión**, glosario clínico y exportación TXT / Word compatible (.doc) / impresión o PDF del navegador.
- **Aprendizaje supervisado de correcciones:** «Aprender corrección» adapta el estilo al texto aprobado. No reentrena ni modifica internamente el modelo generativo.

### Límites funcionales

**Sin API de IA**, la opción **Plantilla local** combina hallazgos confirmados y preserva el texto libre **sin interpretarlo, clasificarlo ni reescribirlo**. La transformación automática desde notas abreviadas a prosa profesional **requiere API**; se probó con una respuesta simulada, pero **no con credenciales reales** en este entorno.

Las alertas son heurísticas incompletas. No hacen examen mental, no infieren ausencia de suicidalidad ni aseguran ausencia de errores de la IA. Ni los estilos ni los datos observados constituyen un sistema de aprendizaje clínico autónomo.

## 1. Ejecutar en Windows, Mac o Linux

1. Descarga y descomprime el ZIP.
2. Instala **Node.js versión 20 o superior** desde https://nodejs.org.
3. En Windows, abre `INICIAR_WINDOWS.cmd`. En Mac/Linux, ejecuta `./INICIAR_MAC_LINUX.sh` (puede requerir permiso de ejecución) o `npm start` desde la carpeta. **No necesitas npm install**.
4. Visita `http://127.0.0.1:3030` y selecciona **Psiquiatría** en el panel de especialidades, o abre directamente `http://127.0.0.1:3030/psiquiatria`.
5. Pulsa **Cargar ejemplo ficticio** y **Plantilla local** para probar sin gastar dinero.

> El HTML abierto como archivo `file://` no es la forma correcta de ejecutar esta aplicación: usa el servidor local incluido.

## 2. Configurar IA opcional

Necesitas una clave independiente de OpenAI API con facturación habilitada. **No debes colocar claves en archivos HTML/JS ni subirlas a GitHub.**

**Windows PowerShell (en la carpeta del proyecto):**

```powershell
$env:OPENAI_API_KEY="TU_CLAVE_DE_API"
npm start
```

**macOS/Linux (en la carpeta del proyecto):**

```sh
export OPENAI_API_KEY="TU_CLAVE_DE_API"
npm start
```

Variable opcional: `OPENAI_MODEL` (el proyecto trae un nombre de modelo predeterminado). El servidor llama a la Responses API con `store:false` y envía datos solo cuando presionas un botón de IA. Esto no excluye todo posible procesamiento o conservación técnica del proveedor; revisa condiciones y autorizaciones aplicables. El servidor no mantiene una base persistente de borradores.

## 3. Cómo enseñarle tu estilo

1. Abre `Psiquiatría` → `Biblioteca de estilos`.
2. Escoge «Control breve», «Examen completo», «Ingreso» u otro.
3. Pega una evolución **sintética o desidentificada** y marca la confirmación.
4. Pulsa «Analizar ejemplo» y revisa los rasgos detectados antes de «Guardar estilo aprendido».
5. Puedes modificar manualmente el orden, las frases normales y las expresiones preferidas.
6. Esos perfiles se guardan en el **almacenamiento local de ese navegador**; expórtalos a JSON para respaldarlos o trasladarlos de dispositivo.
7. Al corregir un borrador, marca que lo revisaste y selecciona «Aprender corrección» para actualizar el estilo.

El programa **no guarda el texto completo** de ejemplos ni de evoluciones en `localStorage`. Sí permanecen visibles mientras están en el formulario y, en caso de los borradores, temporalmente en memoria durante la sesión. Los respaldos contienen preferencias de estilo, no fichas clínicas.

## 4. Privacidad, ética y validación

- **No ingresar datos reales identificables de pacientes** a este prototipo. La detección parcial de identificadores no es un proceso de desidentificación fiable.
- Si se configura IA, parte de la información proporcionada se transfiere al proveedor externo. Usa datos sintéticos o desidentificados; no lo conectes a fichas reales sin una evaluación de privacidad, seguridad, autorización institucional, controles de acceso, cifrado, registro de auditoría y validación clínica.
- El servidor se enlaza de forma predeterminada solo a `127.0.0.1` y **no está listo para exposición pública**. No publicarlo abriendo puertos sin protección.
- Todos los textos son **borradores**: el profesional tiene que revisar contenido, omisiones, contradicciones, temporalidad, terminología y consistencia con su evaluación.
- Las alertas del programa ayudan, pero pueden fallar; no deben emplearse como validación clínica automatizada.

## 5. Pruebas

```sh
npm test
```

Las pruebas incluyen formulario, prevención de normalidades no exploradas, riesgo suicida, contradicciones conocidas, aprendizaje de estilo sin almacenamiento del ejemplo, exposición del módulo y un servidor con **respuesta de IA simulada** (sin gastos).

## Archivos clave

- `psiquiatria.html`, `psychiatry.css`, `psychiatry.js`: interfaz especializada.
- `psychiatry-engine.js`: 12 componentes, normalidad confirmada, validaciones y perfiles de estilo.
- `server.js`: servidor local y endpoint `/api/psychiatry` para un modelo de IA opcional.
- `index.html`, `app.js`, `specialties.js`, `engine.js`: EvoClínica general de 0.2 conservada.
- `sw.js`, `manifest.webmanifest`, `icons/`: recursos de aplicación instalable.

**Versión:** 0.3, desarrollo experimental para uso personal con información ficticia/desidentificada.
