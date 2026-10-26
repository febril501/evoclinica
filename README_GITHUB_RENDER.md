# EvoClínica 0.4 — Publicación en GitHub y Render (grupo pequeño)

**Tipo de lanzamiento: demostración y uso académico, únicamente con datos ficticios o verdaderamente desidentificados.** No admite fichas reales identificables.

## 1. Crear repositorio

1. En https://github.com/new crea `evoclinica-grupo` en modo **Private**.
2. Selecciona `uploading an existing file` y carga el **contenido** de esta carpeta (no el ZIP entero). Incluye `server.js`, `auth.js`, `index.html`, `psiquiatria.html`, `package.json` y `render.yaml`.
3. No subas archivos `.env`, contraseñas, claves API, historias clínicas ni evoluciones con datos personales.

## 2. Publicar desde Render

1. En https://dashboard.render.com registra una cuenta y conecta GitHub, autorizando el repositorio.
2. Pulsa **New → Web Service**, selecciona el repositorio. No uses Static Site.
3. Runtime: **Node**. Build command: `npm install --omit=dev`. Start command: `npm start`. Plan Free para pruebas, u otro disponible.
4. En **Environment** agrega:
   - `NODE_ENV` = `production`
   - `APP_USERS_JSON` = `{"claudio":"CONTRASENA-LARGA-PROPIA","leo":"OTRA-CONTRASENA-LARGA"}` (reemplaza nombres/contraseñas con valores reales privados, al menos 12 caracteres; son cuentas de demo)
   - `OPENAI_API_KEY` = clave API privada (opcional, pero imprescindible para IA)
   - `OPENAI_MODEL` = `gpt-4.1-mini` (opcional)
5. Pulsa **Deploy**. Render asigna HTTPS en `https://<nombre>.onrender.com`. Comparte la dirección y las credenciales individuales **por separado y por vía privada**.
6. Actualizaciones: cambia archivos en GitHub y Render hará nuevos despliegues automáticos según su configuración.

También puedes utilizar el `render.yaml` proporcionado creando un Blueprint; el proceso con Web Service es más fácil de seguir inicialmente.

## Acceso al grupo y limitaciones de seguridad

- Cada miembro inicia sesión con su usuario y contraseña (definidos exclusivamente como variables secretas en Render); las sesiones duran hasta 12 horas y se cierran con «Cerrar sesión».
- Las preferencias y estilos **se guardan solamente en localStorage** por cuenta en cada navegador. No se sincronizan entre dispositivos ni constituyen aislamiento criptográfico entre usuarios del mismo equipo. **No compartan navegador/perfil de Windows, no usen dispositivos públicos.** Utilicen Exportar/Importar estilos para pasar preferencias al otro equipo.
- El servidor no tiene base de datos de casos ni guarda las evoluciones; las solicitudes de IA envían contenido al proveedor. Una lista heurística de identificadores **no reemplaza la desidentificación**.
- Hay límites básicos de intentos de contraseña (8 por 15 minutos por IP observable) y 20 llamadas IA por hora por nombre de usuario (reinician al reiniciar el servidor). Estos controles son **solo para un piloto**, no seguridad de producción.
- El uso con datos clínicos identificables requiere, antes de su despliegue, control individual de acceso robusto, base de datos cifrada, autenticación gestionada, protección de cuentas, auditoría, permisos, evaluación institucional de privacidad, contratos y revisión de la normativa chilena aplicable.
- **No publiques GitHub Pages** para la versión con IA: GitHub Pages no ejecuta el servidor Node.js de EvoClínica.
- El servicio gratuito de Render puede suspenderse por inactividad y tardar en iniciar. La API del modelo cuesta adicionalmente por consumo y depende de límites de tu cuenta.

## Funcionamiento local

Sin `NODE_ENV=production` ni `APP_USERS_JSON`, `npm start` sigue funcionando solo en `127.0.0.1:3030` sin login para desarrollo. Para probar la pantalla de login en local, establece `APP_USERS_JSON` en tu entorno. No edites código para incrustar contraseñas.

## Pruebas

`npm test` ejecuta las pruebas de la versión anterior y las nuevas comprobaciones de acceso y despliegue.

## Operación

**No es una aplicación clínica validada ni un EHR**. El profesional comprueba toda salida; los apartados no evaluados, y especialmente suicidabilidad, no pueden rellenarse por inferencia. Sin clave API, las plantillas locales funcionan, pero no existe redacción inteligente automática.
