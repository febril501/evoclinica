# TORA 0.7 · Rediseño visual de EvoClínica 0.6

**TORA** es la nueva identidad visual provisional del proyecto académico EvoClínica. Conserva las rutas de generación clínica y Gemini; el cambio principal es la interfaz. El nombre aún requiere revisión de disponibilidad de marca y dominio.

## Qué incluye

- Nueva página de inicio `GET /` con acceso a **ingreso**, **evolución del día**, **control ambulatorio**, especialidades y estilos.
- Interfaz rediseñada `GET /flujo` inspirada en el prototipo visual aprobado: barra lateral, formularios, áreas de evolución anterior y cambios del día, revisión de hallazgos y editor de Gemini.
- Marca TORA con **el símbolo felino proporcionado por el usuario**, sin eslogan, y colores `#D35400`, `#8B4513`, `#E7C6A8`, `#1F2937`, `#F8F6F2`.
- Tipografía Manrope (títulos) e Inter (texto), cargadas desde Google Fonts si hay conexión, con fuente del sistema como alternativa.
- Diseño adaptable a móvil y computador; interruptor de apariencia oscura que guarda la preferencia local.
- Inicio de sesión rediseñado; se mantiene `APP_USERS_JSON` y las sesiones del grupo.
- Psiquiatría conserva el examen mental avanzado; se actualiza la identidad visual.
- Editor anterior de EvoClínica 0.6 conservado en `/herramientas` para la biblioteca de estilos y las funciones de entrada libre.
- Endpoints de IA `/api/generate`, `/api/psychiatry` y `/api/workflow` sin modificaciones en su contrato.
- Íconos de PWA actualizados a TORA.

## Uso

```bash
npm test
npm start
```

Requiere Node.js 20 o posterior. Abre `http://127.0.0.1:3030`. En Windows puedes ejecutar `INICIAR_WINDOWS.cmd` si ya tienes Node.js.

En Render, mantén **sin cambios** las variables existentes:

- `APP_USERS_JSON` (usuarios del grupo)
- `NODE_ENV=production`
- `GEMINI_API_KEY` (secreto solo en Render)
- `GEMINI_MODEL` (modelo habilitado para tu proyecto)

No incluyas ninguna contraseña o clave real en GitHub. La misma URL de Render debería seguir funcionando si actualizas el repositorio conectado y conservas el servicio.

## Seguridad y privacidad

**Solo casos totalmente ficticios para el piloto académico.** TORA no está validada para uso asistencial ni información identificable de pacientes. Gemini en nivel gratuito puede utilizar datos enviados para mejorar productos, según las condiciones del proveedor. La IA genera **borradores sujetos a revisión**, no diagnósticos ni indicaciones autónomas.

Los textos de evoluciones no se guardan en base de datos. Los perfiles de estilo continúan en `localStorage` del navegador por usuario; no hay sincronización entre dispositivos. La personalización no supone aprendizaje de parámetros del modelo.

## Limitaciones de esta versión

- El rediseño se ha comprobado visualmente con una representación estática del formulario en escritorio y móvil, mientras la lógica se ha verificado con pruebas automatizadas; la integración en tu instancia real de Render y con tu clave de Gemini debe probarse después de desplegar.
- El selector «Por sistemas / Por problemas» cambia el **formato de redacción** del borrador; todavía no convierte automáticamente los apartados de entrada en una lista editable de diagnósticos.
- El modo oscuro se aplica plenamente a inicio y flujos, mientras el editor clásico y Psiquiatría conservan su propia hoja visual, adaptada a la nueva marca.
- Para activar un dominio `tora.cl` o el que prefieras, debes registrarlo y vincularlo a Render por separado; renombrar la interfaz no registra una marca ni cambia automáticamente la URL.
