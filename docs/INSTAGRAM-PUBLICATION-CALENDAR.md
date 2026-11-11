# Calendario y publicación automática en Instagram

## Meta de producto

Desde un borrador aprobado, Mauricio debe poder elegir fecha y hora, verlo en un calendario editorial, reprogramarlo y cancelar la publicación. La automatización debe publicar el carrusel completo, guardar el enlace de Instagram y mostrar estados claros: programado, publicando, publicado o requiere atención. La zona horaria inicial será `America/Santo_Domingo`.

## Lo que falta para publicar automáticamente

- Una cuenta de Instagram Profesional (Creador o Empresa) vinculada a una Página de Facebook.
- Una aplicación de Meta con Instagram Graph API y permisos de publicación aprobados para la cuenta.
- Completar y verificar el flujo OAuth de Meta para la cuenta propietaria. Los tokens se guardan como secretos en Cloudflare; nunca en el navegador ni en el archivo editable.
- Elegir una URL de medios que Meta pueda descargar durante la publicación. El bucket de borradores seguirá privado; las imágenes listas para publicar requerirán URLs temporales y revocables.

## Arquitectura prevista

- El editor guarda la fecha, el formato y el proyecto asociado en el borrador sincronizado.
- Una tabla D1 mantiene la cola, zona horaria, intentos, resultado y referencia a la publicación de Meta. R2 continúa guardando los archivos editables privados.
- Un Cloudflare Worker con Cron revisa publicaciones vencidas, inicia el proceso de carrusel de Instagram, confirma el resultado y reintenta errores transitorios de forma idempotente.
- La interfaz ofrece una vista mensual y una lista de próximos, fallidos y publicados, con mensajes que permitan corregir o reintentar.

## Criterios de aceptación

1. Una publicación se puede programar, editar y cancelar desde el calendario.
2. La hora que se muestra y ejecuta corresponde a `America/Santo_Domingo`, incluso cuando cambia el horario del dispositivo.
3. Solo borradores aprobados se pueden programar.
4. Una ejecución repetida del Cron no crea dos publicaciones iguales.
5. Fallos de Meta preservan el borrador y permiten reintentar sin perder la fecha o los medios.
6. Sin la conexión de Meta, el calendario explica qué falta y no presenta una publicación como programada o publicada.
