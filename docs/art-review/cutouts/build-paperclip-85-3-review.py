#!/usr/bin/env python3
"""Extract the personified paperclip from episode 85.3 as an object review draft."""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-085-lo-que-siempre-te-pasa/85.3.png"
OUTPUT = ROOT / "assets/objects/review/paperclip-episode-85-3-review.png"

# Crop excludes the question mark above the clip and keeps the full arms and feet.
im = Image.open(SOURCE).convert("RGBA").crop((92, 285, 296, 645))
pixels = np.asarray(im).copy()
rgb = pixels[:, :, :3].astype(np.int16)
h, w = rgb.shape[:2]
# This older clip is drawn mostly in gray ink. Luminance masking preserves the original
# lines and shading while removing the colored sky and pale page without painting new art.
luminance = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
pixels[:, :, 3] = np.minimum(pixels[:, :, 3], np.clip((195 - luminance) * 5, 0, 255).astype(np.uint8))
Image.fromarray(pixels, "RGBA").save(OUTPUT)
print(OUTPUT)
