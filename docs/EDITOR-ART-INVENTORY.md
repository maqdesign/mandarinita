# Inventario inicial de arte para el editor

Revisión de archivos del repositorio realizada el 5 de noviembre de 2026. Este inventario identifica fuentes; no modifica ni recorta ilustraciones.

## Catálogo de episodios

- `episodes.json` contiene 104 entradas: 97 publicadas y 7 en otros estados. `node scripts/validate-episodes.mjs` valida las 104.
- `content/editor-episodes.json` registra 396 paneles.
- `assets/episodes/` contiene 102 carpetas, 387 imágenes PNG y 356 miniaturas WebP.
- Los archivos de episodio son láminas completas. Un canal alfa en un PNG no equivale a una capa separada de personaje o fondo; cada dibujo debe revisarse antes de generar componentes.

## Personajes con archivos directos

Hay 15 archivos en `assets/characters/`. Siete tienen transparencia real y están disponibles como base de componentes: `aguacatelo-transparent.png`, `greg-transparent.webp`, `limon-agrio-transparent.webp`, `mando-transparent.webp`, `mandy-transparent.webp`, `morita.png` y `sra-pera-transparent.webp`.

Los otros ocho archivos (`aguacatelo.png`, `champi.png`, `cherry.png`, `don-guineo.png`, `manzanillo.png`, `pepino.png`, `sandy.png` y `superfreso.jpeg`) no tienen píxeles transparentes. Se mantienen como referencias hasta preparar y revisar recortes fieles. El nombre del archivo no basta para convertir una imagen con fondo en componente.

## Fondos y objetos

El editor tiene referencias a escenas de los episodios 19, 51 y 52. Son láminas compuestas que incluyen el mueble azul y otros elementos; no son fondos aislados ni componentes reutilizables.

Todavía no hay un archivo de capas que permita separar de forma fiable todos los fondos, objetos y poses de los episodios. Para catalogarlos hay que recorrer las 387 láminas, registrar personajes y objetos visibles, y revisar cada máscara o reconstrucción de fondo con Mauricio. No se añaden esos recortes al editor mientras no se confirme que conservan el arte original.

## Siguiente trabajo de catálogo

1. Generar hojas de contacto por episodio y orden de lectura.
2. Anotar para cada lámina los personajes, variantes de pose, objetos y escenas reconocibles sin inferir rasgos nuevos.
3. Separar solo componentes cuya transparencia y contorno se puedan revisar contra el original.
4. Registrar archivos fuente, nombre canónico, alias de búsqueda y estado de revisión junto a cada componente.
