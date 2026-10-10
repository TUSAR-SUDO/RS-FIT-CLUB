import { siteConfig } from '../../../data/siteConfig';
import { Marquee } from '../../ui/Marquee';
import styles from './MarqueeBand.module.css';

/**
 * The loud beat between the hero and the founder story: two counter-rotating
 * bands, one solid accent and one outline, listing the eight verified services
 * and the areas the club serves. Speed reacts to scroll velocity.
 */
export function MarqueeBand() {
  return (
    <section className={styles.section} aria-labelledby="services-band-label">
      <div className="shell">
        <p className={styles.meta}>
          <span className="micro" id="services-band-label">
            What happens on the floor
          </span>
          <span className="micro micro--accent">
            {String(siteConfig.programs.length).padStart(2, '0')} programmes
          </span>
        </p>
      </div>

      <div className={styles.rotated}>
        <Marquee items={siteConfig.marquee.primary} variant="fill" speed={30} direction={1} />
        <Marquee items={siteConfig.marquee.secondary} variant="outline" speed={38} direction={-1} />
      </div>
    </section>
  );
}
