# Inventario de arte para el editor

Revisión estructural y visual del repositorio: 6 de noviembre de 2026; actualización de catálogo: 11 de noviembre de 2026. Los archivos de origen no se modificaron. Los siete retratos invitados aquí descritos fueron confirmados por Mauricio como dibujos suyos que representan su estilo. Esa confirmación permite usarlos como retratos y referencias de estilo; no aprueba automáticamente nuevas variantes generadas.

## Fuentes revisadas

- `episodes.json` contiene 104 entradas: 97 publicadas y 7 en revisión. El sitio muestra solo entradas publicadas que cumplen el tipo y estado editorial exigidos.
- `content/editor-episodes.json` registra 396 posiciones de lectura; no equivale al número de archivos de imagen únicos.
- `assets/episodes/` contiene 424 imágenes en 102 directorios: 387 PNG y 37 JPG. El índice visual [`editor-art-catalog.json`](../editor-art-catalog.json) enumera las 424 fuentes con dimensiones, estado editorial, referencias a hojas de contacto y notas de revisión. De los JPG, 32 aparecen en episodios publicados; los 30 que faltaban se añadieron como referencias de escena. Los cinco archivos sin vínculo en `episodes.json` están en revisión y no se ofrecen como componentes.
- Cuatro archivos se identifican como bocetos por sus nombres y contexto documentado en `content/README.md`: `44-boceto.png`, `51.5-boceto-a.png`, `51.6-boceto-b.png` y `52-boceto.png`. No son paneles publicados y se mantienen como revisión.
- Las láminas tienen formatos distintos: predominan 2048×2048 (224 archivos), 785×785 (65) y 1080×1080 (61); también existen tamaños verticales y horizontales. Por ello no fijamos aún un formato canónico para el editor.
- Los 387 PNG se distribuyen en 20 hojas de contacto guardadas en [`docs/art-review/contact-sheets/`](art-review/contact-sheets/). Los JPG publicados están en [su hoja de revisión](art-review/contact-sheets/jpg-published-review.webp); los cinco archivos sin vínculo editorial tienen [otra hoja de revisión](art-review/contact-sheets/unlinked-episode-images-review.webp). El catálogo enlaza cada imagen a su hoja y posición. Las hojas ayudan a localizar motivos; no confirman por sí solas identidades ni aprueban componentes.
- También se revisaron 29 recursos gráficos auxiliares (ilustraciones de archivo, referencias de personajes, storyboards, stickers y derivados) en [additional-assets.webp](art-review/additional-assets.webp). Están inventariados aparte en `supplementaryAssets` dentro del mismo JSON.

### Hallazgos visuales preliminares (424 imágenes)

- La mandarina redonda aparece en escenas y escalas distintas. El bigote, las hojas y otros accesorios permiten distinguir variantes dibujadas, pero su asociación canónica debe cotejarse con la página de personajes antes de normalizar nombres.
- El sofá azul reaparece en varias escenas domésticas (por ejemplo, episodios 9, 19, 26, 32, 34, 39 y 49); conviene priorizar una revisión de la fuente para convertirlo en un objeto reutilizable fiel.
- Según las etiquetas provisionales, el sofá azul aparece en 12 episodios; cama, pantalla, ropa y cocina son otros motivos repetidos. Estas frecuencias ayudan a priorizar la búsqueda, pero no significan que los elementos estén separados de sus fondos.
- También se repiten entornos y utilería doméstica: cocina y fregadero, cama, ropa, escritorio, laptop, carrito de compras y sala. En los paneles estas piezas suelen quedar integradas con personajes, sombras y texto, por lo que aún no equivalen a componentes aislados.
- En el conjunto se observa contorno oscuro de trazo orgánico, textura/sombreado visible en varios cuerpos, hojas verdes, fondos de color que cambian por escena y rotulación integrada. Las láminas posteriores usan también marcos amarillos, páginas tipográficas/promocionales y composiciones más minimalistas o monocromáticas. Es una lectura técnica del material observado, no una instrucción para redibujar.
- Las hojas de contacto permiten localizar motivos repetidos, pero reducen los paneles. Las etiquetas de los nuevos JPG y las notas de las hojas son provisionales; para decidir recortes, variantes cercanas, alias de personaje o detalles de línea hay que inspeccionar el original a resolución completa y cotejarlo con la página de personajes/fuentes originales. Los paneles JPG recién añadidos siguen siendo referencias de escena, no personajes u objetos insertables.

