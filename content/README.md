# Biblioteca editorial de Mandarinita

Primera fase de la integración de la [tarea #2](https://github.com/maqdesign/mandarinita/issues/2). No conecta con Meta ni publica contenido automáticamente.

- `episodes.json` es el catálogo editorial de referencia. El catálogo incluye dos láminas originales aisladas en estado `review` y una ficha del episodio **La mosca** (2019), identificado desde Notion como episodio 1 de **cuatro láminas**. Solo se han recuperado las láminas B y D: la ficha permanece `complete: false` y `review`, no se publica ni se presenta como episodio completo.
- El orden de `panels` es el orden de lectura. Cada archivo debe existir dentro del repositorio y conservar el arte original.
- `complete: true` es obligatorio para que un registro `comic` con estado `published` sea visible en el lector. Los episodios incompletos permanecen en revisión.\n- `originalPosition` permite conservar la posición de cada lámina dentro del episodio completo incluso si hay archivos faltantes.\n- `status`: `draft` (borrador), `review` (pendiente), `published` (visible en futuras vistas), `hidden` (oculto).
- `type`: `comic`, `illustration`, `reel`, `merchandise` u `other`. Solo `comic` aprobado debe entrar automáticamente al lector de episodios.
- `source.instagramMediaId` permite deduplicación futura. Nunca guardar tokens de Instagram en este archivo.
- El flujo de importación de la API debe asignar **review** a toda publicación nueva, sin exposición automática.

## Verificar
Desde la raíz: `node scripts/validate-episodes.mjs` (Node 18+). No requiere dependencias.

## Próximos trabajos
El adaptador del lector en `app.js` carga `content/episodes.json` y muestra exclusivamente comics `published` y `complete: true`. El catálogo actual no contiene ninguno: el lector estático permanece disponible como antes. Pendiente: recuperar A y C del episodio 1, importación histórica del ZIP; backend privado y OAuth de Meta con Cloudflare; interfaz editorial; pruebas móviles. Evitar incorporar R2/D1 hasta comprobar necesidades y costos.

**Aislamiento:** se modifica `app.js` sin reescribir los recursos originales; el nuevo lector consume solo contenido editorial aprobado. No fusionar esta rama a `main` sin aprobación. GitHub Actions ejecuta el validador en cambios del catálogo.
