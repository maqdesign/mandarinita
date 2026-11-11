# Biblioteca editorial de Mandarinita

El sitio lee el catálogo público `episodes.json` de la raíz del sitio y muestra únicamente historietas con `status: "published"`, `type: "comic"` y `complete: true`. Las imágenes deben ser archivos locales dentro de `assets/`; el orden de lectura se indica en `panels.order` y `originalPosition` conserva la posición en el original.

Los episodios 1, 2, 44, 51, 52 y 85 ya tienen sus láminas identificadas y publicadas en el sitio. En el episodio 51 solo se presentan las cuatro páginas finales. Las opciones A y B son bocetos alternos, según los encabezados de su página de Notion; sus archivos siguen en el repositorio y no forman parte de la secuencia pública.

Las imágenes de personajes se guardan en `assets/characters/` y se enlazan desde `personajes.html` solo cuando el usuario o el archivo original permite reconocerlos con seguridad. No se inventan personajes ni biografías para cubrir imágenes ausentes.

## Marcas de autoría en imágenes públicas

Las páginas muestran las fuentes originales sin marca para que la lectura y los retratos se vean limpios. Los controles de descarga entregan derivados WebP con una marca discreta que incluye el logotipo, el copyright y `mandarinita.art`; las previews sociales también llevan esa marca. Los derivados de viñetas y retratos viven bajo `assets/watermarked/`, y los previews bajo `assets/episode-previews/`. Para regenerarlos después de cambiar una fuente, ejecuta `python scripts/generate-watermarked-images.py` y luego `node scripts/generate-episode-share-pages.mjs`. No edites manualmente los archivos generados; corrige la fuente y vuelve a generarlos.

## Apariciones de personajes

`characters.json` define los IDs estables que usan las tarjetas y el catálogo. En cada episodio publicado, `characters` enumera solo las apariciones confirmadas visualmente; `objects` contiene IDs de objetos destacados que se ven en sus viñetas. Si no se confirma un personaje o no hay un objeto destacado, se deja el arreglo vacío. No infieras etiquetas a partir del título, diálogos ni descripciones.

`episode-objects.json` es el vocabulario bilingüe de objetos y sinónimos que usa la búsqueda. La búsqueda pública consulta título, número, personajes y objetos; no indexa el texto escrito dentro de las viñetas. Al publicar un episodio nuevo, revisa sus apariciones y objetos visibles y conserva estas etiquetas en el catálogo.

Cuando se incorpore un episodio, conserva sus etiquetas durante el trabajo editorial y añade las apariciones que se hayan comprobado antes de publicarlo. `node scripts/validate-episodes.mjs` verifica que cada ID exista en su registro y que no haya IDs repetidos.

## Verificar

Desde la raíz del repositorio:

- `node scripts/validate-episodes.mjs` valida el catálogo, sus imágenes y el texto alternativo.
- La misma validación comprueba que cada viñeta publicada tenga original, imagen marcada y miniatura marcada.
- `node --check app.js` revisa la sintaxis del lector.
- El sitio es estático: no necesita instalación, compilación ni dependencias.

Cloudflare Pages publica los cambios que llegan a la rama de producción `main`.
Para importar episodios en lote desde Notion, consulta [NOTION-BULK-IMPORT.md](../docs/NOTION-BULK-IMPORT.md). El importador descarga las imágenes finales y añade los episodios nuevos como revisión, sin duplicar los ya catalogados.
