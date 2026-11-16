# Recortes de revisión y extracción

Este archivo conserva procesos y recortes de estudio. Algunos recursos concretos ya están disponibles en la biblioteca del editor; su ficha de episodio indica cuáles son insertables. Este estado de uso interno no publica ni modifica los episodios.

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

Se añadieron cuatro recortes tomados de los paneles publicados `59.1` a `59.4`, conservando píxeles de las poses originales. `59.1` muestra la pose de pie con algo de sombra en los pies. `59.2` conserva la lengua y el efecto turquesa junto a Morita. Las poses de carrera de `59.3` y `59.4` ya están disponibles como variantes seleccionables de Morita en el editor; se excluyeron detalles de polvo separados del personaje. Los dos primeros recortes siguen fuera de la biblioteca porque conservan detalles de escena. Los procedimientos reproducibles son [`build-morita-59-1-review.py`](build-morita-59-1-review.py), [`build-morita-59-2-review.py`](build-morita-59-2-review.py), [`build-morita-59-3-review.py`](build-morita-59-3-review.py) y [`build-morita-59-4-review.py`](build-morita-59-4-review.py).

Estos recortes de personajes y los stickers opacos 01 y 05 se conservan en este archivo de revisión, fuera de la biblioteca de componentes insertables. Los packs transparentes 02, 03, 04, 06 y 07 sí se pueden colocar desde la pestaña **Stickers**. La biblioteca del editor solo muestra recursos que se pueden insertar directamente.

## Inventario de los episodios 85 y 87

`mando-episode-87-1-review.png` y `mando-episode-87-2-review.png` son dos recortes de las poses de Mando del episodio 87. Conservan los píxeles de esa etapa anterior del dibujo y los óvalos amarillos del suelo; se excluyeron las anotaciones manuscritas. Siguen pendientes de revisión y no son guías de proporciones para rig. Los procedimientos están en [`build-mando-87-1-review.py`](build-mando-87-1-review.py) y [`build-mando-87-2-review.py`](build-mando-87-2-review.py).

`paperclip-episode-85-3-review.png` aísla las líneas grises del clip personificado del episodio 85.3. `envelope-episode-85-1-review.png` recorta el sobre personificado de 85.1. `toilet-episode-77-3-review.png` recupera el inodoro y portarrollos dibujados en 77.3. Los tres ya se pueden insertar en el editor como objetos reutilizables; conservan los píxeles del episodio de origen y no cambian el estado editorial de ese episodio. El clip y el sobre se clasifican como objetos de utilería, no como personajes nuevos. Ver [`build-paperclip-85-3-review.py`](build-paperclip-85-3-review.py), [`build-envelope-85-1-review.py`](build-envelope-85-1-review.py) y [`build-toilet-77-3-review.py`](build-toilet-77-3-review.py).

`sky-clouds-episode-85-1.png` conserva una región despejada del cielo pintado y las nubes de 85.1, sin personajes. Es un recorte panorámico reutilizable que ya se puede insertar como fondo; no es una escena reconstruida. Su extracción reproducible está en [`build-episode-85-sky-background.py`](build-episode-85-sky-background.py).

## Sofá azul · episodio 9.2

Las propuestas `sofa-azul-episodio-51-1-borrador*.png` son estudios fallidos, no recortes literales ni componentes utilizables. Mauricio indicó que no se parecen al mueble de referencia. La última versión deja contornos de personajes en la textura y la silueta no respeta la fuente. Permanecen fuera de la biblioteca y están marcadas como rechazadas en el catálogo. No regenerar ni presentar como propuestas vigentes. Hace falta una fuente con más del mueble visible o un dibujo de Mauricio.

La primera alternativa, `sofa-azul-episodio-09-2-borrador.png`, se conserva como versión anterior; tiene una forma más recta y una paleta menos saturada, y queda supersedida por la propuesta del episodio 51.

Los demás recortes de personaje de revisión y el estudio rechazado del sofá no aparecen como tarjetas insertables. Los del episodio 14 incluyen retoques localizados en las puntas inferiores; los del episodio 1 conservan sombras; Morita 59.1 tiene algo de sombra de contacto y 59.2 conserva el efecto turquesa; Mando 87.1 y 87.2 conservan sus marcas amarillas de suelo. No se presentan como componentes utilizables. La hoja de contacto se regenera con [`build-review-contact-sheet.sh`](build-review-contact-sheet.sh).

El estado **insertable** solo indica que el recorte puede usarse dentro de un borrador del editor. No publica el episodio, no cambia su estado en el catálogo editorial y no convierte una imagen fuente en una nueva ilustración canónica.

El original del episodio sigue intacto y la ficha de su aparición en el catálogo conserva su ruta de origen.
