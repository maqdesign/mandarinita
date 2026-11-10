# Especificación: sprites de personajes para el editor

## Decisión de canon

El canon visual se toma de ilustraciones aprobadas de episodios y de dibujos originales verificados por Mauricio. Una hoja de expresiones generada por IA queda excluida. No se usa para recortar recursos, definir el estilo, entrenar una guía visual ni crear variantes.

Los archivos de episodios disponibles son composiciones aplanadas, no capas fuente. Con autorización expresa de Mauricio se pueden recortar manualmente como poses completas de revisión y reparar un contorno visible cuando la eliminación del fondo lo haya interrumpido. El retoque debe copiar el grosor, color y gesto de los trazos del panel fuente, conservar su textura y enlazar el resultado a ese panel. Esas piezas quedan en `review` y fuera de la biblioteca aprobada hasta que Mauricio las revise. Esta autorización cubre el contorno visible y no permite inventar anatomía oculta, expresiones o variantes que no aparezcan en el arte fuente.

## Modelo de un sprite

Cada personaje tendrá un identificador estable, nombres de búsqueda y una colección de poses aprobadas. Cuando existan dibujos fuente separados, una pose podrá componerse con estas capas editables:

1. **Cuerpo/fruta**: silueta y textura originales, con proporción conservada.
2. **Rostro**: expresión como conjunto intercambiable. Inicialmente se conserva cada cara completa para no inventar ojos, cejas o boca por separado.
3. **Brazos**: piezas con puntos de anclaje en los hombros.
4. **Piernas**: piezas con puntos de anclaje en la base del cuerpo.
5. **Hoja**: solo para los personajes que la tengan, con anclaje propio y variaciones documentadas en dibujos aprobados.

Las uniones y pivotes forman el rig. La posición, orden y transformación de cada pieza se guardan en el archivo `.mandarinita`. Rotar o mover una extremidad no debe estirar el cuerpo ni cambiar su volumen. No se aplica deformación automática, generación de partes ocultas ni simetría inventada.

## Biblioteca de poses y expresiones

Las etiquetas de búsqueda describen lo que se ve: personaje, acción, posición, emoción, objeto, escena y episodio/panel de origen. Las etiquetas no asignan personalidad ni relaciones.

La matriz deseada de emociones —feliz, muy feliz, triste, muy triste, enojado, muy enojado, sorprendido y muy sorprendido— es una guía para buscar ejemplos canónicos. Una casilla vacía significa que falta una ilustración fuente aprobada; no se rellena con una imagen generada. Lo mismo aplica a acciones y ángulos de vista.

Cada recurso conserva:

- personaje e identidad canónica, con alias de búsqueda;
- pose/acción y emoción descritas de forma observable;
- capas presentes y anclajes, si la fuente realmente las contiene;
- ruta y episodio/panel de origen;
- proporción, transparencia y resolución originales;
- autoría/origen y estado (`review` o `approved`);
- aprobación de Mauricio para cualquier componente extraído o reconstrucción manual.

## Ruta de trabajo compatible con el arte original

1. Usar el catálogo visual para elegir paneles fuente y cotejar cada personaje con `personajes.html` y los dibujos originales disponibles.
2. Para poses visibles, reutilizar primero los recortes existentes. Si no hay uno y Mauricio autoriza la reconstrucción, separar manualmente el panel y reparar solo las líneas visibles que se interrumpieron al quitar el fondo. Revisar cada recorte sobre fondos claros y oscuros; mantener el panel fuente enlazado y el resultado en revisión.
3. Para el rig, partir de dibujos originales de Mauricio con cuerpo, rostro, brazos, piernas y hoja en capas. Si esos archivos no existen, solicitarlos o dibujarlos con Mauricio; no fabricar la separación desde un panel plano.
4. Construir y aprobar el atlas de cada personaje antes de convertir sus recursos en componentes disponibles por defecto.

## Bloqueo técnico actual

El repositorio incluye algunos retratos transparentes aprobados y numerosas poses aplanadas, pero no se han encontrado fuentes editables por capas para construir un rig fiel. Por eso el catálogo puede acelerar la búsqueda y reutilización de poses completas; la biblioteca de piezas anatómicas y el rig requieren los originales separados o nuevos dibujos de Mauricio.

## Piloto: Mando Mandarinita

El atlas piloto, la cobertura observada y el primer recurso por capas pendiente están documentados en [MANDO-PILOT-ATLAS.md](MANDO-PILOT-ATLAS.md). La única pose completa con origen de episodio verificado es la pose sonriente con los brazos levantados del panel 46.3.

## Preparación del archivo fuente en Procreate

Para comenzar con Mando basta una pose neutral original, dibujada por Mauricio. El formato editable recomendado es el documento nativo `.procreate`, acompañado por una exportación PSD con capas. Conserva ambos archivos como fuente; no hace falta redibujar una hoja de expresiones todavía.

Mantén el lienzo transparente y no recortes ni cambies el tamaño entre capas. Una organización inicial útil sería:

- `Cuerpo - fruta`
- `Rostro - neutral` (mantener la expresión como conjunto)
- `Brazo - izquierdo` y `Brazo - derecho`
- `Pierna - izquierda` y `Pierna - derecha`
- `Hoja`

Si alguna parte queda detrás del cuerpo, conserva ese solapamiento en el dibujo; no reconstruyas las zonas ocultas a partir de los paneles. Si la exportación PSD no conserva correctamente las capas, entrega PNG transparentes separados, todos con el mismo tamaño de lienzo y alineación, más una imagen de vista previa con las piezas montadas.

El primer archivo no requiere una resolución canónica de episodio: basta con que sea nítido, mantenga el detalle del trazo y no se amplíe artificialmente. El tamaño de producción se definirá después de probar la escala del recurso en el editor.

## Contrato de intercambio para un futuro sprite por partes

Este contrato es una especificación, no una función ya disponible en el editor. El manifiesto de una pose debe describir la imagen fuente y sus piezas sin cambiar la geometría dibujada:

- Identidad: `characterId`, `poseId`, nombre visible, alias de búsqueda y estado de revisión.
- Origen: ruta de episodio/panel si existe, nombre del archivo maestro y checksum de cada exportación para poder detectar cambios.
- Lienzo fuente: ancho y alto exportados, con fondo transparente y sin recorte.
- Piezas: ID estable, ruta del PNG transparente, nombre de la capa PSD, posición original dentro del lienzo, punto de pivote, orden de dibujo y etiquetas observables.
- Ensamble: transformaciones iniciales por pieza; solo traslación, rotación y escala uniforme. Las articulaciones pueden moverse, pero no deforman la fruta ni regeneran arte oculto.

El proyecto `.mandarinita` guardará la instancia del sprite y las transformaciones editables. Los datos de imagen deben viajar dentro del archivo del proyecto o de su paquete de assets; no se dependerá de rutas locales que dejen de funcionar al moverlo a otro dispositivo. Cada pose mantiene su fuente y revisión independientes. Una pose extraída no pasa a `approved` hasta que Mauricio la revise.

La implementación debe esperar a una muestra real en capas para probar la importación PSD/PNG, puntos de pivote, orden delante/detrás y reapertura del archivo en otro dispositivo. Hasta entonces, las imágenes completas de episodios solo sirven como referencias y la biblioteca existente no debe mostrar partes ficticias.
