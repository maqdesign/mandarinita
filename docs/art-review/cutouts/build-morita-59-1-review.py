"""Make a review-only, source-pixel cutout of Morita from published panel 59.1.
No lines, colors, or hidden anatomy are generated or reconstructed.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'assets/episodes/ep-059-no-juegues-asi/59.1.png'
OUTPUT = ROOT / 'assets/characters/review/morita-episode-59-1-review.png'
CROP = (1380, 1020, 1940, 1790)
MARKER = (255, 0, 255)

source = Image.open(SOURCE).convert('RGBA')
crop = source.crop(CROP)
segmented = crop.convert('RGB').copy()
for seed in ((559, 0), (559, 769), (280, 0), (0, 520), (559, 520), (300, 270), (215, 665), (280, 680), (345, 670), (455, 665), (180, 655), (420, 655)):
    ImageDraw.floodfill(segmented, seed, MARKER, thresh=88)
removed = Image.new('L', crop.size)
source_pixels = segmented.load()
removed_pixels = removed.load()
for y in range(crop.height):
    for x in range(crop.width):
        if source_pixels[x, y] == MARKER:
            removed_pixels[x, y] = 255
alpha = ImageChops.subtract(crop.getchannel('A'), removed)
# Exclude the adjacent white chair at top left and floor texture outside the feet.
for y in range(160):
    for x in range(125):
        alpha.putpixel((x, y), 0)
for y in range(690, crop.height):
    for x in range(crop.width):
        alpha.putpixel((x, y), 0)
for y in range(600, crop.height):
    for x in range(215):
        alpha.putpixel((x, y), 0)
    for x in range(290, 350):
        alpha.putpixel((x, y), 0)
    for x in range(430, crop.width):
        alpha.putpixel((x, y), 0)
# Keep only Morita's largest connected silhouette. This removes the separate
# neighboring chair edge and disconnected floor specks without painting pixels.
width, height = crop.size
mask = alpha.load()
seen = bytearray(width * height)
largest = []
for start_y in range(height):
    for start_x in range(width):
        start = start_y * width + start_x
        if seen[start] or mask[start_x, start_y] == 0:
            continue
        seen[start] = 1
        component = [start]
        for point in component:
            x, y = point % width, point // width
            for ny in range(max(0, y - 1), min(height, y + 2)):
                for nx in range(max(0, x - 1), min(width, x + 2)):
                    adjacent = ny * width + nx
                    if not seen[adjacent] and mask[nx, ny] > 0:
                        seen[adjacent] = 1
                        component.append(adjacent)
        if len(component) > len(largest):
            largest = component
keep = bytearray(width * height)
for point in largest:
    keep[point] = 1
for y in range(height):
    for x in range(width):
        if not keep[y * width + x]:
            mask[x, y] = 0
crop.putalpha(alpha)
bbox = crop.getbbox()
if bbox is None:
    raise SystemExit('No foreground pixels remain')
l, t, r, b = bbox
pad = 12
crop = crop.crop((max(0, l-pad), max(0, t-pad), min(crop.width, r+pad), min(crop.height, b+pad)))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
crop.save(OUTPUT, optimize=True)
print(f'{OUTPUT.relative_to(ROOT)} {crop.width}x{crop.height}')
