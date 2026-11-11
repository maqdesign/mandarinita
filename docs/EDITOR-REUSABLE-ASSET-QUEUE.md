# Cola de componentes reutilizables

Actualizado el 11 de noviembre de 2026. Este documento prioriza escenas de los episodios para encontrar dibujos originales que Mauricio pueda separar. Las fuentes están aplanadas: estos resultados no son componentes limpios ni aprobaciones para reconstruir partes ocultas.

La hoja visual [reusable-assets-inventory-review.webp](art-review/reusable-assets-inventory-review.webp) compara tres paneles originales por grupo. Sirve para localizar las referencias; no son recortes ni composiciones nuevas.

## Prioridad de revisión

Los conteos salen de las etiquetas de búsqueda ya incluidas en `editor-art-catalog.json`. Cuando una fila combina varias etiquetas, el conteo cuenta paneles únicos que tienen al menos una de ellas; las etiquetas son ayudas de localización y requieren cotejo visual.

| Grupo a buscar | Paneles / episodios | Episodios útiles para empezar | Estado actual |
| --- | ---: | --- | --- |
| Mueble azul de la sala | 47 / 12 | 9, 19, 26, 27, 32, 34, 39, 49 | Referencias aplanadas; no reutilizar la reconstrucción rechazada del episodio 51 |
| Cama y ropa de cama | 40 / 8 | 5, 13, 20, 21, 53, 72, 76, 89 | Referencias aplanadas; revisar si existe una versión limpia en originales |
| Cocina y fregadero | 31 / 6 | 22, 49, 55, 57, 60, 74 | Fregadero, gabinetes, platos y personajes suelen estar unidos |
| Escritorio de trabajo | 58 / 13 | 7, 35, 42, 44, 45, 48, 56, 69, 76 | Mezcla de escritorio, silla y equipo; no son piezas aisladas |
| Televisor y pantallas | 33 / 10 | 26, 32, 42, 52, 62, 65, 70 | En varias escenas forma parte de la pared o la composición |
| Mesa y vasos | 31 / 8 | 7, 20, 43, 57, 59, 60, 84, 93 | Algunos vasos tienen rostro y podrían ser personaje, utilería o ambos según el episodio |
| Carrito y bolsas | 12 / 3 | 36, 37, 61 | Utilería de compras aún integrada a la escena |
| Vehículos y transporte | 17 / 5 | 17, 64, 91, 99, 101 | Motocicleta, autobús y tránsito; identificar cada diseño antes de normalizarlo |
| Utensilios de cocina | 10 / 2 | 74, 93 | Sartén, olla y licuadora dentro de sus escenas |
| Ventilador y clima | 17 / 5 | 31, 47, 64, 73, 87 | Motivos de escena y efectos; requieren separación y revisión individual |

## Búsqueda en el editor

En **Componentes → Referencias**, busca términos como «mueble azul», «sofá», «cama», «cocina», «fregadero», «escritorio», «laptop», «vaso», «carrito» o el número de episodio. El editor muestra la viñeta fuente completa. No se puede arrastrar desde Referencias al lienzo como si fuera un componente aprobado.

El índice JSON incluye `reusableAssetCandidates`, con alias, etiquetas de origen, episodios, paneles fuente y los estados `reference-only` / `not-separated`. Los mismos paneles siguen visibles en el buscador de referencias por sus etiquetas. Este índice sirve para localizar y ordenar el trabajo; no añade objetos ni fondos a la biblioteca de inserción.

## Siguiente extracción con menor riesgo

Empezar por objetos con contorno visible y poca o ninguna superposición, revisando el panel original y comparándolo con otros episodios. Guardar cada resultado en estado de revisión, enlazar la viñeta fuente y conservar la imagen original. Para fondos grandes —en especial el mueble azul— no completar a ojo las zonas ocultas: hace falta una fuente por capas, otro dibujo original o la aprobación explícita de una reconstrucción concreta.
