import { useRef } from 'react';
import { TRAINER_RATIO, trainerSrcSet } from '../../data/media';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { useTilt3d } from '../../hooks/useTilt3d';
import { gsap, useGSAP } from '../../lib/gsap';
import { cx } from '../../utils/cx';
import styles from './CoachFigure.module.css';

/* ---------------------------------------------------------------------------
   COACH FIGURE

   The trainer, cut out of his background by the club, standing inside the page
   rather than in a frame — with the depth that only a cut-out makes possible:

     · the figure leans towards the pointer (useTilt3d writes the custom
       properties, the transform itself is CSS)
     · the figure and the ghost word behind it scroll at different rates, so the
       panel reads as layers rather than one flat picture
     · an accent glow sits behind him and the ground shadow anchors his feet

   Three separate elements carry three separate transforms — parallax on the
   wrapper, tilt on the figure — so no single element is being asked to hold two
   animations and the two never fight over `transform`.

   The whole treatment is skipped under prefers-reduced-motion: the figure is
   simply a figure. It is decorative; the caption carries the meaning.
   --------------------------------------------------------------------------- */

interface CoachFigureProps {
  /** Shown as the oversized outline behind the figure and in the caption. */
  name: string;
  /** The specialities line, e.g. "Weights · strength · diet · Zumba". */
  role: string;
  alt: string;
  /** `sizes` for the responsive ladder, from the host layout. */
  sizes: string;
  className?: string;
}

export function CoachFigure({ name, role, alt, sizes, className }: CoachFigureProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useTilt3d(root, reduced);

  useGSAP(
    () => {
      if (reduced) return;

      /* Scroll parallax: the figure travels against the panel and the ghost
         word travels further, in the other direction. Both are scrubbed, so
         they follow the scroll rather than animating at it. */
      const figure = gsap.fromTo(
        `.${styles.parallax}`,
        { yPercent: 3.5 },
        {
          yPercent: -3.5,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );

      const ghost = gsap.fromTo(
        `.${styles.ghost}`,
        { yPercent: -11 },
        {
          yPercent: 11,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      );

      return () => {
        figure.scrollTrigger?.kill();
        figure.kill();
        ghost.scrollTrigger?.kill();
        ghost.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <figure
      ref={root}
      className={cx(styles.host, className)}
      /* The pointer handler looks for this, not for a class name. */
      data-tilt
    >
      <span className={styles.ghost} aria-hidden="true">
        {name}
      </span>
      <span className={styles.glow} aria-hidden="true" />

      <div className={styles.parallax}>
        <div className={styles.figure}>
          <picture>
            <source type="image/avif" srcSet={trainerSrcSet('avif')} sizes={sizes} />
            <source type="image/webp" srcSet={trainerSrcSet('webp')} sizes={sizes} />
            <img
              className={styles.img}
              src="/media/trainer-800.webp"
              alt={alt}
              width={800}
              height={Math.round(800 / TRAINER_RATIO)}
              sizes={sizes}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </picture>
        </div>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.name}>{name}</span>
        <span className={styles.role}>{role}</span>
      </figcaption>
    </figure>
  );
}
