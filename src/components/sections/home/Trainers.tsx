import { useState } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Photo } from '../../ui/Photo';
import { Icon } from '../../ui/Icon';
import { TodoText } from '../../ui/TodoText';
import { cx } from '../../../utils/cx';
import styles from './Trainers.module.css';

/* ---------------------------------------------------------------------------
   The team. Names and specialities are still placeholders, and the portraits
   are licensed sample photography (see IMAGE_CREDITS.md). The club sends its
   own shoot, runs `npm run photos`, and the same four cards fill in — the
   footnote under the grid says so on the page, so nobody mistakes a sample
   portrait for a real coach.

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

const PLACEHOLDERS: TrainerCard[] = [
  {
    name: '[TRAINER NAME]',
    speciality: '[SPECIALITY] — strength & conditioning',
    credits: '[CERTIFICATION]',
    photo: 'team-strength',
    tall: true,
  },
  {
    name: '[TRAINER NAME]',
    speciality: '[SPECIALITY] — weight training',
    credits: '[CERTIFICATION]',
    photo: 'team-weights',
    tall: false,
  },
  {
    name: '[NUTRITIONIST NAME]',
    speciality: '[SPECIALITY] — diet planning',
    credits: '[QUALIFICATION]',
    photo: 'team-nutrition',
    tall: true,
  },
  {
    name: '[TRAINER NAME]',
    speciality: '[SPECIALITY] — Zumba & aerobics',
    credits: '[CERTIFICATION]',
    photo: 'team-class',
    tall: false,
  },
];

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
        <TodoText as="h3" className={styles.name} text={trainer.name} />
        <span className={styles.rule} />
        <TodoText as="p" className={styles.speciality} text={trainer.speciality} />
      </div>

      <div className={styles.expand}>
        <div className={styles.expandInner}>
          <TodoText as="p" className={styles.speciality} text={trainer.credits} />
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
  /* Real team members, once the club sends them, carry their own photo slug.
     Until then the four sample cards stand in. */
  const trainers: TrainerCard[] =
    siteConfig.trainers.length > 0
      ? siteConfig.trainers.map((trainer, index) => ({
          ...trainer,
          photo: trainer.photo || PLACEHOLDERS[index % PLACEHOLDERS.length].photo,
        }))
      : PLACEHOLDERS;

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
