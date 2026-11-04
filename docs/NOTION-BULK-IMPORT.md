# Importación automática desde Notion

`scripts/notion-bulk-import.mjs` copia al sitio las viñetas finales de los episodios publicados que aún no están en `episodes.json`. No crea ZIP: descarga los archivos directamente a `assets/episodes/` y añade cada episodio al catálogo. Al terminar, los episodios nuevos quedan en `review`; solo los seis ya publicados permanecen públicos.

El importador conserva el orden de los bloques, omite las imágenes del pie de página y deja de recopilar imágenes al encontrar el encabezado `Bocetos / ideas alternas`. No usa la propiedad de portada como viñeta si el cuerpo de la página no contiene láminas identificables. Si dos páginas publicadas reclaman el mismo número, o una descarga falla, se detiene sin escribir el catálogo.

## Preparación única

1. En Notion, crea una integración interna desde **Settings → Connections → Develop or manage integrations** y copia su secret. No lo compartas en el chat ni lo guardes en el repositorio.
2. Abre la base **Episodios de Mandarinita**, usa `••• → Connections` y comparte la base con esa integración.
3. En una terminal dentro del checkout, define el secret solo para esa sesión:

   ```sh
   export NOTION_TOKEN='secret_...'
   ```

Si el secreto del entorno ya está guardado como `NOTIO_TOKEN`, el importador también lo acepta. `NOTION_TOKEN` tiene prioridad si están definidos ambos nombres.

El importador ya conoce el ID de la fuente de datos de esta base. Si se usa en otra copia, se puede definir `NOTION_DATA_SOURCE_ID` con el ID de la fuente de datos y `NOTION_API_VERSION` para cambiar la versión de la API.

## Uso

Primero revisa qué importaría, sin descargar ni escribir:

```sh
node --use-env-proxy scripts/notion-bulk-import.mjs --dry-run
```

Luego baja las imágenes y agrega las entradas como revisión:

```sh
node --use-env-proxy scripts/notion-bulk-import.mjs
node scripts/validate-episodes.mjs
```

En el entorno de Cloud Environment, conserva la configuración de `HTTP_PROXY`/`HTTPS_PROXY` y ejecuta Node con `--use-env-proxy`; si se omite, Node intenta conectarse directamente y puede fallar con `ECONNREFUSED` aunque los dominios estén permitidos.

La ejecución es repetible: compara los números de episodio con `episodes.json` y omite cualquier episodio que ya exista. No vuelve a bajar ni duplica los seis episodios actuales. Las viñetas originales se guardan en carpetas con nombres estables y extensiones reconocidas.

Después de revisar visualmente el orden, las láminas y su lectura en móvil, puedes publicar en el catálogo solo los episodios importados por esta herramienta que sigan en revisión y tengan todos sus archivos:

```sh
node scripts/notion-bulk-import.mjs --publish-reviewed
```

Ese paso no necesita el token de Notion. No despliega cambios; Cloudflare Pages publica cuando los cambios aprobados llegan a `main`.

## Prueba local

```sh
node scripts/notion-bulk-import.mjs --self-test
```

Comprueba el reconocimiento de números, la exclusión de bocetos y pies genéricos, la deduplicación de paneles y los nombres de archivo.
