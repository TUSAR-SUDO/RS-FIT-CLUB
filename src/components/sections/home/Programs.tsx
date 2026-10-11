import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../../data/siteConfig';
import type { Program } from '../../../data/siteConfig';
import { useLead } from '../../../context/lead';
import { useMediaQuery, useReducedMotion } from '../../../hooks/useMediaQuery';
import { useSpotlight } from '../../../hooks/useSpotlight';
import { gsap, useGSAP } from '../../../lib/gsap';
import { SectionHead } from '../../ui/SectionHead';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Photo } from '../../ui/Photo';
import { cx } from '../../../utils/cx';
import styles from './Programs.module.css';

/* ---------------------------------------------------------------------------
   The eight services the club publicly lists. Desktop pins the section and
   travels the track horizontally; phones get a native, momentum-friendly
   scroll-snap carousel with a progress bar. Same markup, different physics.
   --------------------------------------------------------------------------- */

function ProgramCard({
  program,
  active,
  onFocus,
}: {
  program: Program;
  active: boolean;
  onFocus: () => void;
}) {
  return (
    <article className={styles.card} data-active={active} onFocusCapture={onFocus} data-spotlight>
      {/* The card is a photograph with the copy sitting on it. Both layers are
          decorative-plus-text: the media is aria-hidden, the copy keeps the
          card's real name, so a screen reader reads the same thing as before. */}
      <span className={styles.cardMedia} aria-hidden="true">
        <Photo slug={program.photo} sizes="(min-width: 1024px) 380px, 78vw" />
      </span>
      <span className={styles.cardScrim} aria-hidden="true" />

      <div className={styles.cardTop}>
        <span className={styles.numeral} aria-hidden="true">
          {program.numeral}
        </span>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon name={program.icon} size={20} />
        </span>
      </div>

      <h3 className={styles.cardTitle}>{program.title}</h3>
      <p className={styles.benefit}>{program.benefit}</p>
      <p className={styles.detail}>{program.detail}</p>

      <div className={styles.cardFoot}>
        <span className="micro">{program.numeral} / 08</span>
        <span className={styles.cardLink}>
          On the floor
          <Icon name="arrow-right" size={14} />
        </span>
      </div>

      {/* One stretched link per card: the whole card is the hit area, but there
          is exactly one link in the tab order with a real accessible name. */}
      <Link
        to={`/programs#${program.slug}`}
        className={styles.cardLinkStretch}
        aria-label={`${program.title} — see the full programme`}
      />
    </article>
  );
}

export function Programs() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const { startLead } = useLead();

  /* Cards light up under the pointer — see src/hooks/useSpotlight.ts. */
  useSpotlight(root, reduced);

  /* ------------------------------------------------- desktop pinned scene */
  useGSAP(
    () => {
      if (!isDesktop || reduced) return;
      const trackEl = track.current;
      const pinEl = pin.current;
      if (!trackEl || !pinEl) return;

      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 40);
      if (distance() <= 0) return;

      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(trackEl, { clearProps: 'transform' });
      };
    },
    { scope: root, dependencies: [isDesktop, reduced] },
  );

  /* --------------------------------------------- mobile carousel plumbing */
  const onTrackScroll = useCallback(() => {
    const el = track.current;
    const bar = progress.current;
    if (!el || !bar) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    /* Widen the bar so it never collapses to nothing at either end. */
    bar.style.setProperty('--p', String(0.1 + p * 0.9));
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    const el = track.current;
    if (!el) return;

    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        onTrackScroll();
      });
    };

    el.addEventListener('scroll', handler, { passive: true });
    onTrackScroll();
    return () => el.removeEventListener('scroll', handler);
  }, [isDesktop, onTrackScroll]);

  /* Highlight whichever card is centred in the mobile carousel. */
  useEffect(() => {
    if (isDesktop) {
      setActive(0);
      return;
    }
    const el = track.current;
    if (!el) return;

    const cards = Array.from(el.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = cards.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section
      ref={root}
      id="programs"
      className={cx('section', styles.section)}
      aria-labelledby="programs-title"
    >
      <div ref={pin} className={styles.pin}>
        <div className={cx('shell', styles.head)}>
          <SectionHead
            id="programs-title"
            index="02"
            label="Programmes"
            title={['Eight ways in.', 'Pick your door.']}
            lead="Every one of these runs on the same floor, with the same coaches walking it. Mix them whenever your week needs it."
            ghost="Iron"
            actions={
              <Button variant="ghost" icon="arrow-right" to="/programs">
                All programmes
              </Button>
            }
          />
        </div>

        <div className={styles.trackWrap}>
          <div className={styles.track} ref={track}>
            {siteConfig.programs.map((program, index) => (
              <ProgramCard
                key={program.slug}
                program={program}
                active={!isDesktop ? active === index : false}
                onFocus={() => setActive(index)}
              />
            ))}
          </div>
        </div>

        <div className={styles.progressRow}>
          <span className="micro">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(siteConfig.programs.length).padStart(2, '0')}
          </span>
          <span className={styles.progressTrack}>
            <span className={styles.progressBar} ref={progress} />
          </span>
          <span className={styles.hint}>
            <Icon name="drag" size={13} />
            Swipe
          </span>
        </div>
      </div>

      {/* Below the pinned scene on desktop: a direct line to the form. */}
      <div className="shell" style={{ paddingTop: 'clamp(1.5rem, 4vh, 3rem)' }}>
        <div className={cx('rule-label')}>
          <span className="micro">Not sure which one?</span>
        </div>
        <p style={{ marginTop: '1rem', maxWidth: '52ch', color: 'var(--text-dim)' }}>
          Tell us what you are starting from and the coaches will put you on the right programme —
          and write it on an exercise card before your first set.
        </p>
        <div style={{ marginTop: '1.25rem' }}>
          <Button variant="primary" onClick={() => startLead({ source: 'programs' })}>
            Get matched
          </Button>
        </div>
      </div>
    </section>
  );
}
