import { lazy, Suspense, useRef } from 'react';
import type { ReactNode } from 'react';
import { activeHeadline, hasPhone, hasWhatsapp, siteConfig } from '../../../data/siteConfig';
import { useIntroDone } from '../../../context/intro';
import { useLead } from '../../../context/lead';
import { useIsTouch, useReducedMotion } from '../../../hooks/useMediaQuery';
import { gsap, ScrollTrigger, useGSAP } from '../../../lib/gsap';
import { scrollToTarget } from '../../../lib/scroll';
import { buildWhatsAppLink } from '../../../utils/whatsapp';
import { trackEvent } from '../../../utils/analytics';
import { Button } from '../../ui/Button';
import { OwnerFigure } from '../../ui/OwnerFigure';
import { cx } from '../../../utils/cx';
import styles from './Hero.module.css';

/* Decoration only, and the single heaviest component on the page: split out so
   the hero's own markup and the LCP image are never queued behind it. */
const Sparks = lazy(() => import('../../motion/Sparks'));

/* ---------------------------------------------------------------------------
   Turns one configured headline line into word-level masks, applying the
   accent / outline treatment to the configured keyword. Words are animated
   rather than whole lines: a per-line mask clips the moment a line wraps on a
   narrow phone, which is exactly what happens at 360px.
   --------------------------------------------------------------------------- */
