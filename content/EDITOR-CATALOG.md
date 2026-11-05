# Catálogo de trabajo del editor

Este catálogo se deriva de los recursos visibles del repositorio y no concede aprobación editorial. La fuente canónica del archivo público sigue siendo [`episodes.json`](../episodes.json); estos índices sirven para buscar recursos en el editor y preparar borradores.

## Inventario de episodios

- 104 entradas: 97 publicadas y 7 en revisión.
- 396 láminas registradas: 358 asociadas a entradas publicadas y 38 a entradas en revisión.
- La revisión de contacto cubrió las 396 imágenes. Las entradas conservan en el índice su orden, ruta, texto alternativo, estado y título de origen.
- Episodios del catálogo: [`editor-episodes.json`](editor-episodes.json).

## Personajes y assets

La página de personajes nombra 14 personajes: Mandy y Mando Mandarinita; Greg el Zanahorio; Limón Agrio; Aguacatelo; Morita; Don Guineo; Don Manzanillo; Sra. Pera; Sandy la Sandía; Los Cherrys; Superfreso; Don Pepino; y Champi Ñón.

El catálogo de assets registra los 15 archivos de `assets/characters/`, incluidos archivos que son referencias con fondo y no capas aisladas. Registra también dos retratos sueltos —Sr. Mandarino neutral y Mandarinita sonriente— sin inferir que representen poses de cuerpo completo. Ver [`editor-assets.json`](editor-assets.json) para dimensiones, transparencia, formato y uso recomendado.

- Las figuras recortadas con transparencia pueden probarse como capas conservando su archivo original y proporción.
- Los fragmentos de viñeta y las ilustraciones con fondo sirven como referencia visual; no son componentes aislados y no deben recortarse automáticamente.
- El asset de Morita es una silueta monocroma; se mantiene como tal, sin colorearla ni reconstruirla.
- Ninguna etiqueta del catálogo genera emociones, relaciones o variantes que no estén dibujadas en una fuente existente.

## Observaciones del dibujo a partir de los episodios

La revisión de las láminas muestra variación de técnica y acabado entre episodios: páginas a color con contornos oscuros marcados, sombras y textura; piezas más planas con fondos de color; y páginas de línea o boceto en blanco y negro. Cambian también el grosor del trazo, la composición, la forma de las viñetas y el lettering. Por ello, no es fiel describir un único acabado uniforme ni convertir una página aislada en plantilla universal.

En los ejemplos a color se repiten visualmente los cuerpos frutales redondeados, hojas como parte de la silueta, extremidades oscuras sencillas y expresiones construidas con ojos y boca. Los globos y rótulos están integrados en el arte de cada episodio y varían de forma; las fuentes de texto digital del sitio (Work Sans y Fredoka) son tipografía de interfaz, no una muestra validada de la letra de Mauricio.

Este resumen describe rasgos observados; no es una guía para generar dibujos. Para desarrollar un método de dibujo fiel hacen falta originales de proceso —bocetos, capas o notas de Mauricio— y aprobación explícita de cada nueva variante antes de sumarla a componentes reutilizables.

## Revisión y publicación

Todo episodio nuevo exportado desde el editor se prepara como `review`. `episodes.json` requiere aprobación manual y la web solo muestra cómics con `status: "published"`, `type: "comic"` y `complete: true`. El editor no publica ni programa publicaciones.
