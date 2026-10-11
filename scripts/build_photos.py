#!/usr/bin/env python
"""
RS FIT CLUB - photograph pipeline.

Run from the project root:  python scripts/build_photos.py   (or: npm run photos)

Masters live in ./FILES/photos and are the ONLY thing you replace when the club
sends its own shots: drop a file in with the same name, run this script, and the
site picks it up. Nothing else needs editing — this script rewrites
src/data/photos.ts, which is what every component imports.

What it does per photo:
  · crops to the aspect ratio that slot actually uses (anchored, never stretched)
  · resizes to the widths the srcset needs
  · encodes AVIF (q62) and WebP (q86), which is what the <picture> serves
Anything wider than the master is skipped, so nobody upscales a small photo into
a blurry one.

This file is generated output: src/data/photos.ts. Do not hand-edit that file.
"""
from __future__ import annotations

import json
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "FILES" / "photos"
OUT = ROOT / "src" / "assets" / "img"
TS = ROOT / "src" / "data" / "photos.ts"

# ratio = width / height of the slot.
# ax / ay = where the crop window sits inside the leftover space, 0 = start, 1 = end.
# zoom    = fraction of the master to keep before cropping (1.0 = the whole frame).
#           Use it to tighten a portrait, never to enlarge past the master's own
#           resolution: the output ladder is capped by the zoomed size below.
# widths  = the srcset ladder; `sizes` in the component decides what is fetched.
PHOTOS: dict[str, dict] = {
    "floor-wide": {
        "ratio": 16 / 10,
        "ax": 0.5,
        "ay": 0.5,
        "widths": [640, 960, 1280, 1600],
        "alt": "Weights and machines on a dimly lit gym floor",
        "credit": "Pexels 29224211",
    },
    "transform-before": {
        "ratio": 4 / 3,
        "ax": 0.5,
        "ay": 0.15,
        "widths": [560, 800, 1120],
        "alt": "Member at the start of their training block",
        "credit": "Pexels 27669753",
    },
    "transform-after": {
        "ratio": 4 / 3,
        "ax": 0.5,
        "ay": 0.12,
        "widths": [560, 800, 1120],
        "alt": "Member after their training block",
        "credit": "Pexels 14898406",
    },
    "team-strength": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.0,
        "widths": [320, 480, 640, 800],
        "alt": "Strength and conditioning coach",
        "credit": "Pexels 17706046",
    },
    "team-weights": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.2,
        "widths": [320, 480, 640, 800],
        "alt": "Weight training coach",
        "credit": "Pexels 36510739",
    },
    "team-class": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.15,
        "widths": [320, 480, 640, 800],
        "alt": "Zumba and aerobics instructor",
        "credit": "Pexels 9943222",
    },
    "team-nutrition": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.0,
        "widths": [320, 480, 640, 800],
        "alt": "Nutritionist planning a diet",
        "credit": "Pexels 16216729",
    },
    # ------------------------------------------------------------------ cards
    # Backgrounds for the eight programme cards (home rail + /programs grid).
    # Portrait 4:5, because that is the card's own shape and the crop has to
    # survive a full-bleed cover on both of them.
    "program-weight-training": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.35,
        "widths": [440, 660, 880],
        "alt": "Dumbbell curl in the free-weights area",
        "credit": "Pexels 35649992",
    },
    "program-strength-training": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.45,
        "widths": [440, 660, 880],
        "alt": "Back squat under a loaded barbell",
        "credit": "Pexels 29259728",
    },
    "program-cardio": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.4,
        "widths": [440, 660, 880],
        "alt": "Treadmill session on the cardio line",
        "credit": "Pexels 4944975",
    },
    "program-zumba": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.5,
        "widths": [440, 660, 880],
        "alt": "Dance fitness class mid-routine",
        "credit": "Pexels 8957662",
    },
    "program-aerobics": {
        "ratio": 4 / 5,
        "ax": 0.45,
        "ay": 0.5,
        "widths": [440, 660, 880],
        "alt": "Group aerobics class following the instructor",
        "credit": "Pexels 6339345",
    },
    "program-personal-training": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.45,
        "widths": [440, 660, 880],
        "alt": "Coach counting reps for one client",
        "credit": "Pexels 37963581",
    },
    "program-diet-planning": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.35,
        "widths": [440, 660, 880],
        "alt": "Plate of home food with nuts, fruit and grains",
        "credit": "Pexels 5966434",
    },
    "program-exercise-card": {
        "ratio": 4 / 5,
        "ax": 0.5,
        "ay": 0.5,
        "widths": [440, 660, 880],
        "alt": "Exercise card on the bench beside a dumbbell",
        "credit": "Pexels 8154264",
    },
    # ------------------------------------------------------- bento tile images
    # The two wide cells in the "Why this floor" bento are roughly 2.1:1.
    "bento-one-to-one": {
        "ratio": 2.1,
        "ax": 0.5,
        "ay": 0.45,
        "widths": [560, 840, 1120],
        "alt": "Coach teaching a member the barbell setup",
        "credit": "Pexels 39219656",
    },
    "bento-class": {
        "ratio": 2.1,
        "ax": 0.5,
        "ay": 0.5,
        "widths": [560, 840, 1120],
        "alt": "Group class working through a floor routine",
        "credit": "Pexels 6740297",
    },
}


