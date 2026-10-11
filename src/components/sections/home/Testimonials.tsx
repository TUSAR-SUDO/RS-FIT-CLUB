import { isReal, siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { useLead } from '../../../context/lead';
import { trackEvent } from '../../../utils/analytics';
import { cx } from '../../../utils/cx';
import styles from './Testimonials.module.css';

/**
 * Reviews.
 *
 * Every quote here is a real review from the club's Google listing, copied
 * across verbatim — typos included, because the section promises unedited
 * reviews. They are published under a first name and initial.
 *
 * The rail is built from siteConfig.testimonials. Empty that array and the
 * section falls back to a plain panel that links out to the Google listing
 * rather than filling the space with quotes nobody wrote.
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
          lead="Unedited reviews from the club’s Google listing, published under first names. What they said is what you read — typos included."
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
          <>
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
                      {/* A Google review states no goal and no duration, so it
                          is attributed instead of dressed up with either. */}
                      {review.goal && review.duration
                        ? `${review.goal} · ${review.duration}`
                        : (review.source ?? 'Member review')}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* The rail shows six of 109. Send people to the source, where the
                rest can be read — and mis-quoting is impossible to hide. */}
            <div className={styles.emptyActions} style={{ marginTop: 'var(--sp-4)' }}>
              {hasGoogle ? (
                <Button
                  variant="secondary"
                  icon="google"
                  iconPosition="start"
                  href={siteConfig.googleReviewsUrl}
                  onClick={() => trackEvent('cta_click', { source: 'reviews', kind: 'google' })}
                >
                  {isReal(siteConfig.ratingCount)
                    ? `Read all ${siteConfig.ratingCount} reviews on Google`
                    : 'Read the reviews on Google'}
                </Button>
              ) : null}
              <Button
                variant="ghost"
                icon="arrow-right"
                onClick={() => startLead({ source: 'reviews' })}
              >
                Come and form your own opinion
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>Reviews land here as members leave them</h3>
            <p className={styles.emptyBody}>
              Every quote in this section is copied across from the club&rsquo;s Google listing,
              unedited and under a first name. New ones are added in the same shape — nothing in
              this rail is written by the club or by whoever built the site.
            </p>

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
              ) : null}
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
