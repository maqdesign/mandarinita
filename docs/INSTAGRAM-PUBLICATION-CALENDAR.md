# Calendario y publicación automática en Instagram

## Meta de producto

Desde un borrador aprobado, Mauricio debe poder elegir fecha y hora, verlo en un calendario editorial, reprogramarlo y cancelar la publicación. La automatización debe publicar el carrusel completo, guardar el enlace de Instagram y mostrar estados claros: programado, publicando, publicado o requiere atención. La zona horaria inicial será `America/Santo_Domingo`.

## Ruta elegida: Instagram Login

Usaremos **Instagram API with Instagram Login** para conectar la cuenta profesional directamente. Este flujo no requiere vincular una Página de Facebook y evita mezclar la conexión de Instagram con el inicio de sesión de GitHub. La cuenta debe ser Profesional (Creador o Empresa). Meta documenta los permisos `instagram_business_basic` y `instagram_business_content_publishing`, y el host de API `graph.instagram.com`.

La ruta alternativa, Instagram API with Facebook Login, sí depende de activos de Facebook y permisos distintos. No seguiremos esa ruta para el taller salvo que Instagram Login no funcione con la cuenta.

## Lo que falta para publicar automáticamente

- Crear o seleccionar una Meta App e incorporar el producto Instagram con Instagram Login.
- Implementar en el editor su callback OAuth independiente. **Todavía no existe una URL callback de Meta en el código**: hay que crear la ruta y después copiar su URL exacta a la configuración de Meta. No se debe reutilizar `/api/auth/github/callback` ni registrar una URL inventada.
- Autorizar la cuenta propietaria y confirmar que puede obtener `instagram_business_basic` e `instagram_business_content_publishing`. Para el taller personal probaremos primero con la cuenta propietaria como persona con rol en la app; si se abre a otras personas, Meta puede requerir Advanced Access y revisión de la app.
- Guardar y renovar los tokens del lado servidor. Nunca ponerlos en el navegador, en un borrador ni en un commit.
- Elegir una URL de medios que Meta pueda descargar durante la publicación. El bucket de borradores seguirá privado; las imágenes listas para publicar requerirán URLs temporales y revocables.

## Arquitectura prevista

- El editor guarda la fecha, el formato y el proyecto asociado en el borrador sincronizado.
- Una tabla D1 mantiene la cuenta conectada, la cola, zona horaria, intentos, resultado y referencia a la publicación de Meta. Los tokens deben cifrarse con una clave exclusiva de Cloudflare; R2 continúa guardando los archivos editables privados.
- Un Cloudflare Worker con Cron revisa publicaciones vencidas, inicia el proceso de carrusel de Instagram, confirma el resultado y reintenta errores transitorios de forma idempotente.
- La interfaz ofrece una vista mensual y una lista de próximos, fallidos y publicados, con mensajes que permitan corregir o reintentar.

## Criterios de aceptación

1. Una publicación se puede programar, editar y cancelar desde el calendario.
2. La hora que se muestra y ejecuta corresponde a `America/Santo_Domingo`, incluso cuando cambia el horario del dispositivo.
3. Solo borradores aprobados se pueden programar.
4. Una ejecución repetida del Cron no crea dos publicaciones iguales.
5. Fallos de Meta preservan el borrador y permiten reintentar sin perder la fecha o los medios.
6. Sin la conexión de Meta, el calendario explica qué falta y no presenta una publicación como programada o publicada.

## Guía de configuración paso a paso

1. Comprobar en Instagram que la cuenta es Profesional (Creador o Empresa). No hace falta conectarla a una Página de Facebook si usamos Instagram Login.
2. En Meta for Developers, crear o elegir la app y añadir el producto de Instagram que ofrece **Instagram Login**. No configurar Facebook Login para Instagram.
3. Implementar primero el endpoint callback del taller. Luego copiar la URL completa que entregue el editor al campo de OAuth Redirect URI de Meta, carácter por carácter; tendremos una URL distinta para preview y producción.
4. Configurar el inicio de sesión empresarial de Instagram y solicitar solo `instagram_business_basic` y `instagram_business_content_publishing`.
5. Hacer la primera autorización con la cuenta propietaria y confirmar que Meta devuelve un token y el identificador de la cuenta profesional.
6. Probar una publicación privada/de prueba desde el entorno preview, verificar el resultado en Instagram y revisar la expiración/renovación del token.
7. Solo después de completar las pruebas, habilitar la cuenta de producción y el calendario automático.

Si Meta detiene el proceso, tomar una captura del paso y del mensaje exacto. El error `redirect_uri is not associated with this application` visto anteriormente corresponde a la app de **GitHub OAuth**; no sirve para diagnosticar la configuración de Instagram.
