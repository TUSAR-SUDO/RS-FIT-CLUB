/* ---------------------------------------------------------------------------
   MEDIA
   The founder cutout is served from /media with stable file names so the LCP
   preload in index.html can point at exactly the right URL. The logo is
   imported through Vite so it gets a content hash.
   --------------------------------------------------------------------------- */

import logoAvif320 from '../assets/brand/logo-320.avif';
import logoAvif640 from '../assets/brand/logo-640.avif';
import logoAvif960 from '../assets/brand/logo-960.avif';
import logoWebp320 from '../assets/brand/logo-320.webp';
import logoWebp640 from '../assets/brand/logo-640.webp';
import logoWebp960 from '../assets/brand/logo-960.webp';
import markAvif320 from '../assets/brand/logo-mark-320.avif';
import markAvif640 from '../assets/brand/logo-mark-640.avif';
import markWebp320 from '../assets/brand/logo-mark-320.webp';
import markWebp640 from '../assets/brand/logo-mark-640.webp';

export const OWNER_WIDTHS = [480, 800, 1200, 1600] as const;

/** Source master is 1019×1520 after trimming the transparent matte. */
export const OWNER_RATIO = 1019 / 1520;

export const ownerSrcSet = (format: 'avif' | 'webp'): string =>
  OWNER_WIDTHS.map((w) => `/media/owner-${w}.${format} ${w}w`).join(', ');

/* The trainer's cut-out. Same deal as the owner: stable /media names, a
   trimmed transparent master, and the ratio recorded here so the figure can
   reserve its box before the file arrives. 1162×1306 is what
   scripts/build_assets.py reports after the matte is trimmed. */
export const TRAINER_WIDTHS = [480, 800, 1200] as const;

export const TRAINER_RATIO = 1162 / 1306;

export const trainerSrcSet = (format: 'avif' | 'webp'): string =>
  TRAINER_WIDTHS.map((w) => `/media/trainer-${w}.${format} ${w}w`).join(', ');

export const LOGO = {
  avif: {
    srcSet: `${logoAvif320} 320w, ${logoAvif640} 640w, ${logoAvif960} 960w`,
    src: logoAvif640,
  },
  webp: {
    srcSet: `${logoWebp320} 320w, ${logoWebp640} 640w, ${logoWebp960} 960w`,
    src: logoWebp640,
  },
  /** Intrinsic size of the trimmed master — keeps CLS at zero. */
  ratio: 1295 / 760,
} as const;

/** The "RS" lockup without the FIT CLUB wordmark, for the intro loader. */
export const LOGO_MARK = {
  avif: { srcSet: `${markAvif320} 320w, ${markAvif640} 640w`, src: markAvif640 },
  webp: { srcSet: `${markWebp320} 320w, ${markWebp640} 640w`, src: markWebp640 },
  ratio: 1264 / 532,
} as const;
