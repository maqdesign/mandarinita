"""Make a review-only, source-pixel cutout of Morita from published panel 59.2."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'assets/episodes/ep-059-no-juegues-asi/59.2.png'
OUTPUT = ROOT / 'assets/characters/review/morita-episode-59-2-review.png'
CROP = (20, 1160, 545, 1870)
MARKER = (255, 0, 255)
source = Image.open(SOURCE).convert('RGBA')
crop = source.crop(CROP)
segmented = crop.convert('RGB').copy()
for seed in ((0, 0), (0, 709), (180, 0), (180, 709), (50, 655), (420, 655), (240, 650)):
    ImageDraw.floodfill(segmented, seed, MARKER, thresh=66)
removed = Image.new('L', crop.size)
pixels = segmented.load(); mask = removed.load()
for y in range(crop.height):
    for x in range(crop.width):
        if pixels[x, y] == MARKER: mask[x, y] = 255
alpha = ImageChops.subtract(crop.getchannel('A'), removed)
# The adjacent chair edge enters the crop at upper right; keep it out of Morita's silhouette.
for y in range(230):
    for x in range(420, crop.width): alpha.putpixel((x,y), 0)
# Remove disconnected floor texture outside the two visible feet.
for y in range(645, crop.height):
    for x in range(crop.width): alpha.putpixel((x,y), 0)
for y in range(600, 645):
    for x in list(range(0, 115)) + list(range(205, 235)) + list(range(335, crop.width)):
        alpha.putpixel((x,y), 0)
crop.putalpha(alpha)
bbox=crop.getbbox()
if not bbox: raise SystemExit('No foreground pixels remain')
l,t,r,b=bbox; pad=12
crop=crop.crop((max(0,l-pad),max(0,t-pad),min(crop.width,r+pad),min(crop.height,b+pad)))
OUTPUT.parent.mkdir(parents=True,exist_ok=True); crop.save(OUTPUT,optimize=True)
print(f'{OUTPUT.relative_to(ROOT)} {crop.width}x{crop.height}')
