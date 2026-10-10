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
 * The counters are the interesting part. While the club has not supplied real
 * numbers the entire counter grid is replaced with a plain, honest line —
 * because an invented "251K+ trainees" is the single fastest way to lose the
 * trust this section exists to build.
 */
export function WhyRs() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      /* The gym-floor shot wipes open on scroll rather than fading in: it reads
         as a camera shutter, which suits a gym, and it is a single property. */
      const tween = gsap.fromTo(
        `.${styles.photoClip}`,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: `.${styles.photoCell}`, start: 'top 82%', once: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
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
              Sample image — send us a wide shot of the floor in {siteConfig.business.area} and it
              drops straight in.
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
                  Member numbers, years on the floor and coach counts appear here the moment the
                  club confirms them. We would rather show nothing than a number nobody counted.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
