import { useState } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Photo } from '../../ui/Photo';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Trainers.module.css';

/* ---------------------------------------------------------------------------
   The team, straight out of siteConfig.trainers. The four portraits are
   licensed sample photography (see IMAGE_CREDITS.md) until the club sends its
   own shoot: drop the files in, run `npm run photos`, and the same four cards
   update with no component changes.

   Hover reveals the speciality on a fine pointer; on touch the card carries a
   real toggle button that expands the credentials. The expand animates
   grid-template-rows, so the card resizes itself without any JS measurement —
   and the markup stays valid (no block content inside a <button>).
   --------------------------------------------------------------------------- */

interface TrainerCard {
  name: string;
  speciality: string;
  credits: string;
  /** Key into src/data/photos.ts. */
  photo: string;
  tall: boolean;
}

/** Photo slugs from src/data/photos.ts, used in order when a card has none. */
const PHOTO_FALLBACK = ['team-strength', 'team-weights', 'team-nutrition', 'team-class'];

function TrainerTile({ trainer }: { trainer: TrainerCard }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={cx(styles.card, open && styles.cardOpen)}>
      <div className={styles.photo}>
        <div className={styles.photoInner}>
          <Photo
            slug={trainer.photo}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 62vw"
          />
        </div>
      </div>

      <div className={styles.meta}>
        <h3 className={styles.name}>{trainer.name}</h3>
        <span className={styles.rule} />
        <p className={styles.speciality}>{trainer.speciality}</p>
      </div>

      <div className={styles.expand}>
        <div className={styles.expandInner}>
          <p className={styles.speciality}>{trainer.credits}</p>
        </div>
      </div>

      {/* One stretched toggle. Hidden on fine pointers, where the detail is
          always visible and there is nothing to expand. */}
      <button
        type="button"
        className={styles.stretcher}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Show {open ? 'less' : 'more'} about this coach</span>
      </button>

      <span className={styles.tapHint} aria-hidden="true">
        <Icon name="chevron" size={12} />
        {open ? 'Less' : 'More'}
      </span>
    </article>
  );
}

export function Trainers() {
  const trainers: TrainerCard[] = siteConfig.trainers.map((trainer, index) => ({
    ...trainer,
    photo: trainer.photo || PHOTO_FALLBACK[index % PHOTO_FALLBACK.length],
  }));

  return (
    <section className={cx('section', styles.section)} aria-labelledby="trainers-title">
      <div className="shell">
        <SectionHead
          id="trainers-title"
          index="05"
          label="The team"
          title={['People who watch', 'your reps.']}
          lead="A coach who knows your name, your old injury and which side you favour. That is the whole difference."
          ghost="Crew"
        />

        <div className={styles.grid}>
          {trainers.map((trainer, index) => (
            <TrainerTile key={`${trainer.name}-${index}`} trainer={trainer} />
          ))}
        </div>

        <p className={styles.hint}>
          <Icon name="check" size={15} />
          <span>{siteConfig.trainersHint}</span>
        </p>
      </div>
    </section>
  );
}
