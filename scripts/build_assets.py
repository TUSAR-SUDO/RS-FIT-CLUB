#!/usr/bin/env python
"""
RS FIT CLUB - asset pipeline.
Run from the project root:  python scripts/build_assets.py

Source masters (client supplied, never modified) live in ./FILES
Outputs go to ./src/assets/brand, ./src/assets/img, ./src/assets/tex and ./public

The script never stretches, re-colours or awkwardly crops the logo. The only
transform applied to LOGO.png is a luminance->alpha key of its pure-black
backdrop plus a trim to the ink bounding box, so the mark can sit on any dark
surface without showing a black plate.
"""
from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "FILES"
BRAND = ROOT / "src" / "assets" / "brand"
# The hero cutout lives in public/ with STABLE file names on purpose: the LCP
# preload in index.html has to point at exactly these URLs, which hashed asset
# names would make impossible. Everything else is imported through Vite.
IMG = ROOT / "public" / "media"
TEX = ROOT / "src" / "assets" / "tex"
PUBLIC = ROOT / "public"

for d in (BRAND, IMG, TEX, PUBLIC):
    d.mkdir(parents=True, exist_ok=True)

report: dict[str, object] = {}


def trim(im: Image.Image, pad: int = 0, threshold: int = 8) -> Image.Image:
    """Trim fully/low-alpha surroundings from an RGBA image."""
    alpha = np.asarray(im.getchannel("A"))
    mask = alpha > threshold
    if not mask.any():
        return im
    ys, xs = np.where(mask)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    box = (
        max(0, box[0] - pad),
        max(0, box[1] - pad),
        min(im.width, box[2] + pad),
        min(im.height, box[3] + pad),
    )
    return im.crop(box)


def save_set(im: Image.Image, stem: str, widths: list[int], outdir: pathlib.Path) -> list[dict]:
    rows = []
    for w in widths:
        h = max(1, round(im.height * w / im.width))
        rs = im.resize((w, h), Image.LANCZOS)
        for fmt, ext, kwargs in (
            ("AVIF", "avif", {"quality": 62, "speed": 4}),
            ("WEBP", "webp", {"quality": 86, "method": 6}),
        ):
            path = outdir / f"{stem}-{w}.{ext}"
            rs.save(path, fmt, **kwargs)
            rows.append({"file": path.name, "w": w, "h": h, "fmt": ext, "bytes": path.stat().st_size})
    return rows


# ---------------------------------------------------------------- logo -> alpha
logo = Image.open(SRC / "LOGO.png").convert("RGB")
arr = np.asarray(logo).astype(np.float32)
bright = arr.max(axis=2)
# pure-black backdrop -> transparent; anything bright stays fully opaque.
alpha = np.clip((bright - 10.0) / 26.0, 0.0, 1.0) * 255.0
logo_rgba = Image.fromarray(
    np.dstack([arr, alpha]).astype(np.uint8), "RGBA"
)
logo_rgba = trim(logo_rgba)
report["logo_master"] = {"w": logo_rgba.width, "h": logo_rgba.height}

logo_rgba.save(BRAND / "logo.png", optimize=True)
report["logo"] = save_set(logo_rgba, "logo", [320, 640, 960], BRAND)

# The "RS" lockup without the FIT CLUB wordmark band - used by the intro loader.
# Proportions are preserved; this is a crop of the supplied master, not a redraw.
mono = logo_rgba.crop((0, 0, logo_rgba.width, int(logo_rgba.height * 0.70)))
mono = trim(mono)
mono.save(BRAND / "logo-mark.png", optimize=True)
report["logo_mark"] = {"w": mono.width, "h": mono.height}
report["logo_mark_set"] = save_set(mono, "logo-mark", [320, 640], BRAND)

# --------------------------------------------------------------- owner cutout
owner = Image.open(SRC / "OWNER bg REMOVED.png").convert("RGBA")
oa = np.asarray(owner.getchannel("A")).copy()
oa[oa <= 6] = 0  # kill stray near-invisible matting pixels
owner = Image.fromarray(np.dstack([np.asarray(owner)[:, :, :3], oa]).astype(np.uint8), "RGBA")
owner = trim(owner, pad=2)
report["owner_master"] = {"w": owner.width, "h": owner.height}
report["owner"] = save_set(owner, "owner", [480, 800, 1200, 1600], IMG)

