import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

/* ---------------------------------------------------------------------------
   The eight programmes are the club's own verified services, so the grid is
   real content, not a shot list. What is still missing is timing and coaching
   — both are placeholders and are shown as such.

   GOALS maps a programme onto the goals in siteConfig.lead.goals, so the
   enquiry CTA on each card opens the form with the right option already
   chosen. Two programmes have no obvious single goal (one-to-one coaching and
   the exercise card are ways of training, not targets), so they leave the
   select untouched rather than guessing on the member's behalf.
   --------------------------------------------------------------------------- */
const GOALS: Record<string, string | undefined> = {
  'weight-training': 'Muscle gain',
  'strength-training': 'Strength',
  cardio: 'Fat loss',
  zumba: 'Zumba & aerobics',
  aerobics: 'Zumba & aerobics',
  'diet-planning': 'Diet plan',
  'personal-training': undefined,
  'exercise-card-planning': undefined,
};

const SESSION_STEPS = [
  {
    numeral: '01',
    title: 'Walk in and train',
    body: 'Your first session costs nothing. No card, no joining fee, no tour with a clipboard. You train, then you decide.',
    icon: 'check' as const,
  },
  {
    numeral: '02',
    title: 'Your card gets written',
    body: 'Sets, reps, rest and the progression for the next four weeks — on paper you carry, not in somebody’s memory.',
    icon: 'clipboard' as const,
  },
  {
    numeral: '03',
    title: 'A coach stays on the floor',
    body: 'Someone corrects your setup before it becomes an injury, and checks the card with you as the numbers move.',
    icon: 'whistle' as const,
  },
  {
    numeral: '04',
    title: 'Food joins the plan',
    body: 'The nutritionist works the same floor, so the plate plan and the training plan are written by people who talk to each other.',
    icon: 'plate' as const,
  },
];

export default function Programs() {
  const { startLead } = useLead();
  const { programs } = siteConfig;
  const { days, sessions, note, confirmed } = siteConfig.timetable;

  useSeo({
    title: 'Programs & Classes — RS Fit Club, Bhubaneswar',
    description:
      'Weight training, strength training, cardio, Zumba, aerobics, personal training, diet planning and exercise card planning at RS Fit Club, Mahavir Bazar, Bhubaneswar.',
    path: '/programs',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Programs', path: '/programs' },
    ]),
  });

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
            <span className={s.crumbCurrent}>Programs</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Iron
            </span>
            <p className="micro micro--accent">02 / Programs</p>
            <MaskedLines
              as="h1"
              lines={['Eight programmes,', 'one floor.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            Weight training, strength, cardio, Zumba, aerobics, personal training, diet planning and
            exercise cards — all of them run from the same room at Mahavir Bazar, so you are never
            sent somewhere else for the other half of the plan.
          </p>
        </div>
      </header>

      {/* ---------------------------------------------------------- programmes */}
      <section className={cx('section', s.body)} aria-labelledby="programme-list">
        <div className="shell">
          <SectionHead
            id="programme-list"
            index="01"
            label="What runs here"
            title={['Pick the work.', 'Then we write it.']}
            lead="Each programme below is one the club already runs. Coaches will tell you which two or three suit your week — nobody needs all eight."
            ghost="Eight"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {programs.map((program) => (
              /* The id is a real deep-link target: the footer and the home page
                 both link to /programs#<slug>. */
              <article className={s.card} id={program.slug} key={program.slug}>
                <span className={s.cardIcon}>
                  <Icon name={program.icon} size={18} />
                </span>

                <span className={s.cardNumeral}>{program.numeral}</span>
                <h3 className={s.cardTitle}>{program.title}</h3>
                <p className={s.cardBody}>{program.benefit}</p>

                <ul className={s.detailList}>
                  <li className={s.detailItem}>
                    <Icon name="check" size={13} />
                    <span>{program.detail}</span>
                  </li>
                </ul>

                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="arrow-right"
                    onClick={() =>
                      startLead({
                        goal: GOALS[program.slug],
                        source: `program:${program.slug}`,
                      })
                    }
                  >
                    Ask about {program.title.toLowerCase()}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <p className={s.footnote}>
            <Icon name="check" size={14} />
            <span>
              These are the services the club advertises today. No programme here is a package that
              does not exist yet.
            </span>
          </p>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ----------------------------------------------------- how a session runs */}
      <section className={cx('section', s.bodySection)} aria-labelledby="session-title">
        <div className="shell">
          <SectionHead
            id="session-title"
            index="02"
            label="A first session"
            title={['How an hour', 'actually runs.']}
            lead="Nothing about the first visit is a sales meeting. Four things happen, in this order."
            ghost="Hour"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {SESSION_STEPS.map((step) => (
              <article className={s.card} key={step.numeral}>
                <span className={s.cardIcon}>
                  <Icon name={step.icon} size={18} />
                </span>
                <span className={s.cardNumeral}>{step.numeral}</span>
                <h3 className={s.cardTitle}>{step.title}</h3>
                <p className={s.cardBody}>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------ the week */}
      <section className={cx('section', s.bodySection)} aria-labelledby="week-title">
        <div className="shell">
          <SectionHead
            id="week-title"
            index="03"
            label="The week"
            title={['Which class', 'falls when.']}
            lead="The programmes and the days are confirmed. The clock times are not — they stay visibly blank until the club sends its slots."
            ghost="Week"
            actions={
              <Button variant="secondary" icon="arrow-right" to="/schedule">
                See the full timetable
              </Button>
            }
          />

          {/* A preview, not a second timetable: the schedule page owns the
              7-column grid with times. Here each day shows which programmes
              run, so the list stays readable on a phone. */}
          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {days.map((day) => {
              const daySessions = sessions.filter((session) => session.day === day);
              return (
                <article className={s.card} key={day}>
                  <span className={s.cardNumeral}>
                    {String(daySessions.length).padStart(2, '0')} sessions
                  </span>
                  <h3 className={s.cardTitle}>{day}</h3>
                  <ul className={s.detailList}>
                    {daySessions.map((session, index) => (
                      <li className={s.detailItem} key={`${day}-${session.program}-${index}`}>
                        <Icon name="check" size={13} />
                        <span>{session.program}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <p className={s.footnote}>
            <Icon name="clock" size={14} />
            <span>{confirmed ? 'Times confirmed by the club.' : note}</span>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Try the one you are unsure about</h2>
            <p className={s.ctaBody}>
              Bring your week with you. The team will fit two or three of these around your work
              hours and write the first card on the spot. The session is free.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'programs-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/membership">
                See membership plans
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
