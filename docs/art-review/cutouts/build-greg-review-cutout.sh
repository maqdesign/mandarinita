#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
source_image="$repo_root/assets/episodes/ep-014-un-dia-malo/14.1.png"
output_image="$repo_root/docs/art-review/cutouts/greg-episodio-14-1-borrador.png"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

magick "$source_image" -alpha set -fuzz 10% -fill none -draw 'color 5,5 floodfill' "$tmpdir/flood.png"
magick "$tmpdir/flood.png" -alpha extract -strip "$tmpdir/flood-alpha.png"
magick -size 1080x1080 xc:white -fill black -draw \
  'rectangle 775,232 1000,250; rectangle 775,232 810,260; rectangle 775,610 798,680; rectangle 800,755 950,850' \
  "$tmpdir/exclusions.png"
magick "$tmpdir/flood-alpha.png" "$tmpdir/exclusions.png" -compose Multiply -composite "$tmpdir/alpha.png"
magick "$tmpdir/alpha.png" -alpha copy "$tmpdir/opacity.png"
magick "$source_image" -alpha on "$tmpdir/opacity.png" -compose CopyOpacity -composite "$tmpdir/base.png"

# Restore the visible lower legs with a close mask so the ground shadow stays transparent.
magick -size 1080x1080 xc:black -fill white -draw \
  "path 'M 862 748 L 871 748 L 870 775 C 870 779 871 782 873 785 L 861 785 C 859 782 860 778 860 774 Z' path 'M 891 748 L 903 748 L 903 775 C 903 779 906 782 909 785 L 890 785 C 889 781 891 778 891 775 Z'" \
  "$tmpdir/legs.png"
magick "$tmpdir/legs.png" -alpha copy "$tmpdir/legs-opacity.png"
magick "$source_image" -alpha on "$tmpdir/legs-opacity.png" -compose CopyOpacity -composite "$tmpdir/legs-original.png"
magick "$tmpdir/base.png" "$tmpdir/legs-original.png" -compose over -composite \
  -fill '#100f0e' -draw \
  "path 'M 862 781 C 866 783 871 783 874 786 C 877 789 875 793 871 795 C 865 798 857 797 853 795 C 849 793 849 790 852 787 Z' path 'M 890 781 C 896 783 902 783 906 786 C 910 789 912 793 908 796 C 903 799 894 798 890 796 C 886 794 886 791 888 787 Z'" \
  -crop 220x565+775+245 -trim +repage "$tmpdir/crop.png"

# Remove only residual scene-tone pixels in the lower shadow area; preserve the carrot's orange.
magick "$tmpdir/crop.png" -region 180x100+0+450 -channel A \
  -fx 'if (r>0.55 && g>0.50 && b>0.30 && r-g>0.05, 0, a)' +channel "$tmpdir/clean.png"
magick "$tmpdir/clean.png" -channel A -morphology Erode Disk:1 \
  -fx 'if (i<6 && j>428 && j<445, 0, a)' +channel -trim +repage \
  -bordercolor none -border 2 "$output_image"
