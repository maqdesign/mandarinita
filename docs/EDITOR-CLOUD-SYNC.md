# Sincronización privada del taller

## Estado actual

El editor y sus Pages Functions ya están desplegados en producción en `mandarinita.art`. El inicio de sesión usa GitHub OAuth y el almacenamiento privado usa el bucket R2 `mandarinita-editor-projects`, enlazado como `MANDARINITA_PROJECTS`. La autorización y el guardado se ejecutan en el servidor; el navegador nunca recibe `GITHUB_CLIENT_SECRET` ni `SESSION_SECRET`.

La autenticación limita el acceso a los correos de GitHub verificados configurados en Cloudflare. `MANDARINITA_SYNC_EMAIL` admite una sola dirección o una lista separada por comas, espacios o punto y coma; así se puede conceder acceso a colaboradores sin hacer público el taller. Los colaboradores autorizados comparten actualmente el mismo archivo de proyectos en R2. El flujo OAuth solicita `read:user` y `user:email`, no solicita repositorios ni permisos para publicar. La sesión usa cookie `HttpOnly`, `Secure`, `SameSite=Lax` y expira en siete días. Los proyectos se guardan bajo `users/mauricio/projects/`, con límite de 25 MB por proyecto.

## Guardado y conflictos

- Cada cambio se guarda primero en el dispositivo y la subida a R2 se agrupa tras una pausa breve.
- Al iniciar sesión o reintentar, se reparan los IDs heredados o inconsistentes en el índice local antes de subirlos. El contenido se escribe bajo un ID nuevo antes de retirar la clave local anterior.
- Si la sincronización inicial aún está comparando la nube y se edita un borrador, la subida espera a que termine esa comparación y luego envía la versión más reciente.
- Si R2 devuelve el error de ID inválido, el editor conserva el proyecto, lo reidentifica localmente y reintenta la subida una vez.
- Al conectar un dispositivo, el editor consulta un índice pequeño de metadatos en R2. Los proyectos que no están en el dispositivo aparecen como “En la nube” y se descargan solo al abrirlos; así Safari no intenta duplicar de golpe todos los archivos en `localStorage`. Los proyectos locales modificados se suben con una condición de versión.
- Con el taller abierto y visible, cada dispositivo consulta cambios de la nube cada 30 segundos; al volver a la pestaña también comprueba si hay cambios.
- Las escrituras usan ETags de R2 (`If-Match` para actualizar y `If-None-Match: *` para crear). Si la versión remota cambió desde la última sincronización, R2 rechaza la escritura y el editor conserva la copia local.
- El editor ofrece descargar la copia local, reemplazarla con la versión de la nube o reemplazar la nube con la copia local. La última opción requiere una acción explícita.
- No hay edición simultánea en tiempo real ni bloqueo del archivo. Si Mauricio edita un proyecto desde dos dispositivos, la otra pantalla recoge cambios en la siguiente consulta; los cambios concurrentes producen un conflicto visible en lugar de reemplazarse en silencio.
- La detección de conflictos compara el ETag con la última versión sincronizada en cada dispositivo. Si la nube avanzó y el dispositivo solo conservaba una copia local ya sincronizada, se retira esa copia local y se deja el registro como “En la nube”; si hay cambios locales pendientes, se requiere elección explícita. En la primera conexión de una instalación antigua sin marca de sincronización, cualquier diferencia entre la copia local y la remota requiere elección explícita.
- Un rechazo HTTP 400 muestra ahora el motivo de validación que devuelve Pages Functions, en vez de ocultarlo tras el número de error. Cada dispositivo conserva sus cambios locales pendientes hasta que la escritura a R2 termine correctamente. Si Safari no puede guardar una copia local completa, el editor mantiene el documento abierto y envía el estado a la nube.

Los proyectos no se borran de `episodes.json` ni se publican en la web. La programación automática de Instagram sigue pendiente. Los paquetes exportados siguen en revisión hasta que Mauricio los apruebe.

## Límites actuales

- La sincronización carga la versión completa del proyecto al abrirlo, no en tiempo real mientras está abierta en otro dispositivo. La comprobación periódica detecta el cambio y conserva ambas versiones si se editó en paralelo.
- Los archivos “En la nube” necesitan conexión para abrirse. La vista previa de tarjeta se omite deliberadamente para no bajar las imágenes y capas del proyecto entero.
- Cada borrador tiene un historial privado de hasta 30 puntos de recuperación. Se crea una instantánea cuando el contenido cambia y han pasado cinco minutos desde la anterior; restaurar primero guarda la versión actual y exige que el ETag no haya cambiado. No es un historial por cada pulsación ni una fusión automática de ediciones.

## Validación de lanzamiento

Antes de cualquier cambio en OAuth, R2, cuentas o permisos, validar:

1. `GET /api/auth/session` devuelve `configured: true` con una sesión autenticada.
2. Sin sesión, las rutas de proyectos responden `401`; sin configuración, responden `503`.
3. Crear el mismo ID en dos sesiones solo permite la primera escritura (`If-None-Match: *`).
4. Una escritura con ETag obsoleto responde `412` y conserva el objeto remoto.
5. Tras un conflicto, el editor conserva el borrador local y permite descargarlo o elegir una versión.
6. Los límites de 25 MB, la restricción de origen para escritura y el acceso privado de R2 siguen activos.

Ningún valor secreto debe copiarse a archivos públicos, issues, commits, capturas o logs.
