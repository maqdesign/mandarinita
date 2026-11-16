#!/usr/bin/env python3
"""Isolate Mando's flattened pose from episode 87.2 for review only."""
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-087-eso-es-mental-decian-nada-facil-la-temperatura-en-la-cap/87.2.png"
OUTPUT = ROOT / "assets/characters/review/mando-episode-87-2-review.png"

# Keep the original flattened character and ground mark; leave out the panel caption.
im = Image.open(SOURCE).convert("RGBA").crop((130, 275, 625, 665))
pixels = np.asarray(im).copy()
rgb = pixels[:, :, :3].astype(np.int16)
h, w = rgb.shape[:2]
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
# A detached handwritten pointer sits above the character at this position.
pixels[:60, 140:215, 3] = 0
Image.fromarray(pixels, "RGBA").save(OUTPUT)
print(OUTPUT)