# ------------------------------------------------------------- trainer cutout
# The club's trainer, background removed by the club. Same treatment as the
# owner — kill the near-invisible matting pixels a cut-out tool leaves along a
# hard edge, then trim to the ink — because this figure is composited over the
# page's own background rather than sitting in a frame, where a faint halo
# would read as a grey outline. Used by the 3D parallax figure.
trainer = Image.open(SRC / "TRAINER IMAGE BG REMOVED.png").convert("RGBA")
ta = np.asarray(trainer.getchannel("A")).copy()
ta[ta <= 6] = 0
trainer = Image.fromarray(
    np.dstack([np.asarray(trainer)[:, :, :3], ta]).astype(np.uint8), "RGBA"
)
trainer = trim(trainer, pad=2)
report["trainer_master"] = {"w": trainer.width, "h": trainer.height}
report["trainer"] = save_set(trainer, "trainer", [480, 800, 1200], IMG)

# --------------------------------------------------------------- noise texture
rng = np.random.default_rng(20261010)
field = rng.integers(0, 256, size=(160, 160), dtype=np.int64)
# slight low-pass so the grain reads as film, not TV static
soft = (
    field
    + np.roll(field, 1, 0)
    + np.roll(field, -1, 0)
    + np.roll(field, 1, 1)
    + np.roll(field, -1, 1)
) / 5.0
alpha_noise = np.clip((soft - 110) * 1.9, 0, 255).astype(np.uint8)
noise = Image.fromarray(
    np.dstack(
        [
            np.full_like(alpha_noise, 255),
            np.full_like(alpha_noise, 255),
            np.full_like(alpha_noise, 255),
            alpha_noise,
        ]
    ),
    "RGBA",
)
noise.save(TEX / "noise.png", optimize=True)
report["noise"] = {"file": "noise.png", "bytes": (TEX / "noise.png").stat().st_size}

# ------------------------------------------- brand tile: logo on its own black
def brand_tile(size: int, inset: float) -> Image.Image:
    tile = Image.new("RGBA", (size, size), (5, 5, 6, 255))
    lw = int(size * inset)
    lh = max(1, round(lw * logo_rgba.height / logo_rgba.width))
    tile.alpha_composite(logo_rgba.resize((lw, lh), Image.LANCZOS), (int((size - lw) / 2), int((size - lh) / 2)))
    return tile


brand_tile(512, 0.86).save(PUBLIC / "icon-512.png", optimize=True)
brand_tile(192, 0.86).save(PUBLIC / "icon-192.png", optimize=True)
brand_tile(180, 0.84).save(PUBLIC / "apple-touch-icon.png", optimize=True)
brand_tile(32, 0.84).save(PUBLIC / "favicon-32.png", optimize=True)
brand_tile(48, 0.84).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# ------------------------------------------------------------------- og card
og = Image.new("RGBA", (1200, 630), (5, 5, 6, 255))
glow = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
garr = np.asarray(glow).copy()
yy, xx = np.mgrid[0:630, 0:1200]
d = np.sqrt(((xx - 900) / 700.0) ** 2 + ((yy - 430) / 420.0) ** 2)
garr[:, :, 0] = 252
garr[:, :, 1] = 2
garr[:, :, 2] = 115
garr[:, :, 3] = np.clip(90 * np.exp(-d * d * 1.6), 0, 255).astype(np.uint8)
og = Image.alpha_composite(og, Image.fromarray(garr, "RGBA"))
owl = 720
olh = round(owl * logo_rgba.height / logo_rgba.width)
og.alpha_composite(logo_rgba.resize((owl, olh), Image.LANCZOS), (120, int((630 - olh) / 2)))
og.convert("RGB").save(PUBLIC / "og-cover.png", optimize=True)

(ROOT / "scripts" / "asset-report.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
