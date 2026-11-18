#!/usr/bin/env python3
"""Extract two clean, full-body poses from published episode 82 panels.

Only the connected near-white page field is made transparent. Source character
pixels, line work, shading, and contact shadows are retained. A small region
containing the detached speech-balloon tail above Greg is excluded by crop mask.
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]


def extract(source: str, output: str, crop: tuple[int, int, int, int], *,
            clear_greg_bubble_tail: bool = False) -> None:
    image = Image.open(ROOT / source).convert("RGBA").crop(crop)
    pixels = np.asarray(image).copy()
    rgb = pixels[:, :, :3].astype(np.int16)
    height, width = rgb.shape[:2]

    # Identify only neutral, near-white page paper, then remove the connected
    # region from the crop edge. Enclosed highlights inside the figure survive.
    paper = (rgb.min(axis=2) > 218) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 30)
    seen = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        for y in (0, height - 1):
            if paper[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((y, x))
    for y in range(height):
        for x in (0, width - 1):
            if paper[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((y, x))
    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width and paper[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                queue.append((ny, nx))
    pixels[seen, 3] = 0

    if clear_greg_bubble_tail:
        # Greg's flower and stem end to the left of this area; the detached
        # speech-balloon tail sits above and to their right in source panel 82.1.
        pixels[:95, 110:, 3] = 0

    destination = ROOT / output
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(pixels, "RGBA").save(destination, optimize=True)
    print(destination)


extract(
    "assets/episodes/ep-082-yo-como-que-te-he-visto/82.1.png",
    "assets/characters/greg-episodio-82-1.png",
    (135, 275, 370, 710),
    clear_greg_bubble_tail=True,
)
extract(
    "assets/episodes/ep-082-yo-como-que-te-he-visto/82.3.png",
    "assets/characters/mando-episodio-82-3.png",
    (390, 360, 660, 725),
)
