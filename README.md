# Mandarinita® Website 2026

Responsive bilingual portfolio and archive built as static HTML, CSS, and JavaScript for Cloudflare Pages.

## Identity and content

- The original ONAPI logo SVG is stored at `assets/mandarinita-logo.svg`. Its paths, viewBox, intrinsic 405 × 151 dimensions, lettering, and source colors are preserved.
- Gallery art, character expressions, and the character sheet come from the supplied original source files. The large coffee comic is lossily recompressed at high quality for faster delivery; the original is retained among the supplied project files. Visible signatures and embedded credits remain in the web asset.
- Archive cards use descriptive display titles. They are not episode numbers or official published titles.
- The four-panel reader is explicitly labeled as an unpublished storyboard process item. It uses crops of the supplied original storyboard, without redrawing or editing character features.
- The site does not invent replacement character art. The former CSS-drawn fruit and unsupported cast biographies were removed.
- UI tokens remain separate from logo colors. In particular, the logo's `#607D3B` is not rewritten to the UI green `#607D38`.

## Source-file map

| Site asset | Supplied source |
| --- | --- |
| `mandarinita-logo.svg` | Tipo=Imagotipo, Ejecución=A, Estilo=Normal (1).svg |
| `comic-rage-2019.webp` | Capítulo_1_D.webp |
| `comic-focus-2019.webp` | Capítulo_1_B.webp |
| `comic-coffee-2019.webp` | w=3840,quality=90,fit=scale-down.webp |
| `art-envelope-2022.webp` | w=1920,quality=90,fit=scale-down.webp |
| `art-paperclip-2022.webp` | Slice_3.webp |
| `storyboard-rough-2019.webp` | 6149DF67-3225-4F00-AA9D-6749B139097A.webp |
| `character-sheet-original.jpg` | 10C58EFF-4C8C-4C5C-BBC7-973C22F55109(1).jpeg |
| `instagram-proof-2020.jpg` | IMG_5717(1).jpeg |

## Local preview

Open `index.html` directly or serve the repository root using any static file server. No build step is required. The configured Cloudflare Pages project builds from the repository root with no build command.

## Current review scope

See `design-system/IMPLEMENTATION-REVIEW.md` for the Figma comparison, artwork inventory, accessibility and responsive review notes. `design-system/HISTORICAL-AUDIT.md` records research limits and historical source evidence.
