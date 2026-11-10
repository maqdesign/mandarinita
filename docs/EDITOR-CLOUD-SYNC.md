# Sincronización privada del taller

## Alcance

El editor conserva el guardado local y el archivo `.mandarinita`. Este cambio añade una vía opcional para iniciar sesión con GitHub y sincronizar el mismo catálogo privado de proyectos en distintos dispositivos. Solo se admite la cuenta que tenga verificado como principal el correo `mauricio@mandarinita.art`. La autorización de GitHub solicita únicamente `read:user` y `user:email`; no solicita acceso a repositorios ni permite publicar en el sitio.

Las rutas de Pages Functions están en `functions/api/`; el middleware protege la página del editor y el catálogo. El intercambio OAuth y la sesión firmada ocurren en el servidor. El navegador recibe una cookie `HttpOnly`, `Secure` y `SameSite=Lax`; no recibe el secreto OAuth ni un token de GitHub. Los archivos de proyecto se guardan en un bucket R2 privado, bajo el prefijo `users/mauricio/projects/`. No se introdujo una base de datos: para una sola persona y un listado pequeño de archivos, la clave, el título y la fecha de modificación que ofrece R2 son suficientes.

## Configuración pendiente en Cloudflare y GitHub

La integración no se activa hasta que esta configuración exista. Revisé el proyecto Pages `mandarinita`: hoy está conectado a `maqdesign/mandarinita`, tiene previews de rama habilitados, pero su última publicación no usa Functions y no tiene variables de entorno.

1. **Crear la app de GitHub.** Abre [GitHub Developer Settings](https://github.com/settings/developers) y elige **OAuth Apps → New OAuth App**. Usa:
   - Application name: `Taller Mandarinita`
   - Homepage URL: `https://mandarinita.art`
   - Authorization callback URL: `https://mandarinita.art/api/auth/github/callback`
   - Deja desactivado **Enable Device Flow**.
   Después de crearla, copia el **Client ID**. Pulsa **Generate a new client secret** y guarda ese secreto directamente en Cloudflare; no lo envíes por chat ni lo publiques en una issue.
2. **Crear el almacenamiento.** En el [Dashboard de Cloudflare](https://dash.cloudflare.com/?to=/:account/workers-and-pages), abre **R2 Object Storage** y crea un bucket privado llamado `mandarinita-editor-projects`.
3. **Conectar R2 con Pages.** En **Workers & Pages → mandarinita → Settings → Bindings → Add → R2 bucket**, elige el bucket y escribe exactamente `MANDARINITA_PROJECTS` como nombre de binding. Cloudflare indica que hay que volver a desplegar para aplicar un binding nuevo.
4. **Guardar variables y secretos.** En **Settings → Variables and Secrets**, configura los valores en el entorno Production:
   - Variable de texto `GITHUB_CLIENT_ID`: el Client ID que mostró GitHub.
   - Variable de texto `MANDARINITA_SYNC_EMAIL`: `mauricio@mandarinita.art`.
   - Secreto cifrado `GITHUB_CLIENT_SECRET`: el secreto que GitHub acaba de generar.
   - Secreto cifrado `SESSION_SECRET`: una cadena aleatoria de al menos 32 bytes, generada en tu dispositivo y pegada directamente en Cloudflare.
5. **Avisarme con “listo”.** Entonces podré verificar la configuración, preparar el despliegue de prueba y comprobar el acceso con la cuenta autorizada. No configures una app OAuth para previews todavía: cada hostname de preview necesita su propio callback registrado y primero debemos elegir una URL de rama estable.

La interfaz de Cloudflare permite guardar secretos cifrados desde **Variables and Secrets**; una vez guardados, no vuelvas a copiarlos a este chat. La configuración de producción debe repetirse en Preview solo cuando tengamos una URL estable y una OAuth App con ese callback.

El callback se debe cambiar si el dominio estable del proyecto no es `mandarinita.art`. Las URLs efímeras de preview no comparten el callback OAuth y no sirven para probar el login sin registrar antes una OAuth App con un callback apropiado.

## Comportamiento y límites

- El guardado local sigue primero; la subida se programa después de una pausa breve. Si falla el almacenamiento local, el editor intenta enviar la copia de nube cuando la sesión ya está conectada. Si la nube falla, el borrador local y su exportación continúan disponibles.
- Sin OAuth y R2 configurados, Pages devuelve una pantalla de acceso no disponible para las rutas privadas. La vista de trabajo local permanece accesible desde un servidor local; no se expone públicamente el catálogo de referencias.
- Al iniciar sesión en un dispositivo, los proyectos remotos que falten se descargan; si las copias locales son más recientes, se suben. Si hay dos ediciones concurrentes, gana la de fecha `updatedAt` más reciente. Antes de usarlo como almacenamiento único, conviene añadir historial de versiones/conflictos.
- El endpoint limita cada proyecto a 25 MB. Los datos personales se reducen al email autorizado y nombre de cuenta de GitHub; no se guarda el token OAuth.
- Cerrar sesión no elimina proyectos locales ni del bucket.
- Ninguna función escribe en `episodes.json`, publica en el sitio o programa Instagram. La aprobación y publicación siguen siendo pasos manuales.

## Verificación previa a activar

Comprobar que `GET /api/auth/status` devuelve `configured: true`, que un usuario con otro email recibe rechazo y que la sesión de Mauricio puede listar, descargar, guardar y borrar proyectos. Confirmar también que al cerrar sesión los endpoints de proyectos responden `401`, que R2 no tiene acceso público y que ninguna variable secreta aparece en HTML, JavaScript, logs o respuestas.
