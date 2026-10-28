# Biblioteca editorial de Mandarinita

Primera fase de la integración de la [tarea #2](https://github.com/maqdesign/mandarinita/issues/2). No conecta con Meta ni publica contenido automáticamente.

- `episodes.json` es el catálogo editorial de referencia. Los registros existentes son dos ilustraciones **originales**, sin números de episodio inventados.
- El orden de `panels` es el orden de lectura. Cada archivo debe existir dentro del repositorio y conservar el arte original.
- `status`: `draft` (borrador), `review` (pendiente), `published` (visible en futuras vistas), `hidden` (oculto).
- `type`: `comic`, `illustration`, `reel`, `merchandise` u `other`. Solo `comic` aprobado debe entrar automáticamente al lector de episodios.
- `source.instagramMediaId` permite deduplicación futura. Nunca guardar tokens de Instagram en este archivo.
- El flujo de importación de la API debe asignar **review** a toda publicación nueva, sin exposición automática.

## Verificar
Desde la raíz: `node scripts/validate-episodes.mjs` (Node 18+). No requiere dependencias.

## Próximos trabajos
Adaptador de datos para el lector existente de `app.js`; importación histórica del ZIP; backend privado y OAuth de Meta con Cloudflare; interfaz editorial; pruebas móviles. Evitar incorporar R2/D1 hasta comprobar necesidades y costos.

**Aislamiento:** este cambio no modifica `index.html`, `app.js`, ni los assets existentes. No despliega a producción.
