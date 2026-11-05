#!/usr/bin/env python3
"""Create branded WebP derivatives for episode panels and transparent portraits.

Original artwork stays in its existing source path. The catalog and the two
character pages are updated to use the watermarked copies served to visitors.
Requires Pillow (python -m pip install Pillow).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "episodes.json"
LOGO = Image.open(ROOT / "assets/mandarinita-smile.png").convert("RGBA")
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    try:
        return ImageFont.truetype(path, size=max(8, size))
    except OSError:
        return ImageFont.load_default()


def mark(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    width, height = image.size
    main_font = font(round(width * 0.014), True)
    detail_font = font(round(width * 0.0105), False)
    main = "Mandarinita®"
    detail = "© Mauricio Quezada y Yosdina García · mandarinita.art"
    main_box = main_font.getbbox(main)
    detail_box = detail_font.getbbox(detail)
    main_w, main_h = main_box[2] - main_box[0], main_box[3] - main_box[1]
    detail_w, detail_h = detail_box[2] - detail_box[0], detail_box[3] - detail_box[1]
    icon_h = max(main_h + detail_h, round(width * 0.026))
    icon_w = icon_h
    padding_x = max(7, round(width * 0.012))
    padding_y = max(4, round(width * 0.006))
    gap = max(5, round(width * 0.008))
    box_w = padding_x * 2 + icon_w + gap + max(main_w, detail_w)
    box_h = padding_y * 2 + main_h + detail_h + max(1, round(width * 0.002))
    # Keep the logo and rights line out of the bottom-center reading indicator.
    x = max(round(width * 0.035), 6)
    y = min(height - box_h - max(6, round(height * 0.035)), round(height * 0.86))
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((x, y, x + box_w, y + box_h), radius=box_h // 3,
                           fill=(36, 29, 24, 75), outline=(255, 255, 255, 78), width=max(1, round(width * 0.0007)))
    icon = LOGO.copy()
    icon.thumbnail((icon_w, icon_h), Image.Resampling.LANCZOS)
    icon_x = x + padding_x
    icon_y = y + (box_h - icon.height) // 2
    layer.alpha_composite(icon, (icon_x, icon_y))
    text_x = icon_x + icon_w + gap
    text_y = y + padding_y - main_box[1]
    draw.text((text_x, text_y), main, font=main_font, fill=(255, 255, 255, 220))
    draw.text((text_x, text_y + main_h + 1), detail, font=detail_font, fill=(255, 255, 255, 210))
    return Image.alpha_composite(image, layer)


def save_webp(source: Path, destination: Path, *, thumb: bool = False, transparent: bool = False) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(source).convert("RGBA" if transparent else "RGB")
    if thumb:
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
    image = mark(image)
    image.save(destination, "WEBP", quality=91 if transparent else (86 if thumb else 90),
               method=5, lossless=transparent)


catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
episode_images = 0
for episode in catalog["episodes"]:
    for panel in episode.get("panels", []):
        source = ROOT / panel.get("sourceSrc", panel["src"])
        folder = Path("assets/watermarked/episodes") / episode["id"]
        stem = source.stem
        full_rel = folder / f"{stem}.webp"
        thumb_rel = folder / f"thumb-{stem}.webp"
        save_webp(source, ROOT / full_rel)
        save_webp(source, ROOT / thumb_rel, thumb=True)
        panel["sourceSrc"] = panel.get("sourceSrc", panel["src"])
        panel["watermarkedSrc"] = full_rel.as_posix()
        panel["watermarkedThumbnailSrc"] = thumb_rel.as_posix()
        episode_images += 1

# Character portraits are linked from both the cast page and the home teaser.
portrait_images = 0
character_pattern = re.compile(r'(src=")(assets/characters/[^"?]+)(?:\?[^"]*)?(\")')
for page_name in ("personajes.html", "index.html"):
    page = ROOT / page_name
    text = page.read_text(encoding="utf-8")
    replacements: dict[str, str] = {}

    def replace_character(match: re.Match[str]) -> str:
        original = match.group(2)
        source = ROOT / original
        destination = Path("assets/watermarked/characters") / f"{source.stem}.webp"
        if original not in replacements:
            save_webp(source, ROOT / destination, transparent=True)
            replacements[original] = destination.as_posix()
        return f'{match.group(1)}{replacements[original]}{match.group(3)}'

    revised, count = character_pattern.subn(replace_character, text)
    if revised != text:
        page.write_text(revised, encoding="utf-8")
        portrait_images += len(replacements)

CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Created watermarked files for {episode_images} episode panels ({episode_images * 2} full/thumb images) and {portrait_images} character portraits.")
