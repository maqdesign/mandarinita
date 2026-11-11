# Sincronización privada del taller

## Estado actual

El editor y sus Pages Functions ya están desplegados en producción en `mandarinita.art`. El inicio de sesión usa GitHub OAuth y el almacenamiento privado usa el bucket R2 `mandarinita-editor-projects`, enlazado como `MANDARINITA_PROJECTS`. La autorización y el guardado se ejecutan en el servidor; el navegador nunca recibe `GITHUB_CLIENT_SECRET` ni `SESSION_SECRET`.

La autenticación limita el acceso a los correos de GitHub verificados configurados en Cloudflare. `MANDARINITA_SYNC_EMAIL` admite una sola dirección o una lista separada por comas, espacios o punto y coma; así se puede conceder acceso a colaboradores sin hacer público el taller. Los colaboradores autorizados comparten actualmente el mismo archivo de proyectos en R2. El flujo OAuth solicita `read:user` y `user:email`, no solicita repositorios ni permisos para publicar. La sesión usa cookie `HttpOnly`, `Secure`, `SameSite=Lax` y expira en siete días. Los proyectos se guardan bajo `users/mauricio/projects/`, con límite de 25 MB por proyecto.

## Guardado y conflictos

- Cada cambio se guarda primero en el dispositivo y la subida a R2 se agrupa tras una pausa breve.
- Al conectar un dispositivo, el editor compara la copia local con la versión de R2. Los proyectos que faltan se descargan; los cambios locales pendientes se suben con una condición de versión.
- Las escrituras usan ETags de R2 (`If-Match` para actualizar y `If-None-Match: *` para crear). Si la versión remota cambió desde la última sincronización, R2 rechaza la escritura y el editor conserva la copia local.
- El editor ofrece descargar la copia local, reemplazarla con la versión de la nube o reemplazar la nube con la copia local. La última opción requiere una acción explícita.
- No hay edición en tiempo real ni bloqueo del archivo. Si Mauricio edita un proyecto desde dos dispositivos, los cambios concurrentes producen un conflicto visible en lugar de reemplazarse en silencio.
- La detección de conflictos compara el ETag con la última versión sincronizada en cada dispositivo. En la primera conexión de una instalación antigua que no tenga esa marca, cualquier diferencia entre la copia local y la remota requiere elección explícita.
- Un rechazo HTTP 400 muestra ahora el motivo de validación que devuelve Pages Functions, en vez de ocultarlo tras el número de error. Cada dispositivo conserva su copia local hasta que una escritura o descarga a R2 termine correctamente.

Los proyectos no se borran de `episodes.json` ni se publican en la web. La programación automática de Instagram sigue pendiente. Los paquetes exportados siguen en revisión hasta que Mauricio los apruebe.

## Validación de lanzamiento

Antes de cualquier cambio en OAuth, R2, cuentas o permisos, validar:

1. `GET /api/auth/session` devuelve `configured: true` con una sesión autenticada.
2. Sin sesión, las rutas de proyectos responden `401`; sin configuración, responden `503`.
3. Crear el mismo ID en dos sesiones solo permite la primera escritura (`If-None-Match: *`).
4. Una escritura con ETag obsoleto responde `412` y conserva el objeto remoto.
5. Tras un conflicto, el editor conserva el borrador local y permite descargarlo o elegir una versión.
6. Los límites de 25 MB, la restricción de origen para escritura y el acceso privado de R2 siguen activos.

Ningún valor secreto debe copiarse a archivos públicos, issues, commits, capturas o logs.
