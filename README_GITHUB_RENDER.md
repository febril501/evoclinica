# Actualizar TORA 0.7 → TORA 0.8 (GitHub y Render)

**No subas el ZIP cerrado a GitHub**. Hay que subir los **archivos de su interior**. Tu URL de Render puede seguir siendo la misma.

1. **Respalda** el código actual de GitHub antes de reemplazarlo. Si usas formatos de estilo locales en la 0.7, respáldalos/exporta lo que permita tu versión actual.
2. Descarga y **descomprime** `TORA_0.8_Actualizacion.zip`.
3. Abre `https://github.com/febril501/evoclinica` y entra en la rama `main`.
4. Reemplaza los archivos de la raíz con los del ZIP (por ejemplo `server.js`, `flow.js`, `workflow-engine.js`, `index.html`, `flujo.html`) y **añade** los nuevos (`clinical-formats.js`, `mental-exam.js`, `formatos.html`, `formats.js`, `tora-v08.css`).
5. La carpeta `icons/` debe contener `tora-mark.png`, `icon-192.png` y `icon-512.png`. Es importante que queden **dentro** de `icons/`, no en la raíz ni en otra carpeta intermedia.
6. Verifica que `workflow-config.js`, `auth.js`, `engine.js` y el resto de archivos existentes permanezcan en la raíz. No elimines archivos antiguos para los que aún existan dependencias. El ZIP de actualización incluye módulos críticos de respaldo para evitar errores de módulos faltantes.
7. Confirma en GitHub (**Commit changes**). Si trabajas en el navegador y te cuesta subir carpetas o reemplazar archivos, usa **GitHub Desktop** en computador, o el editor web de cada archivo. No crees una carpeta `TORA_0.8_DESARROLLO` dentro del repositorio.
8. Render suele desplegar automáticamente el nuevo commit. Si no ocurre, entra en **Manual Deploy → Deploy latest commit**.
9. Comprueba: `/`, `/formatos`, `/flujo?tipo=ingreso`, `/flujo?tipo=diaria`, `/flujo?especialidad=psiquiatria`, y que el logo aparezca. Revisa la consola de Render si falla.
10. Haz pruebas con **casos ficticios**: una nueva evolución, una actualización con cambios del día, una plantilla personalizada, el examen mental y Gemini.

**No cambies** `GEMINI_API_KEY`, `GEMINI_MODEL`, `APP_USERS_JSON` ni `NODE_ENV` por el rediseño. Deben permanecer configuradas **solo en Render**, no en GitHub.

**Importante:** `Mis formatos clínicos` guarda títulos e instrucciones en **ese navegador**, no en Supabase; por eso conviene usar la exportación JSON si cambias de dispositivo. **No introducir datos identificables de pacientes reales.**