### Cotejo a resolución completa: Mando y Mandy

Se cotejaron dieciocho láminas de los episodios 1, 8, 9, 16 y 46 a resolución completa. Diecisiete tienen identidades verificadas y poses/expresiones observables; una lámina de cierre se revisó por composición, sin asignarle identidad. Las señales de protagonistas incluyen el bigote de Mando y las pestañas de Mandy; los secundarios se contrastaron con las referencias de `personajes.html`. La lámina visual [protagonist-secondary-review.webp](art-review/protagonist-secondary-review.webp) reúne esos paneles originales para comparar las referencias.

El panel 46.3 muestra a ambos personajes de cuerpo completo, de pie y con los brazos levantados. Los retratos transparentes `mando-transparent.webp` y `mandy-transparent.webp` coinciden con esas poses; el texto alternativo de la página de personajes confirma que vienen del episodio 46. Es una variante canónica ya recortada y disponible. Otros ejemplos revisados incluyen a Mandy gesticulando y Mando sorprendido en el episodio 1, ambos sentados en el sofá azul en el episodio 9 y Mando alcanzando una gota y corriendo empapado en el episodio 16. El episodio 8 muestra a Greg, Don Guineo y Don Pepino, incluida una escena del pepino saludando al gato y otra de huida en grupo. Las observaciones y vínculos exactos están en `characterAppearances` del catálogo.

El cotejo anterior conserva `champi.png` y `pepino.png` como recortes opacos de referencia. Ya hay retratos transparentes nuevos de Champi Ñón y Don Pepino, junto con los de Los Cherrys, Don Guineo, Don Manzanillo, Sandy y Superfreso. Mauricio confirmó que los siete son dibujos suyos y representan su estilo. La hoja [portraits-on-main-review.webp](art-review/portraits-on-main-review.webp) los muestra juntos. Se usan como retratos de una pose y referencias para el catálogo; no se les inventa una fuente de episodio ni una época de estilo.

Las láminas 1.1, 1.3, 8.1–8.4, 9.1–9.4 y 46.1–46.4 aún no son nuevas piezas: integran fondo, sombras, globos, mobiliario, marca de autor o recortes de otras figuras. De los episodios 1.1 y 1.3 se añadieron borradores recortados de dos poses de Mando y una de Mandy. Del panel 14.1 hay otros dos recortes manuales en borrador, Mando y Greg, enlazados a la fuente y mantenidos fuera de la biblioteca hasta la revisión de Mauricio. Las cinco poses se comparan en [una hoja de revisión](art-review/cutouts/review-contact-sheet.webp). Las expresiones sirven como referencias de búsqueda; las poses completas que ya tienen retrato transparente deben usar ese recorte existente.

## Personajes y recortes

Hay 22 archivos en `assets/characters/`. Catorce tienen transparencia real: los retratos de Mando, Mandy, Greg, Limón Agrio, Aguacatelo, Morita, Sra. Pera y los siete invitados confirmados por Mauricio. Ocho permanecen como referencias opacas: `aguacatelo.png`, `champi.png`, `cherry.png`, `don-guineo.png`, `manzanillo.png`, `pepino.png`, `sandy.png` y `superfreso.jpeg`; mantienen elementos de las viñetas. La hoja [character-assets.webp](art-review/character-assets.webp) permite comparar el inventario previo; [portraits-on-main-review.webp](art-review/portraits-on-main-review.webp) reúne los siete retratos nuevos. Cada retrato aislado es una pose reutilizable, no un rig ni una hoja de expresiones.

