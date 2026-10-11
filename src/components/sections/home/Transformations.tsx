import { siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { BeforeAfter } from '../../ui/BeforeAfter';
import { Photo } from '../../ui/Photo';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Transformations.module.css';

/**
 * Proof of results — the hardest section to do honestly.
 *
 * The slider pairs two photographs behind one draggable line; the stories beside
 * it come from siteConfig.transformations. Both read config, so a new pair plus
 * its story is one edit. The "results vary" note is not decoration: it is the
 * line that keeps the club out of trouble.
 */
export function Transformations() {
  const stories = siteConfig.transformations;

  return (
    <section className={cx('section', styles.section)} aria-labelledby="transformations-title">
      <div className="shell">
        <SectionHead
          id="transformations-title"
          index="04"
          label="Transformations"
          title={['Drag the line.', 'See the work.']}
          lead="Drag the handle to compare day one with today. Same corner, same lights, months apart — because a pair shot under two different lights proves nothing."
          ghost="Proof"
        />

        <div className={styles.grid}>
          <div className={styles.sliderCol}>
            <div className={styles.sliderWrap}>
              <BeforeAfter
                label="Compare a member's before and after photos"
                beforeLabel="Before"
                afterLabel="After"
                before={
                  <Photo
                    slug="transform-before"
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    alt="Member at the start of their training block"
                  />
                }
                after={
                  <Photo
                    slug="transform-after"
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    alt="Member after their training block"
                  />
                }
              />
            </div>
            <p className={styles.sliderNote}>
              <Icon name="check" size={14} />
              <span>{siteConfig.transformationsNote}</span>
            </p>
          </div>

          <div className={styles.stories}>
            {stories.length > 0 ? (
              stories.map((story) => (
                <article className={styles.story} key={story.name}>
                  <h3 className={styles.storyName}>{story.name}</h3>
                  <p className={styles.storyMeta}>
                    <span>{story.goal}</span>
                    <span>{story.duration}</span>
                  </p>
                  <p className={styles.storyResult}>{story.result}</p>
                </article>
              ))
            ) : (
              <div className={styles.empty}>
                <h3 className={styles.emptyTitle}>Yours could be the next story</h3>
                <p className={styles.emptyBody}>
                  Timelines are published only with the member&rsquo;s written consent, under a
                  first name, with the goal they started on and how long it actually took.
                </p>
                <p className={styles.emptyBody}>
                  No borrowed photographs and no medical claims. Where a member asked not to be
                  shown, their pair stays off the page.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
