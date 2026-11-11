#!/usr/bin/env python3
"""Isolate the original Mando pose from episode 87.1 for review only."""
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-087-eso-es-mental-decian-nada-facil-la-temperatura-en-la-cap/87.1.png"
OUTPUT = ROOT / "assets/characters/review/mando-episode-87-1-review.png"

# Crop around the whole painted pose; the handwritten caption and page frame stay out.
im = Image.open(SOURCE).convert("RGBA").crop((205, 105, 670, 660))
pixels = np.asarray(im).copy()
rgb = pixels[:, :, :3].astype(np.int16)
h, w = rgb.shape[:2]
# Remove only pale background connected to the crop edges. Enclosed eye/face highlights stay.
background = (rgb.min(axis=2) > 210) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 34)
seen = np.zeros((h, w), dtype=bool)
queue = deque()
for x in range(w):
    for y in (0, h - 1):
        if background[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if background[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append((y, x))
while queue:
    y, x = queue.popleft()
    for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
        if 0 <= ny < h and 0 <= nx < w and background[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True
            queue.append((ny, nx))
pixels[seen, 3] = 0
# The crop grazes a handwritten caption in its upper-left corner; the pose begins below it.
pixels[:110, :70, 3] = 0
pixels[110:160, :28, 3] = 0
Image.fromarray(pixels, "RGBA").save(OUTPUT)
print(OUTPUT)