El repositorio también contiene siete imágenes transparentes fuera de `assets/characters/`: dos retratos (`mandarinita-smile.png`, `sr-mandarino-neutral.png`) y cinco stickers (packs 02, 03, 04, 06 y 07). Los retratos se mantienen como referencias suplementarias sin episodio enlazado; los stickers conservan su identidad y estilo propios. Mauricio confirmó que `character-sheet-original.jpg` fue generada por IA y no contiene sus dibujos; sigue excluida del canon y del material de referencia para aprender su estilo.

Los PNG de episodios son composiciones finales, no documentos con capas separadas de personaje, objeto y fondo. Aunque algunos usan modo RGBA, el canal alfa del formato no demuestra que el fondo sea transparente ni que un objeto pueda separarse sin reconstruir arte. No se generaron máscaras ni se reconstruyeron fondos en esta etapa.

### Atlas piloto: Mando

Se organizó un primer atlas de Mando Mandarinita con 73 apariciones indexadas y una hoja comparativa de paneles completos en [MANDO-PILOT-ATLAS.md](MANDO-PILOT-ATLAS.md). Solo la pose sonriente con brazos levantados del panel 46.3 tiene un recorte completo transparente y un origen de episodio verificado. El retrato de cabeza neutral `sr-mandarino-neutral.png` no tiene origen enlazado todavía. La lista distingue poses de cuerpo completo, primeros planos y escenas aplanadas.

La consulta del editor combina ese atlas con apariciones de otros personajes cotejadas a resolución completa o gran vista previa y marcadas con identidad de confianza alta en este índice. Suma 133 referencias de episodios y siete imágenes opacas nombradas en la página de personajes, para 140 referencias de 14 personajes. Cada fuente se mantiene íntegra y nunca se inserta como componente. Las siete imágenes de la página se muestran como referencias; sus poses quedan por cotejar con episodios. Se excluyen identidades de confianza media y etiquetas provisionales de episodios. La búsqueda permite filtrar por personaje y encontrar por alias, episodio, pose o expresión; entiende equivalencias de términos frecuentes en español con etiquetas observacionales en inglés (por ejemplo, «sentado» con «seated» y «sorprendido» con «startled»), sin añadir emociones que no estén descritas. Esto facilita localizar las fuentes, pero no convierte paneles aplanados ni retratos opacos en recortes aprobados.

## Cotejos de personajes añadidos

En una revisión a resolución completa se añadieron referencias de pose para ampliar el atlas: Aguacatelo, Mando y Greg en el episodio 14; Sandy la Sandía en el autobús del 14.2 (identidad con confianza media por la variación del diseño); Mando, Mandy y Limón Agrio en los cuatro paneles del supermercado del 37; Morita en los paneles 59.1–59.4; Aguacatelo en 80.1; Greg y Mando en 82.1–82.5; y Greg y Mando en 92.1–92.2. Los registros enlazan cada aparición a su panel y anotan pose, expresión y evidencia en `characterAppearances` del catálogo JSON.

Estas apariciones son referencias de búsqueda, no assets aislados. Las escenas conservan fondos, globos, sombras y otros elementos. No se extrajeron personajes de esos paneles. La figura llamada Morita se describe por lo visible como una forma negra irregular con ojos grandes y lengua; no se le asigna especie.

Los assets transparentes de Aguacatelo, Greg, Limón Agrio, Morita y Sandy incluyen ahora enlaces a paneles candidatos con evidencia y nivel de confianza. Son rutas para comparar referencias: no declaran que el recorte proceda exactamente de ese panel. Mando y Mandy conservan sus vínculos verificados al 46.3.

## Fondos reutilizables

No encontré un directorio de fondos independientes dentro de `assets/`. Los episodios 9.1, 9.2 y 51.1 muestran un sillón o sofá azul, pero personajes y sombras tapan el mueble; el 19.1 y el 52.1 son escenas completas y no deben tratarse como fondos aislados. Se intentó reconstruir el sofá del episodio 51 usando la textura visible y completando lo oculto. Mauricio rechazó el resultado porque no se parece al dibujo original. La propuesta y sus iteraciones quedan registradas como estudios fallidos en `docs/art-review/cutouts/`; no se ofrecen como componentes ni como arte aprobado. La [hoja comparativa](art-review/blue-furniture-review.webp) conserva las escenas fuente y la [revisión escrita](art-review/BLUE-FURNITURE-REVIEW.md) documenta por qué no se puede usar el recorte actual.

