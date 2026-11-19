#!/usr/bin/env python3
"""Cut out the toilet and paper holder from episode 77.3 for review."""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-077-no-arrojar-papeles/77.3.jpg"
OUTPUT = ROOT / "assets/objects/review/toilet-episode-77-3-review.png"

# The pale porcelain and gray ink are kept; only pixels matching the cyan scene field are cleared.
im = Image.open(SOURCE).convert("RGBA").crop((1070, 1180, 1660, 1770))
pixels = np.asarray(im).copy()
hsv = np.asarray(Image.fromarray(pixels[:, :, :3], "RGB").convert("HSV"))
hue, saturation = hsv[:, :, 0], hsv[:, :, 1]
scene_cyan = (hue > 100) & (hue < 135) & (saturation > 45)
pixels[scene_cyan, 3] = 0
Image.fromarray(pixels, "RGBA").save(OUTPUT)
print(OUTPUT)
