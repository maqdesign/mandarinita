#!/usr/bin/env python3
"""Save a clean, character-free sky and cloud crop from episode 85.1."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/episodes/ep-085-lo-que-siempre-te-pasa/85.1.png"
OUTPUT = ROOT / "assets/backgrounds/review/sky-clouds-episode-85-1.png"
# This empty upper scene area contains only the published sky and cloud painting.
Image.open(SOURCE).crop((61, 62, 724, 232)).save(OUTPUT)
print(OUTPUT)
