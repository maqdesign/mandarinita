# Componentes previstos · Sistema vivo
| Elemento | Variantes mínimas | Requisitos |
|---|---|---|
| Button | primary / secondary / subtle; hover / focus / disabled / loading | Contraste, foco visible, área táctil ≥44px |
| Link | inline / nav / external | Subrayado o identificación inequívoca, teclado |
| Card | episode / character / artwork / product | Proporciones de arte y créditos, no recortar diálogos |
| Episode reader | page / carousel / long-scroll | Teclado, alt, control de orden, progreso, mobile first |
| Media | image / video / animation | Respeto del original y `prefers-reduced-motion` |
| Header | desktop / compact mobile | Logo como recurso original, no tipográfico |
| Filters | characters / topics / archive / year | Estados accesibles y URL reproducible |
| Notice | info / warning / success | Estados semánticos, sin depender solo de color |

## Contrato para nuevas apps Mandarinita
- Compartir **tokens semánticos** con la web (no un CSS copiado a mano).
- Cada app puede añadir tokens de producto; no reescribir los de marca.
- Si hay tema claro/oscuro, conservar legibilidad del logo utilizando únicamente variantes oficiales documentadas.
- Versionar cambios y documentar migraciones; incluir pruebas visuales y de accesibilidad.
- Cada ilustración debe incluir origen, autor, licencia interna y versión del archivo.
