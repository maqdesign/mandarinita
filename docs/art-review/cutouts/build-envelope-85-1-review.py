#!/usr/bin/env python3
"""Extract the personified envelope from episode 85.1 for review only."""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-085-lo-que-siempre-te-pasa/85.1.png"
OUTPUT = ROOT / "assets/objects/review/envelope-episode-85-1-review.png"

# Hue and luminance retain the cream paper, colored details, and dark ink while
# removing the painted cyan sky and pale page. No outlines or anatomy are redrawn.
im = Image.open(SOURCE).convert("RGBA").crop((440, 315, 725, 500))
pixels = np.asarray(im).copy()
rgb = pixels[:, :, :3].astype(np.float32)
hsv = np.asarray(Image.fromarray(pixels[:, :, :3], "RGB").convert("HSV"))
hue, saturation = hsv[:, :, 0], hsv[:, :, 1]
luminance = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
keep = ((saturation > 32) & ((hue < 48) | (hue > 245))) | (luminance < 145)
pixels[:, :, 3] = np.minimum(pixels[:, :, 3], np.where(keep, 255, 0).astype(np.uint8))
Image.fromarray(pixels, "RGBA").save(OUTPUT)
print(OUTPUT)
