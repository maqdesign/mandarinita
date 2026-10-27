# Auditoría histórica · Mandarinita · 2026-10-27

## Fuentes comprobadas
| Fuente | Evidencia útil | Decisión |
|---|---|---|
| Notion: https://mandarinita.notion.site/ | Biografía, inicio 16 nov 2019, colaboración Mauricio Quezada/Yosdina García; NotionJam 2022; archivo de episodios; animaciones, blog y contactos | Conservar narración y catálogo; no replicar el layout antiguo |
| Notion: Episodios y contenido exclusivo | Base de datos de historietas, material extra, bocetos y videos | Usar como inventario editorial, verificar obras antes de publicación |
| Notion: Tienda Mandarinita | Gumroad, descargas gratuitas, camisetas/tazas/accesorios planteados | Arquitectura futura, verificar productos activos |
| GitHub maqdesign/mandarinita | HTML/CSS de portada y página de personajes, estilo cartoon CSS y tarjetas de episodios antes ficticios | Migrar incrementalmente sin confundir placeholders con obra real |
| SVG oficial adjunto (imagotipo Ejecución A) | Dimensiones 405×151; colores del vector: #F87209, #607D3B, #55504D | Activo maestro; no redibujar |
| Archivos de personajes adjuntos | PNG de expresiones Mandarinita y Sr. Mandarino | Activos de referencia para validar siluetas y gestos |
| Otras imágenes adjuntas | WebP y JPG de artes / cómics y referencias | Indexar por episodio y comprobar autoría/nombre en una segunda pasada |
| Instrucciones Figma Mandarinita.txt | Documento histórico de miniatura «Mandarinita UI Kit», Work Sans, naranja/verde/amarillo; recomendaciones de Fredoka | Orientación creativa, no manual oficial |
| Figma (nuevo archivo Website 2026) | Dos frames editables 1440 y 390 en equipo Maqdesign Pro | Punto de partida; placeholders marcados |

## Diferencias y decisiones
- El vector registrado dice verde `#607D3B`; documentos UI dicen `#607D38`. Reproducción del logo toma el valor del vector original.
- Los ejemplos de arte generados con CSS en la página vieja **no** sustituyen los originales.
- La web histórica contiene enlaces a terceros y fechas antiguas: comprobar vigencia antes de mostrar como información actual.
- «NotionJam 2022» está documentado en la propia web histórica; recopilar evidencia externa verificable antes de afirmaciones adicionales en la candidatura.

## Límites de cobertura
- La conexión de Figma disponible aquí permite inspeccionar archivos mediante su **fileKey**, y bibliotecas publicadas; no devolvió un índice global de archivos privados históricos. Una búsqueda de componentes/estilos/variables “Mandarinita” no identificó una biblioteca propia publicada. **No se puede declarar auditados todos los Figma antiguos todavía.**
- Quedan pendientes localizar los fileKey de «mandarinita website 2016», el design system anterior y otras páginas antiguas, y revisar versiones/variantes de activos.
- También falta consultar la base de datos Notion por registros individuales para inventario exhaustivo de episodios.

## Prioridades
1. Identificar documentos originales y determinar fuente maestra por tipo de activo.
2. Migrar el logo original como archivo binario versionado con procedencia verificable.
3. Crear componentes Figma (botones, controles, tarjetas de episodio, lector, cabecera y personajes), conectarlos a tokens.
4. Desarrollar kit de implementación (CSS variables o paquete compartido), pruebas de contraste y snapshot.
5. Auditar catálogo de historietas e Instagram por episodio, preservando derechos y créditos.