def crop_to_ratio(im: Image.Image, ratio: float, ax: float, ay: float) -> Image.Image:
    """Crop (never stretch) to `ratio`, anchoring inside the leftover space."""
    w, h = im.size
    if w / h > ratio:  # too wide -> trim the sides
        new_w = max(1, round(h * ratio))
        x0 = round((w - new_w) * min(max(ax, 0.0), 1.0))
        return im.crop((x0, 0, x0 + new_w, h))
    new_h = max(1, round(w / ratio))  # too tall -> trim top/bottom
    y0 = round((h - new_h) * min(max(ay, 0.0), 1.0))
    return im.crop((0, y0, w, y0 + new_h))


OUT.mkdir(parents=True, exist_ok=True)

report: dict[str, object] = {"photos": []}
ts_imports: list[str] = []
ts_entries: list[str] = []

for slug, cfg in PHOTOS.items():
    master = SRC / f"{slug}.jpg"
    if not master.exists():
        raise SystemExit(
            f"missing master: {master}\n"
            f"Put the club's photo at that exact path (any JPEG) and re-run."
        )

    im = Image.open(master).convert("RGB")
    zoom = float(cfg.get("zoom", 1.0))
    if zoom < 1.0:
        zw = max(1, round(im.width * zoom))
        zh = max(1, round(im.height * zoom))
        x0 = round((im.width - zw) * float(cfg.get("ax", 0.5)))
        y0 = round((im.height - zh) * float(cfg.get("ay", 0.5)))
        im = im.crop((x0, y0, x0 + zw, y0 + zh))
        ax = ay = 0.5
    else:
        ax, ay = float(cfg.get("ax", 0.5)), float(cfg.get("ay", 0.5))
    im = crop_to_ratio(im, cfg["ratio"], ax, ay)

    widths = [w for w in cfg["widths"] if w <= im.width]
    if not widths:
        widths = [im.width]

    avif_imports: list[str] = []
    webp_imports: list[str] = []
    avif_set: list[str] = []
    webp_set: list[str] = []
    largest = None

    for w in widths:
        h = max(1, round(im.height * w / im.width))
        rs = im.resize((w, h), Image.LANCZOS)
        for ext, fmt, kwargs, bucket, entries in (
            ("avif", "AVIF", {"quality": 62, "speed": 4}, avif_imports, avif_set),
            ("webp", "WEBP", {"quality": 86, "method": 6}, webp_imports, webp_set),
        ):
            path = OUT / f"{slug}-{w}.{ext}"
            rs.save(path, fmt, **kwargs)
            var = f"{slug.replace('-', '_')}_{ext}_{w}"
            bucket.append(f"import {var} from '../assets/img/{path.name}';")
            entries.append(f"`${{{var}}} {w}w`")
        largest = (w, h)
        report["photos"].append({"file": f"{slug}-{w}", "w": w, "h": h})

    ts_imports += avif_imports + webp_imports
    ts_entries.append(
        f"""  '{slug}': {{
    alt: {json.dumps(cfg['alt'])},
    credit: {json.dumps(cfg['credit'])},
    width: {largest[0]},
    height: {largest[1]},
    src: {f"{slug.replace('-', '_')}_webp_{widths[-1]}"},
    avif: [{', '.join(avif_set)}].join(', '),
    webp: [{', '.join(webp_set)}].join(', '),
  }},"""
    )

header = """/* ---------------------------------------------------------------------------
   PHOTOGRAPHS — GENERATED FILE, do not edit by hand.

   Regenerate with:  npm run photos      (or: python scripts/build_photos.py)

   Masters live in FILES/photos/<slug>.jpg. Replacing the club's own shoot is a
   three-step job: drop the new file in with the same name, run the script, and
   the new AVIF/WebP ladder is written here and picked up by every component.

   What is here now is licensed placeholder photography (see IMAGE_CREDITS.md) so
   the page can be reviewed as a finished design. Every entry carries the alt
   text and credit line it was built with, and sections that show people mark
   themselves as samples in the UI.
   --------------------------------------------------------------------------- */

export interface Photo {
  alt: string;
  credit: string;
  /** Intrinsic size of the largest derivative — keeps CLS at zero. */
  width: number;
  height: number;
  /** Largest WebP, used as the plain <img> src fallback. */
  src: string;
  avif: string;
  webp: string;
}

"""

declaration = "export const PHOTOS: Record<string, Photo> = {\n"

TS.write_text(
    header + "\n".join(ts_imports) + "\n\n" + declaration + "\n".join(ts_entries) + "};\n",
    encoding="utf-8",
)

(ROOT / "scripts" / "photo-report.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
print(f"\nwrote {TS.relative_to(ROOT)} with {len(PHOTOS)} photos")
