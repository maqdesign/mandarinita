# Taller Mandarinita: alcance y decisiones

## Flujo actual

El taller está desplegado en `mandarinita.art` y en el preview de Cloudflare Pages. GitHub OAuth restringe el acceso a la cuenta autorizada y Pages Functions almacena los proyectos editables en el bucket privado R2 `mandarinita-editor-projects`. Los borradores se comparten entre dispositivos con la misma cuenta. El índice de proyectos usa metadatos ligeros; los documentos de la nube se descargan al abrirlos para evitar agotar la cuota local de Safari. El archivo editable también queda en el dispositivo cuando cabe.

El flujo cubre creación, composición, vista previa, exportación de revisión, publicación web y administración del catálogo publicado. La publicación genera PNG por viñeta, exige títulos en español e inglés y textos alternativos bilingües, sugiere metadatos de búsqueda y permite programar o retirar episodios. Publicar a Instagram o programar allí aún no está integrado.

`episodes.json` continúa siendo el archivo editorial existente y los episodios publicados desde el editor se guardan como manifiestos en R2; no se reescribe el catálogo estático. Los episodios se pueden administrar desde el editor y el buscador público consulta el índice combinado.

## Capacidades implementadas

- Biblioteca de componentes aprobados, alias para búsquedas y más espacio para capas.
- Composición multipanel; mover, seleccionar, redimensionar, bloquear, duplicar y reordenar elementos.
- Globos de diálogo, pensamiento, narración, voz fuerte y efectos; texto editable y crecimiento automático.
- Formatos Web 3:2, Instagram cuadrado 1:1 e Instagram vertical 4:5; el lienzo adopta el formato elegido y avisa de elementos fuera de cuadro.
- Borradores locales y en R2 privado, con sincronización entre dispositivos, carga de proyectos de nube al abrirlos, conflictos protegidos por ETag y paquete editable `.mandarinita`. El ZIP conserva el proyecto versionado (`schemaVersion: 1`) y valida estructura y archivos al importarse.
- Vista previa final y exportación de revisión. La publicación web desde el editor sube las viñetas, registra metadatos de búsqueda y accesibilidad y admite programación y retiro por fecha. Los episodios publicados se administran desde el editor.
- La cuota de Safari se controla con un índice remoto ligero: el taller no descarga todos los proyectos en cada dispositivo. Cuando una copia de nube se abre, el editor mantiene el documento en memoria y sincroniza los cambios sin exigir otra copia local completa.
- Tema oscuro, modo de lienzo amplio y trazos vectoriales básicos para ratón, dedo y Apple Pencil.

Los tamaños son presets iniciales basados en el inventario actual y las relaciones de aspecto comunes. Son una propuesta de trabajo, no un formato canónico obligatorio.

## Inventario y fidelidad

La biblioteca reconoce Mando y Señor Mandarino como una sola identidad con alias y variantes disponibles. Los recortes transparentes existentes se pueden colocar sin fondo. Los stickers existentes conservan su arte original. Las láminas con el mueble azul se muestran como referencias no insertables: quitar personas y globos exige un original por capas o una restauración manual revisada por Mauricio. La importación de dibujos permite incorporar arte propio; el editor no inventa variantes de personajes.

## Archivo e integración con IA

`.man` ya es una extensión conocida para fuentes de páginas de manual Unix/groff. Para evitar colisiones, el archivo nativo del editor usa `.mandarinita`; es un ZIP con `proyecto.json` y, al importar dibujos, sus datos de imagen. Ese JSON legible ofrece un formato de intercambio útil para ChatGPT, Codex, Claude y Gemini. Un siguiente paso puede definir un esquema versionado y un conjunto de operaciones/endpoint local o MCP para que los agentes editen borradores sin automatizar aprobación ni publicación.

## Guardado entre dispositivos

Pages Functions, GitHub OAuth y R2 privado ya están configurados y desplegados. La sesión se limita al correo autorizado y los secretos permanecen en Pages. La sincronización y sus límites están documentados en [EDITOR-CLOUD-SYNC.md](EDITOR-CLOUD-SYNC.md).

La prioridad pendiente es añadir historial restaurable y hacer una revisión manual del flujo entre dispositivos, incluida la recuperación tras uso offline. No hay edición simultánea en vivo: las escrituras concurrentes quedan protegidas por ETags y requieren elegir qué versión conservar. R2 sigue siendo suficiente para el taller personal; una base relacional no aportaría valor claro mientras no haya flujos de equipo y consultas más complejas.

## Progreso del atlas piloto

Mando es el primer personaje en revisión: el catálogo enlaza 73 apariciones observables en treinta y cinco episodios y hay una hoja comparativa de paneles completos. Solo la pose sonriente con brazos levantados de 46.3 tiene un recorte de cuerpo completo con origen de episodio verificado. El retrato neutral de cabeza aún no tiene fuente de episodio asociada. No se ha construido rig ni se han añadido partes anatómicas separadas. El contrato de intercambio para importar futuras capas quedó especificado en [la guía de sprites](EDITOR-CHARACTER-SPRITES.md), pendiente de validarse con la primera muestra real de Procreate. Véase [atlas piloto de Mando](MANDO-PILOT-ATLAS.md).

El editor ya permite buscar entre las 424 imágenes de `assets/episodes/`, además de las referencias de personajes, usando etiquetas y notas visuales para localizar mobiliario, lugares, objetos, vehículos y fondos candidatos. En esta pasada se añadieron 30 paneles publicados en JPG que no estaban indexados y cinco archivos de episodio sin vínculo editorial, marcados en revisión. Las viñetas siguen siendo solo consulta y no se insertan como componentes. El atlas de personajes conserva 133 apariciones confirmadas de episodios y siete imágenes de personaje opacas; las etiquetas nuevas de la hoja de contacto no se promueven a identidades de personaje sin cotejo a resolución completa.

La última validación local confirmó la reapertura de un `.mandarinita` de dos viñetas con su capa, el rechazo de imágenes remotas al importar proyectos, la consulta offline del catálogo en la PWA y el manejo de cancelación de un trazo. Un navegador móvil simulado hizo zoom con pellizco de dos dedos (51% → 82%) y con rueda (82% → 92%), sin desbordamiento horizontal. Falta comprobar la sensación real en iPad y Apple Pencil.

## Próximos hitos

1. Verificar el flujo real entre iPhone, iPad y escritorio: abrir proyectos “En la nube”, editarlos, trabajar sin conexión y resolver cambios simultáneos sin perder trabajo.
2. Añadir historial de versiones con restauración y un indicador de guardado remoto persistente por proyecto.
3. Integrar publicación y programación de Instagram solo después de configurar una Meta App, permisos de Instagram Graph API y una cuenta profesional autorizada. Mientras tanto, exportar y publicar en la web funciona sin esa integración.
4. Seguir aprobando recortes de personajes, objetos y fondos a partir de fuentes originales; las referencias pendientes no deben habilitarse como piezas insertables sin revisión.
5. Evaluar una interfaz de revisión previa al estreno que reúna títulos, textos alternativos, numeración, fechas, firma de marca y vista previa en una sola lista de comprobación.
