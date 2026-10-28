# Website 2026 implementation review

**Review target:** Figma frames `01 · Website Desktop · 1440` (node `2:2`) and `02 · Website Mobile · 390` (node `2:35`); implementation in this branch.

## Visual comparison

| Figma reference | Website implementation | Review |
|---|---|---|
| 96 px white navigation, logo reservation, four links | Sticky 96 px desktop header, original ONAPI SVG, archive/characters/portfolio/about links and language switch | Logo uses its original 405:151 aspect ratio and source colors. Navigation reflows to a compact 72 px mobile header. Figma design-system search returned no published variables or Work Sans text styles for this file. |
| 705 px orange hero, bold two-line headline, CTA and a reserved 472 × 510 art area | Orange hero, matching headline hierarchy, dark CTA and the supplied official Mandarinita smile artwork | Replaces Figma's explicit artwork placeholder with an authentic supplied illustration. No artwork is recreated. |
| Three archive cards with large image slots | Five source-backed artwork cards in a three-column desktop / one-column mobile grid | Uses dated, signed source images. Descriptive titles are identified as gallery labels, not asserted as original titles. |
| Artist story and an artwork reservation | English biography, creative statement, five-item artwork record, and sourced project history | The award note is attributed to the historical project site. Missing exhibition and medium data are not inferred. |
| 390 px mobile frame with single-column comic cards | Responsive single-column cards, collapsible navigation, accessible full-screen reader | Reader controls include buttons, keyboard focus, Escape-to-close, panel count, alt text, and reduced-motion support. |

## Art and provenance

The five gallery images contain visible marks dated 2019 or 2022. The large 2019 coffee comic is high-quality WebP recompressed from the supplied 2000 × 2000 source for delivery; no content, dialogue, or character design was changed. Credits inside the supplied comic artwork name Mauricio Quezada and Yosdina García; 2022 images carry Mandarinita / Maqdesign marks. The original 2020 Instagram screenshot is retained as source context but not presented as a comic asset. The source has no verified official titles for each file, so display titles are descriptive. No full episode sequence has been reconstructed from incomplete sources.

A separate four-panel reader uses panels cropped from `storyboard-rough-2019.webp`. Its label says this is process material and not a published episode. The original complete storyboard is retained alongside the crops.

## Visual and interaction checklist

- [x] Preserve logo SVG paths, source colors, viewBox, dimensions, and lettering.
- [x] Use supplied character illustrations and remove CSS-drawn fruit and unsupported invented cast descriptions.
- [x] Keep Spanish and English interface copy, `lang` switching, and direct English portfolio content.
- [x] Use semantic landmarks, skip link, accessible names, visible focus, responsive layout, dialog semantics, alt text, and reduced-motion handling.
- [x] Do not touch domain records, the historical Fruition Worker, or `main`.
- [ ] Capture and inspect the Cloudflare branch preview at desktop and mobile widths after deployment.
- [ ] Add final preview URLs and visual-review notes after the branch deployment is available.

## Remaining source gaps

The supplied attachments include only two authentic character-expression PNGs (one for Mandarinita and one for Sr. Mandarino) plus a character reference sheet. The rest of the named characters from the older implementation have no verified original artwork here and are omitted. Only a subset of historic comic/art files was supplied; there is no complete episode index, publication dates for every work, or complete panel sequences. The website does not claim otherwise.
