# Biblioteca editorial de Mandarinita

El sitio lee el catálogo público `episodes.json` de la raíz del sitio y muestra únicamente historietas con `status: "published"`, `type: "comic"` y `complete: true`. Las imágenes deben ser archivos locales dentro de `assets/`; el orden de lectura se indica en `panels.order` y `originalPosition` conserva la posición en el original.

Los episodios 1, 2, 44, 51, 52 y 85 ya tienen sus láminas identificadas y publicadas en el sitio. En el episodio 51 solo se presentan las cuatro páginas finales. Las opciones A y B son bocetos alternos, según los encabezados de su página de Notion; sus archivos siguen en el repositorio y no forman parte de la secuencia pública.

Las imágenes de personajes se guardan en `assets/characters/` y se enlazan desde `personajes.html` solo cuando el usuario o el archivo original permite reconocerlos con seguridad. No se inventan personajes ni biografías para cubrir imágenes ausentes.

## Marcas de autoría en imágenes públicas

Las fuentes originales se conservan en sus rutas actuales. Las imágenes servidas por el sitio usan derivados WebP con una marca discreta que incluye el logotipo, el copyright y `mandarinita.art`: viñetas completas y miniaturas bajo `assets/watermarked/episodes/`, retratos bajo `assets/watermarked/characters/`, y previews sociales bajo `assets/episode-previews/`. Para regenerarlos después de cambiar una fuente, ejecuta `python scripts/generate-watermarked-images.py` y luego `node scripts/generate-episode-share-pages.mjs`. No edites manualmente los archivos generados; corrige la fuente y vuelve a generarlos.

## Apariciones de personajes

`characters.json` define los IDs estables que usan las tarjetas y el catálogo. En cada episodio, `characters` puede contener los IDs de los personajes que se ven en sus viñetas. Añade un ID solo cuando la aparición esté confirmada visualmente; no infieras una aparición a partir del título o de la descripción. Las tarjetas cuentan y eligen al azar solo episodios publicados, completos y etiquetados. Los episodios en revisión pueden llevar etiquetas editoriales, pero nunca aparecen en el lector público.

Cuando se incorpore un episodio, conserva sus etiquetas durante el trabajo editorial y añade las apariciones que se hayan comprobado antes de publicarlo. `node scripts/validate-episodes.mjs` verifica que cada ID exista en `characters.json` y que no haya IDs repetidos.

## Verificar

Desde la raíz del repositorio:

- `node scripts/validate-episodes.mjs` valida el catálogo, sus imágenes y el texto alternativo.
- La misma validación comprueba que cada viñeta publicada tenga original, imagen marcada y miniatura marcada.
- `node --check app.js` revisa la sintaxis del lector.
- El sitio es estático: no necesita instalación, compilación ni dependencias.

Cloudflare Pages publica los cambios que llegan a la rama de producción `main`.
Para importar episodios en lote desde Notion, consulta [NOTION-BULK-IMPORT.md](../docs/NOTION-BULK-IMPORT.md). El importador descarga las imágenes finales y añade los episodios nuevos como revisión, sin duplicar los ya catalogados.
