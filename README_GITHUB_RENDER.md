# EvoClínica 0.5 — Activar Gemini gratuito en tu GitHub + Render actual

Esta actualización **reemplaza OpenAI por Gemini** en la versión de EvoClínica para compañeros. Conserva cuentas, rutas, plantillas, especialidades y el módulo Psiquiatría (examen mental). No crea una base de datos ni sincroniza perfiles entre dispositivos.

## Qué tienes que hacer (sin comandos)

1. **Guarda un respaldo de estilos** desde la aplicación antes de actualizar. Aunque los cambios de código normalmente no borran `localStorage` del mismo dominio, es prudente conservarlos.
2. Descarga y descomprime `EvoClinica_0.5_Gemini_Gratis.zip`.
3. En tu repositorio existente **github.com/febril501/evoclinica** (o el que tengas), entra en la rama `main` → **Add file → Upload files**. Arrastra **el contenido de la carpeta descomprimida**, no el ZIP ni la carpeta contenedora, y confirma el commit. Los nombres (`server.js`, `app.js`, `psiquiatria.html`, `render.yaml`, etc.) deben estar en la **raíz** del repositorio, junto a `package.json`. Cuando GitHub advierta archivos repetidos, confirma su sustitución. Si la interfaz web no admite la sustitución, edita los archivos o usa GitHub Desktop para hacer el commit; evita crear una carpeta adicional.
4. En **Google AI Studio** (https://aistudio.google.com/app/apikey) crea una clave de Gemini para un proyecto con acceso al nivel gratuito. La API es un producto separado de ChatGPT. Comprueba en AI Studio los límites aplicables a tu proyecto y modelo.
5. En **Render → tu servicio actual → Environment**, sin borrar `APP_USERS_JSON` ni `NODE_ENV`, agrega:

   | Key | Value |
   | --- | --- |
   | `GEMINI_API_KEY` | tu clave privada de Google AI Studio |
   | `GEMINI_MODEL` | `gemini-3.5-flash-lite` (opcional; valor predeterminado) |

   `OPENAI_API_KEY` y `OPENAI_MODEL` ya no se usan. Puedes **eliminarlas de Render**, sin compartir el valor. No metas una clave en GitHub ni en JavaScript/HTML.
6. Guarda con **Save, deploy**. Si Render está configurado con Auto-Deploy desde GitHub, cualquier commit en `main` también puede disparar un nuevo despliegue.
7. Espera el estado **Live**, entra en tu **misma URL** de Render y usa un ejemplo ficticio en **Psiquiatría → Redactar con IA**. La pantalla debe mostrar `● IA disponible`.

Si aparece **modelo no disponible** (404), revisa en Google AI Studio qué modelos tiene habilitados tu proyecto y actualiza `GEMINI_MODEL` en Render. Si aparece **límite gratuito** (429), revisa el panel de cuotas de AI Studio; no significa que la aplicación esté rota. No hay fallback automático a una API de pago.

## ¿Cuánto cuesta?

El modelo predeterminado `gemini-3.5-flash-lite` aparece con acceso gratuito de entrada/salida para proyectos elegibles, con **cupos por minuto/día que dependen del proyecto**. Estos pueden cambiar: https://ai.google.dev/gemini-api/docs/pricing y https://ai.google.dev/gemini-api/docs/rate-limits. El plan gratuito de Render puede suspender el servidor por inactividad. Esta versión no requiere añadir tarjeta para un proyecto ya habilitado en nivel gratuito, salvo que Google te lo solicite por condiciones específicas; **no actives facturación para seguir esta ruta de prueba**.

## Privacidad — leer antes de usar

**En el nivel gratuito, Google puede utilizar las entradas y salidas para mejorar sus productos. No envíes datos clínicos de pacientes reales, aunque hayas quitado el RUT o el nombre.** La seudonimización o eliminación de identificadores evidentes no garantiza anonimato y las notas psiquiátricas son particularmente sensibles. Esta compilación es solo para **casos sintéticos/ficticios**, aprendizaje y validación de estilo. No es un sistema asistencial, no sustituye evaluación médica y exige revisar cada frase. El filtro local de identificadores detecta únicamente algunos patrones obvios.

## Verificaciones

- Mantiene login por `APP_USERS_JSON` y `/login`.
- `GET /api/status` informa `provider: Gemini` si `GEMINI_API_KEY` existe.
- Los endpoints `/api/generate` y `/api/psychiatry` hacen peticiones desde el servidor a Google con la clave privada, sin exponerla al navegador.
- El servidor **no conserva las evoluciones**; estilos guardados en `localStorage` por navegador y nombre de usuario. Sin sincronización remota todavía.
- Ejecuta `npm test` si deseas comprobar la integración sin hacer llamadas reales ni incurrir en consumo de Gemini.

La API real debe probarse en tu cuenta después de cargar la clave. Las pruebas incluidas utilizan respuestas simuladas y no verifican cuotas ni permisos reales de tu proyecto de Google.
