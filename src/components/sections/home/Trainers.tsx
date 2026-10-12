import { useState } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Photo } from '../../ui/Photo';
import { CoachFigure } from '../../ui/CoachFigure';
import { OwnerFigure } from '../../ui/OwnerFigure';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Trainers.module.css';

/* ---------------------------------------------------------------------------
   THE TEAM

   Two people, both real: the owner (rendered from the same cut-out the hero and
   the founder block use, so his card cannot drift out of step with them) and
   the trainer, from the photograph the club sent. Beside them stands the
   trainer's background-removed twin as a 3D parallax panel — see CoachFigure.

   Four licensed portraits of four invented coaches used to live here. They are
   gone: a stranger's face presented as your coach is the one kind of picture a
   gym site cannot afford to get wrong.

   Hover reveals the speciality on a fine pointer; on touch the card carries a
   real toggle button that expands the credentials. The expand animates
   grid-template-rows, so the card resizes itself without any JS measurement —
   and the markup stays valid (no block content inside a <button>).
   --------------------------------------------------------------------------- */

interface TrainerCard {
  name: string;
  speciality: string;
  credits: string;
  /** Key into src/data/photos.ts, when the card carries a photograph. */
  photo: string | null;
  /** Transparent figure for the card's portrait plate. */
  cutout?: 'owner' | 'trainer' | null;
  tall: boolean;
}

/** Card portrait sizes: half the shell on desktop, near-full on a phone. */
const CARD_SIZES = '(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 92vw';

function TrainerTile({ trainer }: { trainer: TrainerCard }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={cx(styles.card, open && styles.cardOpen)}>
      <div className={styles.photo}>
        <div className={styles.photoInner}>
          {trainer.cutout ? (
            /* The owner has no framed photograph — the club sent a cut-out, and
               the whole site already shows him that way. */
            <OwnerFigure className={styles.cutout} renderWidth={560} sizes={CARD_SIZES} quiet />
          ) : trainer.photo ? (
            <Photo slug={trainer.photo} sizes={CARD_SIZES} alt={`${trainer.name} — ${trainer.speciality}`} />
          ) : null}
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
  const trainers: TrainerCard[] = siteConfig.trainers as TrainerCard[];

  return (
    <section className={cx('section', styles.section)} aria-labelledby="trainers-title">
      <div className="shell">
        <SectionHead
          id="trainers-title"
          index="05"
          label="The team"
          title={['People who watch', 'your reps.']}
          lead="Two people run what happens on this floor: the owner who writes the card, and the trainer who counts the reps. Between them: the weights, the plate and the classes."
          ghost="Crew"
        />

        <div className={styles.grid}>
          {trainers.map((trainer, index) => (
            <TrainerTile key={`${trainer.name}-${index}`} trainer={trainer} />
          ))}
        </div>

        {/* The trainer a second time, and deliberately not as a third card: he
            is cut out of his own photograph by the club and set loose in the
            page, leaning towards the pointer and drifting against the panel as
            you scroll it. A wide band with copy beside him reads as a feature;
            a third tile in the row would have read as a duplicate. */}
        <div className={styles.feature}>
          <CoachFigure
            className={styles.figure}
            name="Badal"
            role="Weights · strength · diet · Zumba"
            alt="Badal, the trainer at RS Fit Club, on the gym floor"
            sizes="(min-width: 1024px) 32vw, 92vw"
          />

          <div className={styles.featureCopy}>
            <p className="micro micro--accent">The trainer</p>
            <h3 className={styles.featureName}>Ask for Badal by name</h3>
            <p className={styles.featureLead}>
              Strength, weights, diet planning and the classes: one man runs all four on this
              floor, which is also why the plan on your card and the plan on your plate agree with
              each other.
            </p>
            <ul className={styles.featureList}>
              <li>Strength &amp; weight training on the floor</li>
              <li>Diet planning built on Odia home food</li>
              <li>Zumba &amp; aerobics classes</li>
              <li>Exercise cards, rewritten as you get stronger</li>
            </ul>
          </div>
        </div>

        <p className={styles.hint}>
          <Icon name="check" size={15} />
          <span>{siteConfig.trainersHint}</span>
        </p>
      </div>
    </section>
  );
}
