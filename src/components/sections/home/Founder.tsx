import { useRef } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { useLead } from '../../../context/lead';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { gsap, useGSAP } from '../../../lib/gsap';
import { Button } from '../../ui/Button';
import { OwnerFigure } from '../../ui/OwnerFigure';
import { SectionHead } from '../../ui/SectionHead';
import { TodoText } from '../../ui/TodoText';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Founder.module.css';

/**
 * The trust beat. A buyer in Samantarapur is deciding between this gym and a
 * dozen others; a real, named person willing to stand on the floor is the
 * single most differentiating thing the club owns, so this section is given
 * full editorial weight rather than being squeezed into a card.
 *
 * Every fact here is a placeholder until the club supplies it — the copy tells
 * you what to write in the same place the story will live.
 */
export function Founder() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { startLead } = useLead();

  useGSAP(
    () => {
      if (reduced) return;

      /* Slow parallax on the portrait column, plus the slab drifting the other
         way: the two layers separating is what sells the depth. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });

      tl.fromTo(`.${styles.figure}`, { yPercent: 5 }, { yPercent: -5, ease: 'none' }, 0).fromTo(
        `.${styles.slab}`,
        { yPercent: -3 },
        { yPercent: 4, ease: 'none' },
        0,
      );

      return () => {
        tl.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  const owner = siteConfig.owner;

  return (
    <section className={cx('section', styles.section)} ref={root} aria-labelledby="founder-title">
      <div className={cx('shell', styles.grid)}>
        <div className={styles.portraitCol}>
          <span className={cx('ghost', styles.ghost)} aria-hidden="true">
            Coach
          </span>
          <div className={styles.frame}>
            <span className={styles.slab} aria-hidden="true" />
            <span className={styles.outline} aria-hidden="true" />
            <OwnerFigure
              className={styles.figure}
              renderWidth={620}
              sizes="(max-width: 899px) 90vw, 42vw"
            />
          </div>
        </div>

        <div className={styles.copy}>
          <SectionHead
            index="01"
            label="The person behind it"
            title={['He owns', 'the floor.']}
            tight
          />

          <blockquote className={styles.quote}>
            <TodoText text={`“${owner.pullQuote}”`} />
          </blockquote>

          <p className={styles.name}>
            <TodoText text={owner.name} />
            <span className={cx(styles.role, 'micro')}> — {owner.role}</span>
          </p>

          <div className={styles.bio}>
            {owner.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.creds}>
            {owner.credentials.map((credential) => (
              <span className={styles.cred} key={credential}>
                <Icon name="check" size={13} />
                <TodoText text={credential} />
              </span>
            ))}
          </div>

          <p className={styles.signature}>
            <TodoText text={owner.signatureLine} />
          </p>

          <div>
            <Button
              variant="ghost"
              icon="arrow-right"
              onClick={() => startLead({ source: 'founder' })}
            >
              <TodoText text={`Train with ${owner.name}`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
