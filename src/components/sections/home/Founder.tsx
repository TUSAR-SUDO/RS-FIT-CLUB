import { useRef } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { useLead } from '../../../context/lead';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { gsap, useGSAP } from '../../../lib/gsap';
import { Button } from '../../ui/Button';
import { OwnerFigure } from '../../ui/OwnerFigure';
import { SectionHead } from '../../ui/SectionHead';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Founder.module.css';

/**
 * The trust beat. A buyer in Samantarapur is deciding between this gym and a
 * dozen others; a real, named person willing to stand on the floor is the
 * single most differentiating thing the club owns, so this section is given
 * full editorial weight rather than being squeezed into a card.
 *
 * The story, name, quote and credentials read from siteConfig.owner — the one
 * piece of narrative written for the club rather than by it. It is a stand-in
 * that fits the services the club advertises; CLIENT_CHECKLIST.md marks it for
 * the owner to read and rewrite in his own words.
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

          <blockquote className={styles.quote}>&ldquo;{owner.pullQuote}&rdquo;</blockquote>

          <p className={styles.name}>
            {owner.name}
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
                {credential}
              </span>
            ))}
          </div>

          <p className={styles.signature}>{owner.signatureLine}</p>

          <div>
            <Button
              variant="ghost"
              icon="arrow-right"
              onClick={() => startLead({ source: 'founder' })}
            >
              Train with {owner.name}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
