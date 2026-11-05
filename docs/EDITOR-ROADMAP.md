# Taller Mandarinita: alcance y decisiones

## Flujo actual

El editor de prueba es una aplicación estática servida por Cloudflare Pages. Los proyectos viven en `localStorage` del navegador; no hay cuentas ni sincronización en la nube. `episodes.json` requiere `status: review` hasta la aprobación manual. Los archivos `.png` de episodios son láminas aplanadas: el repositorio no contiene fuentes por capas para separar de forma fiel muebles, personajes u otros objetos.

## MVP local que ya se está probando

- Biblioteca de componentes aprobados, alias para búsquedas y más espacio para capas.
- Composición multipanel; mover, seleccionar, redimensionar, bloquear, duplicar y reordenar elementos.
- Globos de diálogo, pensamiento, narración, voz fuerte y efectos; texto editable y crecimiento automático.
- Formatos Web 3:2, Instagram cuadrado 1:1 e Instagram vertical 4:5; el lienzo adopta el formato elegido y avisa de elementos fuera de cuadro.
- Gestor local de borradores y paquete de proyecto `.mandarinita`, que conserva la estructura editable en `proyecto.json`.
- Exportación visual y metadata marcada `review`, sin publicar. Los paquetes de imagen están listos para revisión y carga manual.
- Tema oscuro, modo de lienzo amplio y trazos vectoriales básicos para ratón, dedo y Apple Pencil.

Los tamaños son presets iniciales basados en el inventario actual y las relaciones de aspecto comunes. Son una propuesta de trabajo, no un formato canónico obligatorio.

## Inventario y fidelidad

La biblioteca reconoce Mando y Señor Mandarino como una sola identidad con alias y variantes disponibles. Los recortes transparentes existentes se pueden colocar sin fondo. Los stickers existentes conservan su arte original. Las láminas con el mueble azul se muestran como referencias no insertables: quitar personas y globos exige un original por capas o una restauración manual revisada por Mauricio. La importación de dibujos permite incorporar arte propio; el editor no inventa variantes de personajes.

## Archivo e integración con IA

`.man` ya es una extensión conocida para fuentes de páginas de manual Unix/groff. Para evitar colisiones, el archivo nativo del editor usa `.mandarinita`; es un ZIP con `proyecto.json` y, al importar dibujos, sus datos de imagen. Ese JSON legible ofrece un formato de intercambio útil para ChatGPT, Codex, Claude y Gemini. Un siguiente paso puede definir un esquema versionado y un conjunto de operaciones/endpoint local o MCP para que los agentes editen borradores sin automatizar aprobación ni publicación.

## Guardado entre dispositivos

Para una persona, la arquitectura mínima futura es Cloudflare Access con código por correo para Mauricio, una Pages Function/Worker y R2 para los archivos fuente y revisiones. No hace falta una base relacional para guardar paquetes de proyecto; se puede empezar sin D1. El coste práctico es configurar la cuenta Access, el allowlist de correo, el bucket y la política de conflictos/versiones. R2 no debe exponerse como escritura pública y los secretos permanecen del lado del Worker.

Supabase aportaría autenticación, Postgres y Storage integrados y sería más sencillo si se requiere una aplicación multiplataforma o relaciones complejas, con el coste de operar otro proveedor y modelar políticas/tablas. Para el MVP de una sola persona sobre Pages, Cloudflare evita añadir una dependencia. No se crea almacenamiento de nube hasta conocer el correo exacto que debe autorizar Access.

## Próximos hitos

1. Validar la experiencia local en iPhone/iPad y escritorio; corregir interacción con lápiz, accesibilidad y persistencia.
2. Revisar el catálogo visual de episodios y personajes con Mauricio; identificar fuentes originales editables de poses, objetos y fondos. Las extracciones nuevas pasan a revisión antes de entrar a la biblioteca aprobada.
3. Definir sync de nube y recuperación/versiones cuando esté configurada la identidad Access.
4. Diseñar programación/publicación Meta solo después de verificar permisos oficiales de la cuenta. La exportación manual permanece disponible y ningún episodio se publica sin aprobación explícita.
