import { useRef } from 'react';
import { hasRealStats, siteConfig } from '../../../data/siteConfig';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { gsap, useGSAP } from '../../../lib/gsap';
import { SectionHead } from '../../ui/SectionHead';
import { Photo } from '../../ui/Photo';
import { Counter } from '../../ui/Counter';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './WhyRs.module.css';

/**
 * The proof block. Reasons only, no guarantees: everything in here maps to a
 * service the club actually advertises.
 *
 * The counters read from siteConfig.stats. Delete a value and that counter
 * goes with it; delete them all and the grid is replaced by a line of copy
 * rather than a row of zeroes.
 */
export function WhyRs() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      /* The gym-floor shot wipes open on scroll rather than fading in: it reads
         as a camera shutter, which suits a gym, and it is a single property. */
      const photoTween = gsap.fromTo(
        `.${styles.photoClip}`,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: `.${styles.photoCell}`, start: 'top 82%', once: true },
        },
      );

      /* The two image tiles wipe in from the side, one after the other, each
         settling out of a slight zoom — the same shutter language as the floor
         shot, turned ninety degrees so the block does not read as one gesture. */
      const tiles = gsap.utils.toArray<HTMLElement>(`.${styles.tileClip}`, root.current);
      const tileTween = tiles.length
        ? gsap.fromTo(
            tiles,
            { clipPath: 'inset(0 0 0 100%)', scale: 1.12 },
            {
              clipPath: 'inset(0 0 0 0%)',
              scale: 1,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.14,
              scrollTrigger: { trigger: `.${styles.bento}`, start: 'top 80%', once: true },
            },
          )
        : null;

      return () => {
        photoTween.scrollTrigger?.kill();
        photoTween.kill();
        tileTween?.scrollTrigger?.kill();
        tileTween?.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className={cx('section', styles.section)} aria-labelledby="why-title">
      <div className="shell">
        <SectionHead
          id="why-title"
          index="03"
          label="Why this floor"
          title={['Not a room full', 'of machines.']}
          lead="Coaches and nutritionists working the same room, plans written on paper you carry, and classes for the days when the barbell is not the answer."
          ghost="Why"
        />

        <div className={styles.bento}>
          {/* Photo slot first so the shutter reveal anchors the block. */}
          <div className={cx(styles.cell, styles.photoCell)}>
            <div className={styles.photoClip}>
              <Photo slug="floor-wide" sizes="(min-width: 1024px) 46vw, 100vw" />
            </div>
            <p className={styles.photoCaption}>
              {siteConfig.business.spokenName} — {siteConfig.business.area},{' '}
              {siteConfig.business.city}. Lights on, before the evening session fills it.
            </p>
          </div>

          {siteConfig.differentiators.map((item) => (
            <div
              key={item.id}
              className={cx(
                styles.cell,
                item.span === 'wide' && styles.cellWide,
                item.span === 'tall' && styles.cellTall,
              )}
            >
              <span className={styles.cellIcon} aria-hidden="true">
                <Icon name={item.icon} size={18} />
              </span>
              <h3 className={styles.cellTitle}>{item.title}</h3>
              <p className={styles.cellBody}>{item.body}</p>
            </div>
          ))}

          {/* The two gaps the grid used to leave are photographs rather than
              empty background: the coach with one client, and a class in
              motion. Both are decorative — the copy beside them does the
              talking — so they stay out of the accessibility tree. */}
          <div className={cx(styles.cell, styles.tileCell, styles.tileA)}>
            <span className={styles.tileClip} aria-hidden="true">
              <Photo slug="bento-one-to-one" sizes="(min-width: 1024px) 30vw, 100vw" />
            </span>
            <span className={styles.tileCaption}>One coach, one set, every rep counted</span>
          </div>

          <div className={cx(styles.cell, styles.tileCell, styles.tileB)}>
            <span className={styles.tileClip} aria-hidden="true">
              <Photo slug="bento-class" sizes="(min-width: 1024px) 30vw, 100vw" />
            </span>
            <span className={styles.tileCaption}>Classes run inside the same membership</span>
          </div>

          {/* Counters only render once there are real numbers behind them. */}
          <div className={cx(styles.cell, styles.statCell)}>
            {hasRealStats ? (
              <div className={styles.statGrid}>
                {siteConfig.stats.map((stat) => (
                  <div className={styles.stat} key={stat.label}>
                    <Counter
                      className={styles.statValue}
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.statsEmpty}>
                <Icon name="check" size={16} />
                <span>
                  Ask at the desk how many people train here, how long the club has been on this
                  road and how many coaches are on shift — the floor answers it better than a number
                  on a screen.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
