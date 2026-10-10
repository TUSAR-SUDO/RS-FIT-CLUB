import { isReal, siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { useLead } from '../../../context/lead';
import { trackEvent } from '../../../utils/analytics';
import { cx } from '../../../utils/cx';
import styles from './Testimonials.module.css';

/**
 * Reviews. The club has not supplied any yet, so this renders an empty state
 * and a slot for the Google listing — never invented quotes. Fabricated
 * testimonials are both dishonest and, in India, a consumer-law problem.
 */
export function Testimonials() {
  const reviews = siteConfig.testimonials;
  const hasReviews = reviews.length > 0;
  const hasGoogle = isReal(siteConfig.googleReviewsUrl);
  const hasRating = isReal(siteConfig.ratingAverage);
  const { startLead } = useLead();

  return (
    <section className={cx('section', styles.section)} aria-labelledby="reviews-title">
      <div className="shell">
        <SectionHead
          id="reviews-title"
          index="08"
          label="Word of mouth"
          title={['Straight from', 'the floor.']}
          lead="Unedited, first-name reviews from members. We only publish what they actually said."
          ghost="Talk"
          actions={
            hasRating ? (
              <span
                className={styles.stars}
                aria-label={`Rated ${siteConfig.ratingAverage} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon name="star" size={16} key={index} />
                ))}
                <span className="micro" style={{ marginLeft: '0.5rem' }}>
                  {String(siteConfig.ratingAverage)} / 5
                  {isReal(siteConfig.ratingCount) ? ` · ${siteConfig.ratingCount} reviews` : ''}
                </span>
              </span>
            ) : undefined
          }
        />

        {hasReviews ? (
          <div className={styles.rail}>
            {reviews.map((review) => (
              <article className={styles.card} key={review.name}>
                <span className={styles.stars} aria-label={`${review.rating} out of 5`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Icon name="star" size={15} key={index} />
                  ))}
                </span>
                <p className={styles.quote}>&ldquo;{review.quote}&rdquo;</p>
                <div className={styles.who}>
                  <span className={styles.whoName}>{review.name}</span>
                  <span className={styles.whoMeta}>
                    {review.goal} · {review.duration}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>Reviews are switched on, not made up</h3>
            <p className={styles.emptyBody}>
              Send us five real reviews — first name, goal, and how long you have been training here
              — and they run in a rail right here. Until then this space stays empty on purpose,
              because a wall of invented five-star quotes is the least trustworthy thing a gym can
              put on its website.
            </p>
            <p className={styles.emptyBody}>
              Already have a Google listing? That link sits beside these reviews and does the job
              for you.
            </p>

            {/* Three empty slots rather than three invented quotes: the section
                keeps its composition, and the client can see exactly what to
                send. Nothing in here claims to be a real person. */}
            <ul className={styles.slots}>
              {[0, 1, 2].map((slot) => (
                <li className={styles.slot} key={slot}>
                  <span className={styles.slotQuote} aria-hidden="true">
                    &ldquo;
                  </span>
                  <span className={cx('token', styles.slotLabel)}>[REVIEW TEXT]</span>
                  <span className={styles.slotLines} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className={styles.slotFoot}>
                    <span className="token">[MEMBER NAME]</span>
                    <span className="token">[GOAL]</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.emptyActions}>
              {hasGoogle ? (
                <Button
                  variant="secondary"
                  icon="google"
                  iconPosition="start"
                  href={siteConfig.googleReviewsUrl}
                  onClick={() => trackEvent('cta_click', { source: 'reviews', kind: 'google' })}
                >
                  See our Google reviews
                </Button>
              ) : (
                <Button variant="secondary" icon="google" iconPosition="start" disabled>
                  Google reviews link pending
                </Button>
              )}
              <Button
                variant="ghost"
                icon="arrow-right"
                onClick={() => startLead({ source: 'reviews' })}
              >
                Come and form your own opinion
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
