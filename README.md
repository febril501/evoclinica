# EvoClínica 0.5 — Gemini gratuito para grupos

EvoClínica conserva los módulos por especialidad y el **examen mental psiquiátrico avanzado**. Ahora conecta con **Gemini** desde un servidor Node.js sin exponer las claves al navegador.

**Si ya publicaste la versión 0.4 en GitHub + Render, lee primero `README_GITHUB_RENDER.md`**: incluye el procedimiento para actualizar la misma URL y mantener los usuarios.

## Funcionalidades conservadas

- Redacción desde texto libre y formularios por especialidad.
- Módulo Psiquiatría con 12 componentes, plantillas basales normales solo para hallazgos confirmados y cinco estilos.
- Biblioteca de ejemplos y aprendizaje supervisado de preferencias de escritura, no de diagnósticos.
- Reescritura, resumen, actualización, propuestas y revisión del borrador con Gemini.
- Identificación preliminar de algunas contradicciones y de algunos identificadores; ninguna garantía de validación o anonimización.
- Gestión de cuentas grupales básicas con `APP_USERS_JSON`.

## Activar la IA en Render

Configura como **variables secretas**, nunca en GitHub:

- `GEMINI_API_KEY`: clave privada obtenida en https://aistudio.google.com/app/apikey
- `GEMINI_MODEL`: opcional; `gemini-3.5-flash-lite` (predeterminado)
- Mantén `APP_USERS_JSON` y `NODE_ENV=production` tal como los tienes.

Esta versión ya no utiliza `OPENAI_API_KEY` ni `OPENAI_MODEL`. Las solicitudes se realizan mediante `POST /v1beta/models/{modelo}:generateContent` en la API de Gemini. Cada llamada solicita JSON estructurado y se revisa el resultado antes de presentarlo como **borrador**. El servidor responde sin revelar errores internos completos ni claves privadas.

Si falta la clave, **Plantilla local** sigue disponible. Si Google devuelve un error 429, se informa que se ha agotado el límite de uso gratuito y se recomienda consultar las cuotas en AI Studio. Sin fallback de pago.

## Riesgos y límites

**Uso académico exclusivamente con casos ficticios/sintéticos.** En el nivel gratuito de Gemini, Google puede emplear entradas y salidas para mejorar sus productos. No enviar datos clínicos de pacientes reales al servicio, especialmente contenidos psiquiátricos. No hay garantías de que datos sin nombre/RUT sean anónimos. El material generado puede contener errores y debe ser revisado por un profesional. Ni validación clínica ni cumplimiento asistencial están certificados.

La aplicación no almacena las evoluciones en una base de datos; perfiles guardados en el navegador, sin sincronización entre equipos. `APP_USERS_JSON` proporciona un inicio de sesión básico adecuado únicamente para piloto controlado.

## Pruebas y ejecución local

`npm test` ejecuta pruebas de estructuras, privacidad heurística, auth básica y Gemini simulado.

`npm start` abre http://127.0.0.1:3030 localmente (requiere Node.js ≥20).

Documentación de Google: https://ai.google.dev/gemini-api/docs/pricing · https://ai.google.dev/gemini-api/docs/rate-limits · https://ai.google.dev/gemini-api/docs/api-key
