# Recuperación de episodios de Notion — 31 oct 2026

Fuente de verdad: `content/notion-originals-manifest.json`, extraído de las páginas de episodio en Notion mediante el conector autorizado.

## Episodios catalogados
- Ep 1 «La mosca»: 4 láminas A/B/C/D — https://app.notion.com/p/f3a519c8a8a54776bc51d7411ec49089
- Ep 2 «Ansiosa»: 4 láminas — https://app.notion.com/p/6b76c1fb60b2462cbaacd49ff3fef572
- Ep 44 «El teletrabajo»: 5 láminas — https://app.notion.com/p/0b956fced23c48a5b8f9353e714d9c54
- Ep 51 «¿Tienes hambre?»: 6 láminas — https://app.notion.com/p/2306ff2d843844be8f2dab4d68b977d2
- Ep 52 «Fruitflix»: 5 láminas — https://app.notion.com/p/ef6ee4524fe44ec38a1a8f6b008d2606

Las 24 referencias `notion-file-block://` y nombres originales están documentados en el manifest. La secuencia conserva el orden de bloques de las páginas de Notion; aún es necesaria revisión visual del indicador de la mandarina en el pie, especialmente en «Ansiosa», cuyo orden de archivos no es numérico.

## Recuperación segura de binarios (pendiente)
1. Leer de nuevo en Notion las páginas con `include_file_urls: true` y acceder al mapa `metadata.references`; los enlaces firmados de S3 **caducan a los cinco minutos**. Nunca publicar ni comitear URLs firmadas ni credenciales.
2. Descargarlas **en el momento**, solo en entorno autorizado con acceso a red y a GitHub, usando los `notionFileBlock` del manifest.
3. Conservar los bytes originales y hashes SHA-256. Guardar en cada `destination` existente en el manifest.
4. Comprobar visualmente orden por indicador inferior, firmas, orientación, no recorte y que todas las láminas carguen en móvil.
5. Actualizar `content/episodes.json`: añadir entradas a revisión, convertir a `complete: true` únicamente cuando todos los archivos estén presentes y aprobados editorialmente; entonces permitir `published`.
6. Validar `node scripts/validate-episodes.mjs` y pruebas Playwright; abrir PR. No editar las páginas originales de Notion.

**El conector Notion utilizado para esta preparación devuelve la página y enlaces a los ficheros, pero no transfiere bytes de imagen directamente al entorno de GitHub.** Por eso el manifest aún tiene `assetImported: false`. No presentar los episodios como publicados ni sustituir los registros actuales hasta que se copien los originales.
