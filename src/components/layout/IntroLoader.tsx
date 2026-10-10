import { useCallback, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { LOGO_MARK } from '../../data/media';
import { siteConfig } from '../../data/siteConfig';
import styles from './IntroLoader.module.css';

interface IntroLoaderProps {
  onDone: () => void;
}

/**
 * The opening beat: the RS lockup wipes open, an accent slash sweeps across,
 * a 0→100 counter runs, then the two panels split apart and hand over to the
 * hero.
 *
 * Three guarantees:
 *  1. It ends by itself in ~1.5s (a 2.4s hard failsafe unmounts it regardless).
 *  2. Any click, tap or key press skips it.
 *  3. It is never mounted for prefers-reduced-motion, and only once per
 *     session — see shouldPlayIntro() in src/lib/introSession.ts.
 */
export function IntroLoader({ onDone }: IntroLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);

  /* Scroll unlock is owned by the layout, which toggles `is-intro`. */
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useGSAP(
    () => {
      const counter = root.current?.querySelector<HTMLElement>('[data-counter]');
      const node = { value: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      });
      timeline.current = tl;

      tl.fromTo(
        `.${styles.mark}`,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'expo.out' },
        0,
      )
        .fromTo(
          `.${styles.slash}`,
          { xPercent: -180 },
          { xPercent: 420, duration: 0.55, ease: 'power2.inOut' },
          0.05,
        )
        .to(`.${styles.rule}`, { scaleX: 1, duration: 0.55, ease: 'expo.out' }, 0.2)
        .to(
          node,
          {
            value: 100,
            duration: 0.75,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(node.value)).padStart(3, '0');
            },
          },
          0.25,
        )
        .to(`.${styles.content}`, { opacity: 0, duration: 0.22, ease: 'power1.in' }, 1.02)
        .to(`.${styles.panelTop}`, { yPercent: -101, duration: 0.5, ease: 'expo.inOut' }, 1.06)
        .to(`.${styles.panelBottom}`, { yPercent: 101, duration: 0.5, ease: 'expo.inOut' }, 1.06);

      return () => {
        tl.kill();
        timeline.current = null;
      };
    },
    { scope: root, dependencies: [finish] },
  );

  /* Skip on any interaction, and never let it outstay its welcome. */
  useEffect(() => {
    const skip = () => {
      const tl = timeline.current;
      if (!tl) return;
      tl.timeScale(6);
    };
    const failSafe = window.setTimeout(finish, 2400);

    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('wheel', skip, { passive: true, once: true });
    window.addEventListener('touchstart', skip, { passive: true, once: true });

    return () => {
      window.clearTimeout(failSafe);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [finish]);

  return (
    <div className={styles.loader} ref={root} aria-hidden="true">
      <div className={`${styles.panel} ${styles.panelTop}`} />
      <div className={`${styles.panel} ${styles.panelBottom}`} />

      <div className={styles.content}>
        <div className={styles.markWrap}>
          <picture>
            <source type="image/avif" srcSet={LOGO_MARK.avif.srcSet} sizes="300px" />
            <source type="image/webp" srcSet={LOGO_MARK.webp.srcSet} sizes="300px" />
            <img
              className={styles.mark}
              src={LOGO_MARK.webp.src}
              width={300}
              height={Math.round(300 / LOGO_MARK.ratio)}
              alt=""
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
          <span className={styles.slash} />
          <span className={styles.rule} />
        </div>
      </div>

      <p className={styles.counter}>
        <span>{siteConfig.business.city}</span>
        <span className={styles.counterValue} data-counter>
          000
        </span>
      </p>
      <span className={styles.skip}>Tap to skip</span>
    </div>
  );
}
