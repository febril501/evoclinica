# TORA 0.9 — Guía paso a paso para instalar sin perder tu TORA actual

## Antes de modificar Render

**1. Respalda el repositorio:** en GitHub, descarga un ZIP de la versión que está funcionando. En TORA 0.8, exporta tus formatos clínicos desde «Mis formatos clínicos»; el nuevo sistema utiliza una cuenta de Supabase distinta del usuario antiguo.

**2. Supabase:** abre el proyecto TORA → **SQL Editor** → **New query**. Pega **todo** `sql/TORA_0_9_MIGRACION.sql` y ejecuta **Run**. Debe terminar con `Success`. Este archivo prepara el índice único de formatos y los procedimientos protegidos del panel de administración; no vuelve a crear las cuatro tablas existentes.

**3. Supabase Authentication:** en «URL Configuration», verifica que el dominio de TORA en Render esté autorizado. Para los emails de confirmación y recuperación de contraseñas, coloca la **Site URL** como:

`https://TU-DOMINIO.onrender.com/login`

Usa tu dominio real, sin `TU-DOMINIO`. Añade la misma URL en **Redirect URLs**. Conserva activadas las opciones de **Email** y **Confirm Email**. Los emails pueden estar limitados en el plan gratuito; para más cuentas podría requerirse SMTP personalizado.

## Publicar el código

**4. GitHub:** descarga `TORA_0.9_Actualizacion.zip`, descomprímelo y sube los **archivos internos** a la raíz de `febril501/evoclinica` (idealmente una rama de pruebas), conservando la carpeta `sql/`. No subas el `.zip` como un único archivo al repositorio.

**5. Render:** confirma que están configuradas estas variables:

- `SUPABASE_URL`: tu **API URL** de Supabase.
- `SUPABASE_PUBLISHABLE_KEY`: tu **Publishable key**.
- `GEMINI_API_KEY`: la existente.
- `GEMINI_MODEL`: el modelo existente.
- `NODE_ENV=production`.

No cambies la configuración de contraseñas del sistema antiguo antes de verificar el despliegue del código.

**6. Activar las cuentas nuevas:** cuando el código 0.9 esté funcionando, agrega la variable:

`TORA_AUTH_PROVIDER=supabase`

Guarda las variables y despliega. A partir de este momento TORA mostrará el formulario nuevo con **Ingresar** y **Crear cuenta**. El acceso antiguo queda desactivado mientras esta variable esté en `supabase`. Si necesitas revertirlo, retira temporalmente esa variable y vuelve a desplegar; `APP_USERS_JSON` debe permanecer configurada para ese respaldo.

## Probar antes de invitar al grupo

**7.** Inicia sesión con tu correo y contraseña de Supabase (la cuenta que configuraste como `admin` y `approved`). Si aparece «Cuenta pendiente» aunque aprobaste tu cuenta, comprueba `profiles.status` en Supabase.

**8.** Entra a **Mis formatos clínicos** → configura Medicina Interna → **Guardar mi formato**. Abre una nueva evolución de Medicina Interna, genera un borrador ficticio y comprueba que **todos los encabezados permanezcan**, incluso los vacíos.

**9.** Comprueba los **Signos vitales**: ingresa solo PA y FC y confirma que aparezcan con unidades, sin rellenar FR, temperatura ni saturación ausentes. En Psiquiatría comprueba que no se muestren como formulario predeterminado y que todos los desplegables incluyan «Otro (especificar)».

**10.** Guarda un borrador ficticio. Abre **Mis evoluciones**, edítalo, guárdalo y utilízalo como evolución anterior. Comprueba que no se presenten hallazgos anteriores como actuales.

**11.** Registra una segunda cuenta de prueba, confirma su correo y verifica que **no pueda entrar a los documentos** mientras esté `pending`. Desde **Administración**, aprueba esa cuenta y comprueba que la lista de evoluciones aparezca vacía, sin documentos de tu cuenta de administrador. Luego prueba suspenderla.

## Limitaciones conocidas

- La integración real con Supabase y Gemini no fue verificada con tus secretos: se prueba en Render después de desplegar.
- Al reiniciar Render, las sesiones se pierden y los usuarios deben ingresar de nuevo (sesiones en memoria).
- No usar información identificable de pacientes reales. El sistema está diseñado para casos ficticios o completamente desidentificados.
- Revisar todos los borradores antes de utilizarlos. La IA puede equivocarse.

## Solución de problemas

- **Error «relation does not exist»:** se ejecutó una consulta antes de crear las tablas o se eligió el proyecto equivocado. Las cuatro tablas ya deberían existir por el SQL base anterior.
- **«Cuenta pendiente»:** el perfil tiene `status=pending`; aprueba desde el panel de administrador.
- **«RPC not found»:** ejecuta `sql/TORA_0_9_MIGRACION.sql` completo y vuelve a consultar.
- **«Supabase rechazó operación 400/502»:** revisa `SUPABASE_URL`, Publishable key, permisos RLS y logs de Render. No publiques claves ni JWT.
- **Formato no sincroniza:** guarda otra vez el formato en TORA 0.9; los formatos antiguos permanecen en el navegador hasta que los guardes con la nueva cuenta.
