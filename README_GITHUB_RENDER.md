# Actualizar EvoClínica a TORA 0.7 sin perder Render

1. **Respaldo:** exporta tus estilos desde el editor actual antes de subir archivos. También es recomendable conservar una copia del repositorio GitHub actual.
2. Descarga `TORA_0.7_Actualizacion.zip` y descomprímelo. Contiene solo archivos nuevos o modificados comparados con EvoClínica 0.6. Si tu repositorio es aún la 0.5, utiliza **TORA_0.7_Completa.zip**.
3. Abre tu repositorio GitHub en la rama `main`. Reemplaza los archivos con las rutas exactas que hay en el ZIP, sin anidar una carpeta TORA dentro del repositorio.
4. Si GitHub Web no permite sobrescribir un archivo existente, utiliza su editor o GitHub Desktop. La subida web desde iPhone puede no conservar carpetas anidadas; verifica especialmente `icons/`.
5. Confirma con `Commit changes`.
6. Si Render tiene Auto-Deploy, desplegará el commit. De lo contrario, Render → Manual Deploy → Deploy latest commit.
7. Mantén las claves `GEMINI_API_KEY`, `APP_USERS_JSON`, `GEMINI_MODEL` y `NODE_ENV` en Render, nunca en GitHub. No necesitas reconfigurarlas por el rediseño.
8. Comprueba las rutas `https://TU-URL/`, `/flujo`, `/psiquiatria` y `/herramientas`, además del inicio de sesión con un usuario de prueba.
9. Prueba «Cargar ejemplo ficticio» → «Comparar y validar datos» → «Plantilla local» y, si está configurado, «Generar con Gemini».

El rediseño **no instala base de datos**, no migra información clínica ni modifica el dominio de Render. El antiguo nombre del repositorio puede seguir siendo `evoclinica`.

**Usa exclusivamente casos ficticios o datos sintéticos; no información clínica identificable.**
