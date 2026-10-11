import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { Photo } from '../components/ui/Photo';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

/* ---------------------------------------------------------------------------
   The team.

   Reads siteConfig.trainers, which carries the four roles the club staffs:
   strength and conditioning, weight training, nutrition and group classes.
   The portraits come from the photo pipeline, so replacing them with the
   club's own shoot is `npm run photos` and no component changes.
   --------------------------------------------------------------------------- */

interface TrainerCard {
  name: string;
  speciality: string;
  credits: string;
  /** Key into src/data/photos.ts. */
  photo: string;
}

/** Photo slugs from src/data/photos.ts, used in order when a card has none. */
const PHOTO_FALLBACK = ['team-strength', 'team-weights', 'team-nutrition', 'team-class'];

const ROLES = [
  {
    icon: 'barbell' as const,
    title: 'Strength & conditioning',
    body: 'Squat, bench, deadlift and the accessory work that keeps them moving. Programs run in cycles so the bar goes up every month, on paper, not in somebody’s memory.',
  },
  {
    icon: 'dumbbell' as const,
    title: 'Weight training',
    body: 'The floor coach who fixes your setup before it becomes an injury, loads the bar sensibly for your first month, and keeps the exercise card current.',
  },
  {
    icon: 'plate' as const,
    title: 'Diet planning',
    body: 'A nutritionist working from Odia home food — rice, dal, roti, eggs. The plate plan is written for your kitchen and reviewed with you, not photocopied.',
  },
  {
    icon: 'music' as const,
    title: 'Zumba & aerobics',
    body: 'Group classes for the days when the barbell is the wrong answer: high-energy music, low-impact options, nobody watching what you can’t do yet.',
  },
];

const BOOKING_STEPS = [
  {
    numeral: '01',
    title: 'Meet them on the free session',
    body: 'Your first hour is free and it includes a coach on the floor with you. That is the honest way to find out whether the pairing works.',
  },
  {
    numeral: '02',
    title: 'Ask for a coach by name',
    body: 'Once you have trained a few times, ask at the desk for the coach whose programme you want. Personal training is booked directly with them.',
  },
  {
    numeral: '03',
    title: 'Book the diet consult',
    body: 'Diet planning is separate from training. Ask for the nutritionist when you want the plate side of the plan written down.',
  },
];

export default function Trainers() {
  const { startLead } = useLead();

  useSeo({
    title: 'Our Trainers & Nutritionists — RS Fit Club, Bhubaneswar',
    description:
      'The coaches and nutritionists at RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar: strength and conditioning, weight training, diet planning, Zumba and aerobics.',
    path: '/trainers',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Trainers', path: '/trainers' },
    ]),
  });

  const trainers: TrainerCard[] = siteConfig.trainers.map((trainer, index) => ({
    name: trainer.name,
    speciality: trainer.speciality,
    credits: trainer.credits,
    photo: trainer.photo || PHOTO_FALLBACK[index % PHOTO_FALLBACK.length],
  }));

  return (
    <div className={s.page}>
      {/* -------------------------------------------------------- page header */}
      <header className={s.pageHeader}>
        <span className={s.gridLines} aria-hidden="true" />
        <RegistrationMarks inset={20} />

        <div className={cx('shell', s.headerInner)}>
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className={s.crumbSep} aria-hidden="true">
              /
            </span>
            <span className={s.crumbCurrent}>Trainers</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Crew
            </span>
            <p className="micro micro--accent">03 / Trainers</p>
            <MaskedLines
              as="h1"
              lines={['The people', 'counting your reps.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            A coach who knows your name, your old injury and which side you favour. The club is run
            by a team of coaches and nutritionists on one floor, so the plan on your card and the
            plan on your plate come from people who talk to each other.
          </p>
        </div>
      </header>

      {/* --------------------------------------------------------------- team */}
      <section className={cx('section', s.body)} aria-labelledby="team-title">
        <div className="shell">
          <SectionHead
            id="team-title"
            index="01"
            label="The line-up"
            title={['Four seats', 'on the floor.']}
            lead="Four roles on the floor: strength and conditioning, weight training, nutrition and group classes. Every one of them is a service the club already runs."
            ghost="Team"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {trainers.map((trainer, index) => (
              <article className={s.trainerCard} key={`${trainer.name}-${index}`}>
                <div className={s.trainerPhoto}>
                  <Photo
                    slug={trainer.photo}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw"
                    alt={`${trainer.name} — ${trainer.speciality}`}
                  />
                </div>

                <div className={s.trainerInfo}>
                  <h3 className={s.trainerName}>{trainer.name}</h3>
                  <p className={s.trainerSpec}>{trainer.speciality}</p>
                  <p className={s.trainerCreds}>{trainer.credits}</p>
                </div>
              </article>
            ))}
          </div>

          <p className={s.footnote}>
            <Icon name="check" size={14} />
            <span>{siteConfig.trainersHint}</span>
          </p>
        </div>
      </section>

      <hr className={s.separator} />

      {/* -------------------------------------------------------------- roles */}
      <section className={cx('section', s.bodySection)} aria-labelledby="roles-title">
        <div className="shell">
          <SectionHead
            id="roles-title"
            index="02"
            label="What each one does"
            title={['Four jobs,', 'one room.']}
            lead="Every role below maps to a service the club already runs — nothing on this page is a role the club does not staff."
            ghost="Roles"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {ROLES.map((role) => (
              <article className={s.card} key={role.title}>
                <span className={s.cardIcon}>
                  <Icon name={role.icon} size={18} />
                </span>
                <h3 className={s.cardTitle}>{role.title}</h3>
                <p className={s.cardBody}>{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------ booking */}
      <section className={cx('section', s.bodySection)} aria-labelledby="booking-title">
        <div className="shell">
          <SectionHead
            id="booking-title"
            index="03"
            label="Working with one"
            title={['How to get', 'a coach on you.']}
            lead="Group classes are walk-in. One-to-one and diet consults are arranged directly with the person doing the work."
            ghost="Book"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {BOOKING_STEPS.map((step) => (
              <article className={s.card} key={step.numeral}>
                <span className={s.cardNumeral}>{step.numeral}</span>
                <h3 className={s.cardTitle}>{step.title}</h3>
                <p className={s.cardBody}>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Train with the team once, free</h2>
            <p className={s.ctaBody}>
              Bring your goal and your week. A coach will map both onto the floor and write your
              first card before you leave.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'trainers-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/programs">
                See the programmes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
