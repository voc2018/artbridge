"""Build only public assets for Cloudflare Pages (Python standard library only)."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist'
if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir()
for name in ('index.html', 'styles.css', 'script.js', 'i18n.js', 'matching.js', 'artworks.js'):
    shutil.copy2(ROOT / name, OUTPUT / name)
for name in ('assets', 'legacy'):
    shutil.copytree(ROOT / name, OUTPUT / name)
for name in ('data/sample-artists.csv', 'docs/MATCHING-RESEARCH.md'):
    target = OUTPUT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / name, target)
# Avoid Pages' default SPA fallback for absent backend routes.
(OUTPUT / '404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Not found</title><h1>404 — Not found</h1><a href="/">ArtBridge</a></html>\n', encoding='utf-8')
print('Built public static site in dist/')
