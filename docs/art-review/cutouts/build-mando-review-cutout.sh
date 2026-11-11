#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-014-un-dia-malo/14.1.png"
output_image="$repo_root/docs/art-review/cutouts/mando-episodio-14-1-borrador.png"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

# Flood-fill only the connected page background. The original episode image is untouched.
magick "$source_image" -alpha set -fuzz 10% -fill none -draw 'color 5,5 floodfill' "$tmpdir/flood.png"
magick "$tmpdir/flood.png" -alpha extract -strip "$tmpdir/flood-alpha.png"

# Remove enclosed speech lettering and scene shadows; retain the original character and bag.
magick -size 1080x1080 xc:white -fill black -draw \
  'polygon 590,300 680,300 680,452 590,452; rectangle 470,752 650,850; rectangle 780,315 810,395; rectangle 770,750 810,830; rectangle 390,795 493,850' \
  "$tmpdir/exclusions.png"
magick "$tmpdir/flood-alpha.png" "$tmpdir/exclusions.png" -compose Multiply -composite "$tmpdir/alpha.png"
magick "$tmpdir/alpha.png" -alpha copy "$tmpdir/opacity.png"
magick "$source_image" -alpha on "$tmpdir/opacity.png" -compose CopyOpacity -composite "$tmpdir/base.png"

# Restore the visible legs with a tight trace and redraw only the simple black soles,
# using the original black contour color and the unaltered source pixels above the ankles.
magick -size 1080x1080 xc:black -fill white -draw \
  "path 'M 532 736 L 548 736 L 548 772 C 548 777 545 780 541 783 L 532 783 C 530 778 531 761 532 736 Z' path 'M 584 739 L 594 739 L 595 772 C 595 776 597 779 600 782 L 585 783 C 583 778 583 761 584 739 Z' path 'M 404 731 C 410 729 415 731 422 737 L 430 741 L 471 740 C 480 740 484 745 486 752 L 489 779 C 490 782 486 785 482 787 C 477 789 473 790 468 791 L 412 791 C 404 790 400 786 400 779 L 397 752 C 396 743 399 735 404 731 Z'" \
  "$tmpdir/legs.png"
magick "$tmpdir/legs.png" -alpha copy "$tmpdir/legs-opacity.png"
magick "$source_image" -alpha on "$tmpdir/legs-opacity.png" -compose CopyOpacity -composite "$tmpdir/legs-original.png"
magick "$tmpdir/base.png" "$tmpdir/legs-original.png" -compose over -composite \
  -fill '#080706' -draw \
  "path 'M 530 782 C 536 784 545 783 549 784 C 553 787 558 788 560 792 C 561 796 557 799 551 800 L 528 799 C 522 798 520 795 522 791 C 524 787 527 785 530 782 Z' path 'M 579 782 C 585 783 593 783 598 784 C 602 787 608 788 611 792 C 613 796 609 799 603 800 L 584 799 C 578 798 575 795 577 791 C 578 787 580 784 579 782 Z'" \
  -crop 405x480+385+330 -trim +repage "$tmpdir/crop.png"

# The small bag sits against a similar-colored ground shadow. Remove only the
# scene-colored pixels in its lower crop, then tuck the transparency edge in 2 px.
magick "$tmpdir/crop.png" -region 120x84+0+380 -channel A \
  -fx 'if (r>0.55 && g>0.50 && b>0.30 && r-g>0.05, 0, a)' +channel "$tmpdir/bag-clean.png"
magick "$tmpdir/bag-clean.png" -region 120x84+0+380 -channel A \
  -morphology Erode Disk:2 +channel "$output_image"
