# Atlas piloto de Mando Mandarinita

Estado: en revisión; referencias del arte de episodios, no una hoja nueva de dibujo.

## Evidencia reunida

La vista [Atlas piloto · Mando](art-review/mando-pilot-atlas.webp) compara paneles originales completos. No se retocaron ni separaron. El índice tiene 73 apariciones de Mando en 35 episodios: 1, 4, 8, 9, 12, 14, 16, 21, 34, 37, 38, 40, 46, 47, 49, 50, 52, 54, 71, 77, 79, 81, 82, 83, 86, 87, 88, 90, 92, 93, 94, 96, 97, 98 y 103. Setenta y dos referencias se inspeccionaron a resolución completa; la composición del episodio 4 se revisó como vista ampliada. Además, se hizo un primer barrido de localización en 340 paneles de 82 episodios que aún no tenían referencias indexadas. Ese barrido se usó para encontrar candidatos; no sustituye la revisión a resolución completa ni permite concluir que Mando está ausente cuando no se reconoce una miniatura. Las apariciones pequeñas o parcialmente tapadas sirven para búsqueda, no para extraer una pose.

El rasgo de identidad usado para cotejarlo es la mandarina redonda con bigote oscuro; la hoja verde aparece cuando está dibujada. Los alias de búsqueda incluyen Mando, Sr. Mandarino, Señor Mandarino y mandarino. No se deducen rasgos de personalidad.

## Qué se puede reutilizar ahora

- `assets/characters/mando-transparent.webp`: pose completa sonriente con los brazos levantados. El panel 46.3 y el texto alternativo de `personajes.html` confirman el origen. Es el único recorte de cuerpo completo con fuente de episodio verificada.
- `assets/sr-mandarino-neutral.png`: retrato transparente de cabeza presente en el repositorio, pero aún sin panel de episodio enlazado. Se conserva como referencia pendiente, fuera del atlas canónico hasta verificar su fuente.
- Los paneles 1.3, 8.2, 8.4, 9.1, 9.4, 14.1, 16.1–16.4, 37.2 y 92.1 contienen ejemplos para buscar expresiones o acciones. Siguen aplanados y no son componentes insertables.

## Cobertura preliminar de poses

En las referencias inspeccionadas se encuentran poses de pie, sentado, inclinado, alcanzando/extendiéndose, cayendo, corriendo y brazos levantados. También hay primeros planos, útiles para estudiar expresiones pero no como pose completa. La secuencia del 16 aporta el mejor ejemplo continuo de alcance, sorpresa y carrera; el episodio 8 muestra caída y huida en escena grupal; el 21 añade expresiones acostado en cama; el 40 muestra interacciones con Morita; el 47 y el 50 añaden primeros planos con diferentes gestos y efectos integrados; el 79 añade poses sentado en silla; el 87 documenta una deformación horizontal muy estilizada. El 37 y el 92 muestran variaciones de ropa/objetos que se deben conservar como variaciones de escena, no como cambios permanentes del personaje. Los episodios 12, 81, 88, 90 y 96 agregan primeros planos, sorpresa y escenas frente al computador. El panel 81.4 lleva un efecto de barba superpuesto: se conserva solo como contexto de escena. Los episodios reflejan distintas etapas del trazo y color de Mauricio; no se promedian ni se transforman en un estilo nuevo.

## Matriz emocional

La matriz está deliberadamente incompleta. El catálogo registra ejemplos observables de sonrisa y ojos cerrados en 46.3 y expresiones de ojos abiertos/boca abierta en 1.3 y 16.2–16.4. “Muy feliz”, “triste”, “muy triste”, “enojado”, “muy enojado” y “muy sorprendido” todavía no tienen una clasificación revisada por Mauricio. El panel 12.2 amplía las referencias candidatas de sorpresa, pero no se toma como confirmación de una intensidad emocional. No se infieren a partir de cejas aisladas ni se crean para llenar casillas.

## Primer recurso necesario para construir el rig

