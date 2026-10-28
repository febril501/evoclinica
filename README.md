# TORA 0.8 — Rediseño funcional

TORA es un prototipo académico de asistencia para **redacción de evoluciones clínicas de casos ficticios**, con Node.js, interfaz web y API Gemini. No es un sistema de ficha clínica validado y **no debe recibir información identificable de pacientes reales**.

## Qué cambia desde TORA 0.7

- **Inicio simplificado**: solo **Nueva evolución** y **Actualizar evolución**, con acceso a **Mis formatos clínicos**. Se eliminan del inicio el control ambulatorio y el acceso independiente al examen mental.
- **Mis formatos clínicos**: editor de títulos ordenados e instrucciones para cada especialidad. Puede extraer encabezados de una plantilla; descarta el contenido que venga después de `:`. Después de generar una evolución, el usuario puede guardar una nueva regla de estilo desde un acordeón opcional (aprendizaje supervisado). Solo se guardan títulos y reglas, no evoluciones. Permite exportar/importar respaldos JSON.
- **Actualización diaria**: pega la evolución anterior, registra los cambios actuales y permite complementar con formularios opcionales. Gemini recibe ambos contextos por separado y evita presentar hallazgos antiguos como actuales.
- **Psiquiatría**: examen mental como acordeón dentro de los apartados clínicos, con 14 grupos psicopatológicos, opciones excluyentes, selección múltiple cuando corresponde y descripción libre. Incluye edad aparente frente a cronológica, contextura, ánimo/afectividad, velocidad/curso/contenido del pensamiento, sensopercepción, insight, juicio de realidad y evaluación de riesgo.
- **Ginecología y Traumatología**: formularios específicos opcionales; se conservan las otras especialidades del motor previo.
- **Panel derecho**: dedicación a la evolución generada, editable; avisos clínicos breves y confirmación antes de copiar.
- **Identidad**: colores terracota/grafito/marfil, logo TORA, modos claro/oscuro y diseño adaptable.

## Limitaciones importantes

- **Supabase NO está integrado**. Los formatos se guardan en `localStorage`, separados por nombre de usuario, pero solo en el navegador donde se configuraron. Usa el botón de respaldo para cambiarlos de dispositivo. No existe historial de evoluciones sincronizado por cuenta.
- Enseñar un formato **no reentrena Gemini**: el servidor incorpora los títulos e instrucciones validados en cada solicitud, respetando la información aportada.
- La IA puede equivocarse. Los borradores deben ser revisados clínicamente antes de utilizarlos. No se infieren hallazgos normales, ausencia de suicidabilidad ni tratamiento administrado por omisión.
- El esquema local sin Gemini es un **resumen estructurado**, no una evolución redactada profesionalmente por IA.
- En la actualización diaria, la evolución anterior es obligatoria; para redactar sin una previa usa «Nueva evolución».

## Instalar y ejecutar

Requisitos: **Node.js 20 o superior**.

```sh
npm test
npm start
```

En desarrollo local, sin `NODE_ENV=production` ni `APP_USERS_JSON`, el servidor permite el modo local en `http://127.0.0.1:3030`.

En Render, mantener variables de entorno existentes:

| Variable | Uso |
| --- | --- |
| `NODE_ENV` | `production` |
| `APP_USERS_JSON` | Cuentas del grupo (objeto JSON) |
| `GEMINI_API_KEY` | Clave privada de Gemini; **nunca** al repositorio |
| `GEMINI_MODEL` | Modelo Gemini habilitado en la cuenta |

## Rutas clave

- `/` — Inicio
- `/flujo?tipo=ingreso` — Nueva evolución
- `/flujo?tipo=diaria` — Actualizar evolución
- `/formatos` — Mis formatos clínicos
- `/configuracion` — Configuración
- `/psiquiatria` — Redirige a la evolución con Psiquiatría seleccionada

Los endpoints existentes `/api/generate`, `/api/psychiatry` y `/api/workflow` continúan disponibles para compatibilidad. Las anteriores opciones de `docType` se aceptan internamente por compatibilidad, pero no se muestran como modalidades independientes.

## Pruebas

```sh
npm test
```

La versión incluye pruebas unitarias, endpoints y flujos de Gemini simulados. Una ejecución de laboratorio no sustituye pruebas con usuarios, revisión clínica, pruebas de accesibilidad ni de despliegue real con claves de Gemini.
