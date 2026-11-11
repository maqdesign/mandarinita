# Recortes piloto en revisión

**Estado: borrador; no es un componente aprobado ni está integrado a la biblioteca del editor.**

Hay cinco recursos en revisión: Mando y Mandy en el episodio 1.1, otra pose de Mando en el 1.3, y Mando y Greg en el episodio 14.1. La [hoja de contacto](review-contact-sheet.webp) los compara juntos sobre un fondo claro. Se eligieron escenas donde los contornos son reconocibles y no se tuvo que inventar anatomía oculta.

## Mando · episodio 1.1

`mando-episodio-01-1-borrador.png` retiene los píxeles originales de la figura con bigote. El fondo crema conectado al borde se vuelve transparente mediante el procedimiento de [`build-mando-01-1-review-cutout.sh`](build-mando-01-1-review-cutout.sh). La sombra de contacto sigue unida a los pies y se conserva como parte de la composición original; por eso el recurso es todavía un borrador, no un recorte limpio aprobado. No se reconstruyeron líneas ni se alteró el panel.

## Mandy · episodio 1.1

`mandy-episodio-01-1-borrador.png` conserva el personaje de pestañas de la izquierda, incluido el brazo levantado. El fondo conectado se vuelve transparente y se quitan tres rayas de acción que estaban separadas de su silueta. La sombra sigue unida a los pies. El proceso está en [`build-mandy-01-1-review-cutout.sh`](build-mandy-01-1-review-cutout.sh); tampoco se reconstruyó ni redibujó el personaje.

## Mando · episodio 1.3

`mando-episodio-01-3-borrador.png` conserva la expresión de ojos abiertos y boca abierta, el brazo que apunta hacia arriba y el otro brazo extendido. El encuadre deja fuera la mosca y su trayectoria; el fondo crema exterior queda transparente. La sombra de los pies se conserva. El procedimiento está en [`build-mando-01-3-review-cutout.sh`](build-mando-01-3-review-cutout.sh).

Los dos recortes usan el panel original `assets/episodes/ep-014-un-dia-malo/14.1.png`. Conservan los píxeles, colores, texturas y líneas visibles del personaje; solo se reconstruyeron los extremos inferiores de las piernas a partir de lo que muestra ese panel. Se quitó el fondo con máscaras manuales y flood fill, y se limpiaron las sombras. No se generó arte con IA ni se modificó el panel fuente.

## Mando

`mando-episodio-14-1-borrador.png` conserva la hoja, el cuerpo texturizado, el bigote, la bolsita y el pequeño objeto claro junto a su brazo. Se reconstruyeron las puntas negras de los pies a partir de lo visible en el panel, porque el borrado de la sombra cortaba el contorno. El proceso está en [`build-mando-review-cutout.sh`](build-mando-review-cutout.sh).

## Greg

`greg-episodio-14-1-borrador.png` conserva la zanahoria, las gafas turquesa, la hoja, sus extremidades y el elemento azul que lleva al costado. Se excluyó la forma blanca contigua que pertenece a otra figura. Las puntas de los pies se retocaron a partir de las formas visibles en el original para separar la sombra. El proceso está en [`build-greg-review-cutout.sh`](build-greg-review-cutout.sh).

## Morita · episodio 59

Se añadieron cuatro recortes de estudio tomados de los paneles publicados `59.1` a `59.4`, conservando píxeles de las poses originales. `59.1` muestra la pose de pie con algo de sombra en los pies. `59.2` conserva la lengua y el efecto turquesa junto a Morita; Mauricio decidirá si se mantienen unidos. `59.3` y `59.4` muestran dos poses horizontales; se excluyeron los detalles de polvo separados del personaje. Los cuatro siguen pendientes de revisión y aprobación. Los procedimientos reproducibles son [`build-morita-59-1-review.py`](build-morita-59-1-review.py), [`build-morita-59-2-review.py`](build-morita-59-2-review.py), [`build-morita-59-3-review.py`](build-morita-59-3-review.py) y [`build-morita-59-4-review.py`](build-morita-59-4-review.py).

Los cuatro archivos aparecen en Componentes → Personajes como **recortes en revisión** para poder examinarlos dentro del editor; siguen deshabilitados para insertar. No son variaciones aprobadas ni se han sumado al catálogo de componentes publicables. Los cinco recortes piloto anteriores también se muestran allí con el mismo estado. La pestaña **Stickers** separa los stickers existentes de los personajes: los packs transparentes 02, 03, 04, 06 y 07 son insertables; los packs opacos 01 y 05 aparecen como referencias no insertables y conservan sus fondos originales.

## Sofá azul · episodio 9.2

Las propuestas `sofa-azul-episodio-51-1-borrador*.png` son estudios fallidos, no recortes literales ni componentes utilizables. Mauricio indicó que no se parecen al mueble de referencia. La última versión deja contornos de personajes en la textura y la silueta no respeta la fuente. Permanecen fuera de la biblioteca y están marcadas como rechazadas en el catálogo. No regenerar ni presentar como propuestas vigentes. Hace falta una fuente con más del mueble visible o un dibujo de Mauricio.

La primera alternativa, `sofa-azul-episodio-09-2-borrador.png`, se conserva como versión anterior; tiene una forma más recta y una paleta menos saturada, y queda supersedida por la propuesta del episodio 51.

Los nueve recortes de personaje se muestran en el editor únicamente para revisión; ninguno se añadió al manifiesto de componentes aprobados. Los del episodio 14 incluyen retoques localizados en las puntas inferiores; los del episodio 1 conservan sombras; Morita 59.1 tiene algo de sombra de contacto y 59.2 conserva el efecto turquesa. El estudio del sofá está rechazado y no es reutilizable. La hoja de contacto se regenera con [`build-review-contact-sheet.sh`](build-review-contact-sheet.sh).

El original del episodio sigue intacto y la ficha de su aparición en el catálogo conserva su ruta de origen.
