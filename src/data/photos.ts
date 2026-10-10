/* ---------------------------------------------------------------------------
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

import floor_wide_avif_640 from '../assets/img/floor-wide-640.avif';
import floor_wide_avif_960 from '../assets/img/floor-wide-960.avif';
import floor_wide_avif_1280 from '../assets/img/floor-wide-1280.avif';
import floor_wide_avif_1600 from '../assets/img/floor-wide-1600.avif';
import floor_wide_webp_640 from '../assets/img/floor-wide-640.webp';
import floor_wide_webp_960 from '../assets/img/floor-wide-960.webp';
import floor_wide_webp_1280 from '../assets/img/floor-wide-1280.webp';
import floor_wide_webp_1600 from '../assets/img/floor-wide-1600.webp';
import transform_before_avif_560 from '../assets/img/transform-before-560.avif';
import transform_before_avif_800 from '../assets/img/transform-before-800.avif';
import transform_before_avif_1120 from '../assets/img/transform-before-1120.avif';
import transform_before_webp_560 from '../assets/img/transform-before-560.webp';
import transform_before_webp_800 from '../assets/img/transform-before-800.webp';
import transform_before_webp_1120 from '../assets/img/transform-before-1120.webp';
import transform_after_avif_560 from '../assets/img/transform-after-560.avif';
import transform_after_avif_800 from '../assets/img/transform-after-800.avif';
import transform_after_avif_1120 from '../assets/img/transform-after-1120.avif';
import transform_after_webp_560 from '../assets/img/transform-after-560.webp';
import transform_after_webp_800 from '../assets/img/transform-after-800.webp';
import transform_after_webp_1120 from '../assets/img/transform-after-1120.webp';
import team_strength_avif_320 from '../assets/img/team-strength-320.avif';
import team_strength_avif_480 from '../assets/img/team-strength-480.avif';
import team_strength_avif_640 from '../assets/img/team-strength-640.avif';
import team_strength_avif_800 from '../assets/img/team-strength-800.avif';
import team_strength_webp_320 from '../assets/img/team-strength-320.webp';
import team_strength_webp_480 from '../assets/img/team-strength-480.webp';
import team_strength_webp_640 from '../assets/img/team-strength-640.webp';
import team_strength_webp_800 from '../assets/img/team-strength-800.webp';
import team_weights_avif_320 from '../assets/img/team-weights-320.avif';
import team_weights_avif_480 from '../assets/img/team-weights-480.avif';
import team_weights_avif_640 from '../assets/img/team-weights-640.avif';
import team_weights_avif_800 from '../assets/img/team-weights-800.avif';
import team_weights_webp_320 from '../assets/img/team-weights-320.webp';
import team_weights_webp_480 from '../assets/img/team-weights-480.webp';
import team_weights_webp_640 from '../assets/img/team-weights-640.webp';
import team_weights_webp_800 from '../assets/img/team-weights-800.webp';
import team_class_avif_320 from '../assets/img/team-class-320.avif';
import team_class_avif_480 from '../assets/img/team-class-480.avif';
import team_class_avif_640 from '../assets/img/team-class-640.avif';
import team_class_avif_800 from '../assets/img/team-class-800.avif';
import team_class_webp_320 from '../assets/img/team-class-320.webp';
import team_class_webp_480 from '../assets/img/team-class-480.webp';
import team_class_webp_640 from '../assets/img/team-class-640.webp';
import team_class_webp_800 from '../assets/img/team-class-800.webp';
import team_nutrition_avif_320 from '../assets/img/team-nutrition-320.avif';
import team_nutrition_avif_480 from '../assets/img/team-nutrition-480.avif';
import team_nutrition_avif_640 from '../assets/img/team-nutrition-640.avif';
import team_nutrition_avif_800 from '../assets/img/team-nutrition-800.avif';
import team_nutrition_webp_320 from '../assets/img/team-nutrition-320.webp';
import team_nutrition_webp_480 from '../assets/img/team-nutrition-480.webp';
import team_nutrition_webp_640 from '../assets/img/team-nutrition-640.webp';
import team_nutrition_webp_800 from '../assets/img/team-nutrition-800.webp';

export const PHOTOS: Record<string, Photo> = {
  'floor-wide': {
    alt: "Weights and machines on a dimly lit gym floor",
    credit: "Pexels 29224211",
    width: 1600,
    height: 1000,
    src: floor_wide_webp_1600,
    avif: [`${floor_wide_avif_640} 640w`, `${floor_wide_avif_960} 960w`, `${floor_wide_avif_1280} 1280w`, `${floor_wide_avif_1600} 1600w`].join(', '),
    webp: [`${floor_wide_webp_640} 640w`, `${floor_wide_webp_960} 960w`, `${floor_wide_webp_1280} 1280w`, `${floor_wide_webp_1600} 1600w`].join(', '),
  },
  'transform-before': {
    alt: "Member at the start of their training block",
    credit: "Pexels 27669753",
    width: 1120,
    height: 840,
    src: transform_before_webp_1120,
    avif: [`${transform_before_avif_560} 560w`, `${transform_before_avif_800} 800w`, `${transform_before_avif_1120} 1120w`].join(', '),
    webp: [`${transform_before_webp_560} 560w`, `${transform_before_webp_800} 800w`, `${transform_before_webp_1120} 1120w`].join(', '),
  },
  'transform-after': {
    alt: "Member after their training block",
    credit: "Pexels 14898406",
    width: 1120,
    height: 840,
    src: transform_after_webp_1120,
    avif: [`${transform_after_avif_560} 560w`, `${transform_after_avif_800} 800w`, `${transform_after_avif_1120} 1120w`].join(', '),
    webp: [`${transform_after_webp_560} 560w`, `${transform_after_webp_800} 800w`, `${transform_after_webp_1120} 1120w`].join(', '),
  },
  'team-strength': {
    alt: "Strength and conditioning coach",
    credit: "Pexels 17706046",
    width: 800,
    height: 1000,
    src: team_strength_webp_800,
    avif: [`${team_strength_avif_320} 320w`, `${team_strength_avif_480} 480w`, `${team_strength_avif_640} 640w`, `${team_strength_avif_800} 800w`].join(', '),
    webp: [`${team_strength_webp_320} 320w`, `${team_strength_webp_480} 480w`, `${team_strength_webp_640} 640w`, `${team_strength_webp_800} 800w`].join(', '),
  },
  'team-weights': {
    alt: "Weight training coach",
    credit: "Pexels 36510739",
    width: 800,
    height: 1000,
    src: team_weights_webp_800,
    avif: [`${team_weights_avif_320} 320w`, `${team_weights_avif_480} 480w`, `${team_weights_avif_640} 640w`, `${team_weights_avif_800} 800w`].join(', '),
    webp: [`${team_weights_webp_320} 320w`, `${team_weights_webp_480} 480w`, `${team_weights_webp_640} 640w`, `${team_weights_webp_800} 800w`].join(', '),
  },
  'team-class': {
    alt: "Zumba and aerobics instructor",
    credit: "Pexels 9943222",
    width: 800,
    height: 1000,
    src: team_class_webp_800,
    avif: [`${team_class_avif_320} 320w`, `${team_class_avif_480} 480w`, `${team_class_avif_640} 640w`, `${team_class_avif_800} 800w`].join(', '),
    webp: [`${team_class_webp_320} 320w`, `${team_class_webp_480} 480w`, `${team_class_webp_640} 640w`, `${team_class_webp_800} 800w`].join(', '),
  },
  'team-nutrition': {
    alt: "Nutritionist planning a diet",
    credit: "Pexels 16216729",
    width: 800,
    height: 1000,
    src: team_nutrition_webp_800,
    avif: [`${team_nutrition_avif_320} 320w`, `${team_nutrition_avif_480} 480w`, `${team_nutrition_avif_640} 640w`, `${team_nutrition_avif_800} 800w`].join(', '),
    webp: [`${team_nutrition_webp_320} 320w`, `${team_nutrition_webp_480} 480w`, `${team_nutrition_webp_640} 640w`, `${team_nutrition_webp_800} 800w`].join(', '),
  },};