La nueva [cola de componentes reutilizables](EDITOR-REUSABLE-ASSET-QUEUE.md) ordena diez grupos de fondos, mobiliario y objetos recurrentes, y enlaza sus 424 fuentes consultables a través del catálogo. Cada resultado continúa como referencia completa; la cola no crea recortes. En el editor se pueden encontrar estas fuentes desde **Componentes → Referencias**.

### Revisión adicional del episodio 103 y transparencia de activos

Se inspeccionaron a resolución completa los paneles 103.4–103.10. El catálogo ahora registra 14 apariciones observadas: Mando y Greg en 103.4–103.9, y Mando y Mandy en 103.10. Incluye cambios visibles de postura y gesto (tableta, manos en la cintura o levantadas, expresiones preocupadas y sorpresa). Son referencias del episodio 103, que combina personajes con globos, fondos, marcos y marca gráfica; permanecen `reference-only` y no se ofrecen como recortes insertables. El panel 103.3 ya tenía revisión completa.

La comprobación de alfa separa catorce retratos con transparencia real y ocho referencias opacas en `assets/characters/`. Los opacos contienen partes de panel; cambiar su alfa por umbral o recortar por rectángulo no aislaría fielmente la silueta. Los catorce retratos se pueden usar como figuras completas y referencias aprobadas por separado. Ninguno contiene todavía un rig separado de cuerpo, cara, ojos, boca, extremidades y hoja; tampoco están clasificadas las épocas visuales. Ese será el siguiente trabajo de catálogo, empezando por un personaje y sin etiquetar una variante generada como canónica hasta que Mauricio la revise.

## Implicaciones para el producto

1. El catálogo enumera las 424 imágenes de `assets/episodes/`. Las 30 referencias JPG publicadas que faltaban y cinco archivos no enlazados quedaron incorporados en esta actualización. Falta comprobar etiquetas, identidades y detalles contra originales a resolución completa.
2. No incluir como activos aprobados recortes automáticos o manuales sin revisar hechos desde paneles aplanados. Los recortes autorizados se mantienen en revisión hasta la aprobación de Mauricio; priorizar dibujos originales con transparencia o fuentes editables proporcionadas por él.
3. Cada recorte nuevo debe conservar enlace al panel original y pasar revisión visual de contorno, transparencia, texto superpuesto y elementos ocultos.
4. Los bocetos permanecen fuera del flujo publicado; cualquier selección o componente creado a partir de ellos seguirá en revisión.
5. Mantener formatos de lienzo como opciones configurables mientras se contrasta el archivo histórico y se valida cada destino.

## Validación del catálogo

`node scripts/validate-episodes.mjs` valida `episodes.json`; el índice nuevo es una referencia editorial y no altera el catálogo de publicación. Cualquier componente aprobado deberá añadirse después al manifiesto de recursos del editor con su fuente, nombre canónico, alias de búsqueda y estado de aprobación.

### Paleta de color y nueva inspección de utilería

El editor ofrece una paleta por viñeta en **Componentes → Fondos**. Incluye blanco y crema, cuatro colores oficiales tomados de las variables de marca en `styles.css`, y ocho muestras visuales tomadas de zonas de fondo de episodios 5, 14, 31, 36, 37, 42, 52 y 70. Los valores de episodios son muestras dominantes, no fondos extraídos ni reconstruidos; conservan su referencia al panel para compararlos. Elegir una muestra cambia `backgroundColor` de la viñeta activa y el valor permanece editable en el proyecto fuente. También hay un selector personalizado.

Se inspeccionó como posible utilería la licuadora del panel 93.1. El cuerpo visible está parcialmente tapado por otras figuras y por la línea de la mesa; el recorte de prueba también arrastraba píxeles ajenos. Se descartó ese borrador y no se añadió al catálogo de componentes. La fuente original permanece en el atlas como referencia; para aislarla fielmente hace falta una toma más despejada o el dibujo separado.