Las referencias no permiten mover extremidades por separado. Para empezar el rig del piloto hace falta un dibujo original de Mando en pose neutral, separado en capas editables: cuerpo/fruta, rostro como conjunto, brazos, piernas y hoja. Mantén la silueta, textura, proporciones y trazo de una referencia de episodio. No hace falta crear una hoja de emociones ni varias poses todavía. En cuanto ese archivo esté disponible, se cotejará con el canon y se definirá el anclaje de cada pieza antes de conectarlo al editor.

## Fuente de datos

Las rutas, alias, apariciones, nivel de certeza y estado están en `characterAtlasPilots` y `characterAppearances` dentro de [`editor-art-catalog.json`](../editor-art-catalog.json). El arte se mantiene en revisión hasta aprobación explícita.

## Ajuste de identidades en la biblioteca

Durante el cotejo se encontró `assets/mandarinita-smile.png` dentro de las variantes de Mando. Sus pestañas coinciden visualmente con Mandy, no con el retrato de Mando con bigote. El editor ahora la muestra como variante existente de Mandy. `sticker-pack-06.webp` queda como sticker frutal genérico, sin identidad asignada. Ninguno de estos dos archivos recibe un origen de episodio inventado; siguen como arte suplementario hasta verificarlo.


El cotejo visual de episodios 79 y 87 está en [referencias nuevas del atlas piloto](art-review/mando-pilot-atlas-79-87.webp). La pose aplanada de 87.2 se registra por fidelidad histórica; no sirve como proporción base del rig.


Las nuevas referencias de los episodios 21 y 50 están en [la lámina comparativa](art-review/mando-pilot-atlas-21-50.webp). Sus cuerpos están cubiertos, recortados o superpuestos por la escena; las expresiones se documentan, pero no se extraen.


Las poses de los episodios 40 y 47 se muestran en [la tercera hoja de cotejo](art-review/mando-pilot-atlas-40-47.webp). Las caras con cejas estrechas quedan como candidatas para revisión; no se etiqueta enojo sin confirmación del autor.

Las referencias revisadas de los episodios 12, 81, 88, 90 y 96 están en [esta hoja comparativa](art-review/mando-pilot-atlas-12-96.webp). Incluye únicamente apariciones identificables de Mando; los objetos de escena y efectos siguen unidos al panel original.

Las nuevas referencias de los episodios 34, 38, 49, 52, 54 y 71 aparecen en [esta hoja comparativa](art-review/mando-pilot-atlas-34-71.webp). Se excluyeron del índice otros paneles naranja revisados donde no se confirmó Mando por bigote o rasgos visibles.

La hoja de los episodios 82, 83, 86, 93, 94, 97 y 98 está en [esta lámina](art-review/mando-pilot-atlas-82-98.webp). La referencia 97.3 es un storyboard en borrador y queda fuera de cualquier guía de estilo final.

La referencia 77.3 muestra una pose inclinada con papel en mano; objetos, efecto y viñeta siguen unidos al original. Está disponible en [la revisión del episodio 77](art-review/mando-pilot-atlas-77.webp).

El panel 103.3 está cotejado en [esta hoja](art-review/mando-pilot-atlas-103.webp). Documenta una prueba de estilo publicada, pero no se usa como modelo para las poses ordinarias.

Como prueba de extracción autorizada, hay tres recursos de Mando en revisión: el personaje neutral con bigote del panel 1.1, una expresión de ojos y boca abiertos con los dos brazos visibles del 1.3, y la pose de pie con bolsita del 14.1, cuyas puntas inferiores se reconstruyeron a partir de lo visible. Los paneles 1.1 y 1.3 conservan la sombra de contacto. El panel 1.1 también dio un borrador de Mandy con tres marcas de acción separadas quitadas; su sombra se conserva. Greg tiene un recorte del 14.1. Los cinco se comparan en la [hoja de revisión](art-review/cutouts/review-contact-sheet.webp), están fuera de la biblioteca aprobada y conservan su vínculo de origen. El proceso y los límites están documentados en el [recorte piloto](art-review/cutouts/README.md).
