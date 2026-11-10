# Taller Mandarinita: alcance y decisiones

## Flujo actual

El editor se sirve como aplicación estática en Cloudflare Pages. El guardado local sigue disponible. Se añadieron Pages Functions para iniciar sesión de forma privada con GitHub y guardar proyectos en R2; falta configurar OAuth, el binding privado y secretos en el Dashboard antes de que la nube se active. `episodes.json` requiere `status: review` hasta la aprobación manual. Los `.png` de episodios son láminas aplanadas: el repositorio no contiene fuentes por capas para separar fielmente muebles, personajes u otros objetos.

## MVP local que ya se está probando

- Biblioteca de componentes aprobados, alias para búsquedas y más espacio para capas.
- Composición multipanel; mover, seleccionar, redimensionar, bloquear, duplicar y reordenar elementos.
- Globos de diálogo, pensamiento, narración, voz fuerte y efectos; texto editable y crecimiento automático.
- Formatos Web 3:2, Instagram cuadrado 1:1 e Instagram vertical 4:5; el lienzo adopta el formato elegido y avisa de elementos fuera de cuadro.
- Gestor local de borradores y paquete de proyecto `.mandarinita`, que conserva la estructura editable versionada (`schemaVersion: 1`) en `proyecto.json`. La importación valida la integridad del ZIP y que el archivo tenga viñetas y capas compatibles; rechaza metadata ajena y evita que un proyecto cargue imágenes remotas.
- Exportación visual y metadata marcada `review`, sin publicar. Los paquetes de imagen están listos para revisión y carga manual.
- Si el navegador alcanza su cuota local, el botón de guardado informa el fallo en vez de mostrar un éxito falso; si no puede escribirse el proyecto, el índice de archivos se revierte para evitar una entrada rota. Los ZIP de revisión siguen descargables y muestran que el borrador no se guardó en ese dispositivo.
- Tema oscuro, modo de lienzo amplio y trazos vectoriales básicos para ratón, dedo y Apple Pencil.

Los tamaños son presets iniciales basados en el inventario actual y las relaciones de aspecto comunes. Son una propuesta de trabajo, no un formato canónico obligatorio.

## Inventario y fidelidad

La biblioteca reconoce Mando y Señor Mandarino como una sola identidad con alias y variantes disponibles. Los recortes transparentes existentes se pueden colocar sin fondo. Los stickers existentes conservan su arte original. Las láminas con el mueble azul se muestran como referencias no insertables: quitar personas y globos exige un original por capas o una restauración manual revisada por Mauricio. La importación de dibujos permite incorporar arte propio; el editor no inventa variantes de personajes.

## Archivo e integración con IA

`.man` ya es una extensión conocida para fuentes de páginas de manual Unix/groff. Para evitar colisiones, el archivo nativo del editor usa `.mandarinita`; es un ZIP con `proyecto.json` y, al importar dibujos, sus datos de imagen. Ese JSON legible ofrece un formato de intercambio útil para ChatGPT, Codex, Claude y Gemini. Un siguiente paso puede definir un esquema versionado y un conjunto de operaciones/endpoint local o MCP para que los agentes editen borradores sin automatizar aprobación ni publicación.

## Guardado entre dispositivos

La implementación usa Pages Functions, GitHub OAuth con verificación del correo autorizado y un bucket R2 privado. El middleware protege el editor y su catálogo; las rutas privadas no se sirven si todavía falta la configuración. El archivo JSON editable continúa siendo la unidad almacenada; no hace falta una base relacional para la lista personal de borradores. Los secretos quedan del lado de Pages. La configuración y los pasos pendientes están en [EDITOR-CLOUD-SYNC.md](EDITOR-CLOUD-SYNC.md). Mientras tanto, la vista local se puede abrir desde un servidor de desarrollo.

Supabase sería útil si el producto evolucionara a cuentas de varios artistas, relaciones de datos consultables o permisos por equipo; añadirlo ahora duplicaría autenticación y almacenamiento. R2 y Pages Functions cubren la necesidad individual con menor operación. Falta habilitar OAuth/R2 en el proyecto y probar conflictos desde dos dispositivos antes de considerar lista la sincronización.

## Progreso del atlas piloto

Mando es el primer personaje en revisión: el catálogo enlaza 73 apariciones observables en treinta y cinco episodios y hay una hoja comparativa de paneles completos. Solo la pose sonriente con brazos levantados de 46.3 tiene un recorte de cuerpo completo con origen de episodio verificado. El retrato neutral de cabeza aún no tiene fuente de episodio asociada. No se ha construido rig ni se han añadido partes anatómicas separadas. El contrato de intercambio para importar futuras capas quedó especificado en [la guía de sprites](EDITOR-CHARACTER-SPRITES.md), pendiente de validarse con la primera muestra real de Procreate. Véase [atlas piloto de Mando](MANDO-PILOT-ATLAS.md).

El editor ya permite buscar entre las 424 imágenes de `assets/episodes/`, además de las referencias de personajes, usando etiquetas y notas visuales para localizar mobiliario, lugares, objetos, vehículos y fondos candidatos. En esta pasada se añadieron 30 paneles publicados en JPG que no estaban indexados y cinco archivos de episodio sin vínculo editorial, marcados en revisión. Las viñetas siguen siendo solo consulta y no se insertan como componentes. El atlas de personajes conserva 133 apariciones confirmadas de episodios y siete imágenes de personaje opacas; las etiquetas nuevas de la hoja de contacto no se promueven a identidades de personaje sin cotejo a resolución completa.

La última validación local confirmó la reapertura de un `.mandarinita` de dos viñetas con su capa, el rechazo de imágenes remotas al importar proyectos, la consulta offline del catálogo en la PWA y el manejo de cancelación de un trazo. Un navegador móvil simulado hizo zoom con pellizco de dos dedos (51% → 82%) y con rueda (82% → 92%), sin desbordamiento horizontal. Falta comprobar la sensación real en iPad y Apple Pencil.

## Próximos hitos

1. Validar la experiencia local en iPhone/iPad y escritorio; corregir interacción con lápiz, accesibilidad y persistencia.
2. Completar la revisión del catálogo visual con Mauricio a resolución completa; seguir el atlas piloto de Mando y después revisar los demás personajes, objetos y fondos. Para el rig de Mando hacen falta dibujos fuente separados preparados por Mauricio; seguir el modelo y las restricciones de [sprites de personajes](EDITOR-CHARACTER-SPRITES.md). Toda extracción nueva pasa a revisión antes de entrar a la biblioteca aprobada.
3. Configurar la OAuth App de GitHub y el bucket R2 privado; verificar la integración desde dos dispositivos y añadir recuperación/versiones antes de depender de la nube.
4. Diseñar programación/publicación Meta solo después de verificar permisos oficiales de la cuenta. La exportación manual permanece disponible y ningún episodio se publica sin aprobación explícita.
