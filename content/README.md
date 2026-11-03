# Biblioteca editorial de Mandarinita

El sitio lee `episodes.json` y muestra únicamente historietas con `status: "published"`, `type: "comic"` y `complete: true`. Las imágenes deben ser archivos locales dentro de `assets/`; el orden de lectura se indica en `panels.order` y `originalPosition` conserva la posición en el original.

Los episodios 1, 2, 44, 51, 52 y 85 ya tienen sus láminas identificadas y publicadas en el sitio. En el episodio 51 solo se presentan las cuatro páginas finales. Las opciones A y B son bocetos alternos, según los encabezados de su página de Notion; sus archivos siguen en el repositorio y no forman parte de la secuencia pública.

Las imágenes de personajes se guardan en `assets/characters/` y se enlazan desde `personajes.html` solo cuando el usuario o el archivo original permite reconocerlos con seguridad. No se inventan personajes ni biografías para cubrir imágenes ausentes.

## Verificar

Desde la raíz del repositorio:

- `node scripts/validate-episodes.mjs` valida el catálogo, sus imágenes y el texto alternativo.
- `node --check app.js` revisa la sintaxis del lector.
- El sitio es estático: no necesita instalación, compilación ni dependencias.

Cloudflare Pages publica los cambios que llegan a la rama de producción `main`.
