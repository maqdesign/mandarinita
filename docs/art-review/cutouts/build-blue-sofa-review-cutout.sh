#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
output_image="$repo_root/docs/art-review/cutouts/sofa-azul-episodio-09-2-borrador.png"
tmp_svg="$(mktemp --suffix=.svg)"
tmpdir="$(mktemp -d)"
trap 'rm -f "$tmp_svg"; rm -rf "$tmpdir"' EXIT

# The sofa contours/palette are traced from episode 9.2 and checked against 9.1
# and 51.1. Hidden upholstery is reconstructed as flat color; this remains draft.
cat > "$tmp_svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="back" x1="0" y1="0" x2="0.08" y2="1">
      <stop offset="0" stop-color="#3c767d"/>
      <stop offset="1" stop-color="#376f77"/>
    </linearGradient>
  </defs>
  <g stroke="#4c4846" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
    <!-- Main upholstered body: organic side arms and front edge from ep. 9.2. -->
    <path fill="#67c4ce" d="M169 548 C124 545 82 555 58 583 C37 607 31 668 25 725 L16 821 Q14 838 31 840 C197 844 357 845 537 844 C713 845 879 844 1045 840 Q1061 839 1058 821 L1047 724 C1041 667 1034 607 1011 583 C986 555 944 545 900 548 C697 568 373 568 169 548 Z"/>

    <!-- Back cushion: its center is occluded in the episode; rebuilt from the visible ends. -->
    <path fill="url(#back)" d="M171 493 C340 480 729 481 894 494 Q906 496 903 512 L881 718 Q879 729 866 728 C659 719 409 719 184 728 Q170 728 168 715 L158 512 Q157 498 171 493 Z"/>

    <!-- Small irregular seam keeps the hand-drawn edge language of the source. -->
    <path fill="none" stroke="#2b7f87" stroke-width="5" d="M177 708 C362 700 672 700 874 709"/>

    <!-- Visible short wooden feet from the episode references. -->
    <path fill="#9b7153" stroke-width="6" d="M67 835 Q83 833 101 840 L98 900 Q96 909 85 907 L73 902 Q66 898 66 886 Z"/>
    <path fill="#9b7153" stroke-width="6" d="M974 840 Q991 834 1007 837 L1008 887 Q1007 901 995 905 L982 907 Q974 905 974 894 Z"/>
  </g>
</svg>
SVG

mkdir -p "$tmpdir/config" "$tmpdir/cache" "$tmpdir/data"
env XDG_CONFIG_HOME="$tmpdir/config" XDG_CACHE_HOME="$tmpdir/cache" \
  XDG_DATA_HOME="$tmpdir/data" inkscape "$tmp_svg" --export-area-drawing \
  --export-width=1080 --export-filename="$output_image"