function renderLine(
  line: string,
  accentWord?: string,
  outlineWord?: string,
  keyPrefix = '',
): ReactNode[] {
  const words = line.split(/\s+/).filter(Boolean);

  return words.map((word, index) => {
    const bare = word.replace(/[^\p{L}]/gu, '').toLowerCase();
    const isAccent = accentWord && bare === accentWord.toLowerCase();
    const isOutline = !isAccent && outlineWord && bare === outlineWord.toLowerCase();

    return (
      <span className={styles.word} key={`${keyPrefix}-${word}-${index}`}>
        <span
          className={[
            styles.wordInner,
            isAccent ? styles.headlineAccent : '',
            isOutline ? 'outline' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {word}
        </span>
      </span>
    );
  });
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const introDone = useIntroDone();
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const { startLead } = useLead();

  const whatsapp = buildWhatsAppLink({ source: 'hero' });

  /* --------------------------------------------------------------- motion */
  useGSAP(
    () => {
      if (!introDone) return;

      const q = gsap.utils.selector(root);

      /* Entrance. Masked line reveal for the headline; plain rise for the
         supporting block. Skipped for reduced motion — the CSS default is the
         finished state, so nothing is ever left hidden. */
      if (!reduced) {
        const words = q(`.${styles.wordInner}`);
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.from(words, {
          yPercent: 118,
          duration: 1,
          stagger: 0.055,
          delay: 0.08,
        })
          .from(
            q(`.${styles.eyebrow}, .${styles.sub}, .${styles.ctaRow}, .${styles.trust}`),
            { y: 22, opacity: 0, duration: 0.75, stagger: 0.08 },
            0.28,
          )
          .from(q(`.${styles.figure}`), { yPercent: 6, opacity: 0, duration: 1.2 }, 0.1)
          .from(q(`.${styles.cue}`), { opacity: 0, duration: 0.6 }, 0.9);

        /* ------------------------------------------------------ parallax */
        const scrub = { scrub: 0.8 };

        gsap.to(q(`.${styles.figure}`), {
          yPercent: -9,
          scale: 1.045,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', ...scrub },
        });

        gsap.to(q(`.${styles.content}`), {
          yPercent: -14,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', ...scrub },
        });

        gsap.to(q(`.${styles.ghostWord}`), {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', ...scrub },
        });

        gsap.to(q(`.${styles.slash}, .${styles.slashHard}`), {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', ...scrub },
        });

        /* The ghost wordmark drifts continuously so the back layer is never
           fully static, even before the visitor scrolls. */
        const drift = gsap.to(q(`.${styles.ghostWord}`), {
          xPercent: 4,
          duration: 18,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        return () => {
          drift.kill();
          tl.kill();
        };
      }

      return undefined;
    },
    { scope: root, dependencies: [introDone, reduced] },
  );

  /* Desktop pointer parallax: the back layers lean with the cursor. Rebuilt
     only for fine pointers, and torn down on cleanup so no listener survives
     on a phone. */
  useGSAP(
    () => {
      if (isTouch || reduced || !introDone) return;
      const node = root.current;
      if (!node) return;

      const ghostEl = node.querySelector<HTMLElement>(`.${styles.ghostWord}`);
      const figureEl = node.querySelector<HTMLElement>(`.${styles.figure}`);
      if (!ghostEl || !figureEl) return;

      const ghost = gsap.quickTo(ghostEl, 'x', { duration: 0.9, ease: 'power3.out' });
      const figure = gsap.quickTo(figureEl, 'x', { duration: 1.1, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        ghost(-nx * 34);
        figure(-nx * 16);
      };

      node.addEventListener('pointermove', onMove, { passive: true });
      return () => {
        node.removeEventListener('pointermove', onMove);
        gsap.killTweensOf([ghostEl, figureEl]);
        gsap.set([ghostEl, figureEl], { x: 0 });
      };
    },
    { scope: root, dependencies: [isTouch, reduced, introDone] },
  );

  /* Refresh once the hero image lands, so the parallax starts from the right
     measurements instead of a zero-height hero. */
  useGSAP(
    () => {
      const onLoad = () => ScrollTrigger.refresh();
      const img = root.current?.querySelector('img');
      img?.addEventListener('load', onLoad, { once: true });
      const timer = window.setTimeout(onLoad, 1200);
      return () => {
        img?.removeEventListener('load', onLoad);
        window.clearTimeout(timer);
      };
    },
    { scope: root },
  );

  const headline = activeHeadline;

  return (
    <section className={styles.hero} ref={root} aria-labelledby="hero-title">
      {/* Layer 0 — designed grid + oversized ghost wordmark */}
      <span className={styles.gridLines} aria-hidden="true" />
      <div className={styles.ghostLayer} aria-hidden="true">
        <span className={styles.ghostWord}>{siteConfig.business.name}</span>
      </div>

      {/* Layer 1 — the accent diagonal */}
      <span className={styles.slash} aria-hidden="true" />
      <span className={styles.slashHard} aria-hidden="true" />

      {/* Layer 2 — founder cutout, bottom-anchored and bleeding off the edge,
          turned so he looks into the headline */}
      <OwnerFigure
        className={styles.figure}
        renderWidth={720}
        priority
        edge
        sizes="(max-width: 767px) 78vw, (max-width: 1023px) 52vw, 44vw"
      />

      {/* Layer 3 — the content stack: a top group (who/where) and a bottom
          group (act). The gap between them is where the founder shows. */}
      <div className={cx('shell', styles.content)}>
        <div className={styles.topGroup}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className="micro micro--accent">Bhubaneswar · Odisha</span>
            <span className="micro">{siteConfig.business.area}</span>
          </p>

          <h1 id="hero-title" className={cx('display-1', styles.headline)}>
            {headline.lines.map((line) => (
              <span className={styles.lineRow} key={line}>
                {renderLine(line, headline.accentWord, headline.outlineWord, headline.accentWord)}
              </span>
            ))}
          </h1>

          <p className={cx('lead', styles.sub)}>{siteConfig.hero.sub}</p>
        </div>

        <div className={styles.bottomGroup}>
          <div className={styles.ctaRow}>
            <Button
              variant="primary"
              size="lg"
              icon="arrow-right"
              magnetic
              onClick={() => startLead({ source: 'hero' })}
            >
              Claim your free trial
            </Button>
            {hasWhatsapp && whatsapp ? (
              <Button
                variant="secondary"
                size="lg"
                icon="whatsapp"
                iconPosition="start"
                magnetic
                href={whatsapp}
                onClick={() => trackEvent('whatsapp_click', { where: 'hero' })}
              >
                WhatsApp us
              </Button>
            ) : hasPhone ? (
              <Button
                variant="secondary"
                size="lg"
                icon="phone"
                iconPosition="start"
                magnetic
                href={`tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}`}
                onClick={() => trackEvent('call_click', { where: 'hero' })}
              >
                Call the gym
              </Button>
            ) : (
              /* No verified number yet, so the second CTA does the one genuinely
               useful thing still available: it shows the programmes. A button
               that opens nothing is worse than one fewer button. */
              <Button
                variant="secondary"
                size="lg"
                icon="arrow-down"
                iconPosition="start"
                magnetic
                onClick={() => {
                  trackEvent('cta_click', { source: 'hero-secondary', kind: 'programmes' });
                  scrollToTarget('#programs', -8);
                }}
              >
                See the programmes
              </Button>
            )}
          </div>

          {/* Trust row: the verified services, and nothing else. */}
          <div className={styles.trust}>
            {siteConfig.hero.trustItems.map((item) => (
              <span key={item} className={styles.trustItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <Sparks className={styles.sparks} />
      </Suspense>

      <p className={styles.cue} aria-hidden="true">
        <span className={styles.cueLine} />
        {siteConfig.hero.scrollCue}
      </p>
    </section>
  );
}
