"""Make a source-pixel, review-only Morita cutout from published panel 59.4."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'assets/episodes/ep-059-no-juegues-asi/59.4.png'
OUTPUT = ROOT / 'assets/characters/review/morita-episode-59-4-review.png'
CROP = (740, 1250, 1450, 1780)
MARKER = (255, 0, 255)

source = Image.open(SOURCE).convert('RGBA')
crop = source.crop(CROP)
segmented = crop.convert('RGB').copy()
for seed in ((0, 0), (709, 0), (0, 529), (709, 529), (140, 0), (570, 0), (140, 529), (570, 529)):
    ImageDraw.floodfill(segmented, seed, MARKER, thresh=76)
removed = Image.new('L', crop.size)
pixels, mask = segmented.load(), removed.load()
for y in range(crop.height):
    for x in range(crop.width):
        if pixels[x, y] == MARKER:
            mask[x, y] = 255
alpha = ImageChops.subtract(crop.getchannel('A'), removed)
# Morita's figure uses charcoal, white and pink here; remove connected ochre
# flecks left from the episode floor while preserving those source colors.
rgb, alpha_pixels = crop.convert('RGB').load(), alpha.load()
for y in range(crop.height):
    for x in range(crop.width):
        red, green, blue = rgb[x, y]
        if red > 140 and green > 105 and blue < 190 and red > blue * 1.2 and green > blue * 1.05:
            alpha_pixels[x, y] = 0

# Keep only Morita's connected silhouette; adjacent dust and table marks stay out.
width, height = crop.size
mask = alpha.load()
seen = bytearray(width * height)
largest = []
for y in range(height):
    for x in range(width):
        start = y * width + x
        if seen[start] or mask[x, y] == 0:
            continue
        seen[start] = 1
        component = [start]
        for point in component:
            px, py = point % width, point // width
            for ny in range(max(0, py - 1), min(height, py + 2)):
                for nx in range(max(0, px - 1), min(width, px + 2)):
                    index = ny * width + nx
                    if not seen[index] and mask[nx, ny] > 0:
                        seen[index] = 1
                        component.append(index)
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
bbox = alpha.getbbox()
if not bbox:
    raise SystemExit('No foreground pixels remain')
l, t, r, b = bbox
pad = 12
crop = crop.crop((max(0, l-pad), max(0, t-pad), min(width, r+pad), min(height, b+pad)))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
crop.save(OUTPUT, optimize=True)
print(f'{OUTPUT.relative_to(ROOT)} {crop.width}x{crop.height}')
