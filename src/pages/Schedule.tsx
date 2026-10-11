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
   The full weekly timetable, read from siteConfig.timetable, plus the opening
   hours from siteConfig.hours. The desk changes a slot in one place and this
   page, the home page grid and the structured data all follow.
   --------------------------------------------------------------------------- */

type Focus = 'strength' | 'cardio' | 'dance' | 'coach' | 'open';

/** Focus code -> shared class. Same five codes as the home timetable. */
const CHIP: Record<Focus, string> = {
  strength: 'focusStrength',
  cardio: 'focusCardio',
  dance: 'focusDance',
  coach: 'focusCoach',
  open: 'focusOpen',
};

const LEGEND: Array<{ focus: Focus; label: string }> = [
  { focus: 'strength', label: 'Weights & strength' },
  { focus: 'cardio', label: 'Cardio' },
  { focus: 'dance', label: 'Zumba & aerobics' },
  { focus: 'coach', label: 'One-to-one' },
  { focus: 'open', label: 'Open floor' },
];

export default function Schedule() {
  const { startLead } = useLead();
  const { days, sessions, note } = siteConfig.timetable;
  const { rows: hourRows, alwaysOpen } = siteConfig.hours;
  /* Both read the same config the JSON-LD is built from, so the page, the
     schema and the contact card can never quote different hours. */
  const hoursNote = alwaysOpen
    ? 'The floor never closes — train whenever you like.'
    : `${hourRows[0].time}, every day. The floor stays open between classes for your own sessions.`;

  useSeo({
    title: 'Class Schedule & Timetable — RS Fit Club, Bhubaneswar',
    description:
      'Weekly class timetable for RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar: weights, cardio, Zumba, aerobics and one-to-one slots.',
    path: '/schedule',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Schedule', path: '/schedule' },
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
            <span className={s.crumbCurrent}>Schedule</span>
          </nav>
          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Week
            </span>
            <p className="micro micro--accent">06 / Schedule</p>
            <MaskedLines
              as="h1"
              lines={['Every class,', 'every day.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>{' '}
          <p className={cx('lead', s.heroLead)}>
            Weights, cardio, Zumba, aerobics and one-to-one slots across the week. Classes run
            inside the club&rsquo;s opening hours, and the floor stays open between them for your
            own sessions and your exercise card.
          </p>
        </div>
      </header>

      {/* -------------------------------------------------------- week grid */}
      <section className={cx('section', s.body)} aria-labelledby="week-title">
        <div className="shell">
          <SectionHead
            id="week-title"
            index="01"
            label="The week"
            title={['Seven days,', 'four kinds of work.']}
            lead="Each slot is colour-coded by what it is, so you can scan a week for the classes you actually want. Group classes are walk-in; one-to-one is booked with the coach."
            ghost="Grid"
          />

          <div className={s.schedGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {days.map((day) => {
              const daySessions = sessions.filter((session) => session.day === day);
              return (
                <div className={s.schedDay} key={day}>
                  <div className={s.schedDayHead}>
                    <span>{day}</span>
                    <span className="micro">{String(daySessions.length).padStart(2, '0')}</span>
                  </div>

                  {daySessions.map((session, index) => (
                    <div className={s.schedSlot} key={`${day}-${session.program}-${index}`}>
                      <span className={s.schedTime}>{session.time}</span>
                      <span className={s.schedName}>{session.program}</span>
                      <span className={cx(s.tag, s[CHIP[session.focus as Focus]])}>
                        {LEGEND.find((entry) => entry.focus === session.focus)?.label ?? 'Session'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: 'var(--sp-4)',
            }}
          >
            {LEGEND.map(({ focus, label }) => (
              <span key={focus} className={cx(s.tag, s[CHIP[focus]])}>
                {label}
              </span>
            ))}
          </div>

          <p className={s.footnote}>
            <Icon name="clock" size={14} />
            <span>{note}</span>
          </p>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ---------------------------------------------------------- hours */}
      <section className={cx('section', s.bodySection)} aria-labelledby="hours-title">
        <div className="shell">
          <SectionHead
            id="hours-title"
            index="02"
            label="Opening hours"
            title={['When the doors', 'are open.']}
            lead="Classes run inside these hours. The floor is open the rest of the time for your own sessions and for the exercise cards."
            ghost="Open"
          />

          <div className={s.splitGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <div>
              {alwaysOpen ? (
                <div className={s.infoRow}>
                  <Icon name="clock" size={15} />
                  <span>Open 24 hours a day, seven days a week.</span>
                </div>
              ) : (
                <table className={s.hoursTable}>
                  <caption className="sr-only">Opening hours</caption>
                  <tbody>
                    {hourRows.map((row) => (
                      <tr className={s.hoursRow} key={row.days}>
                        <th className={s.hoursDay} scope="row">
                          {row.days}
                        </th>
                        <td className={s.hoursTime}>{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <p className={s.footnote}>
                <Icon name="check" size={14} />
                <span>{hoursNote}</span>
              </p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--sp-3)', alignContent: 'start' }}>
              <h3 className={s.cardTitle}>Holidays and festivals</h3>
              <p className={s.cardBody}>
                The club shuts for a handful of days a year — during Durga Puja, on maintenance days
                and when a festival keeps the whole neighbourhood off the road. Those dates are
                posted at the desk a week ahead and sent to members on the club&rsquo;s channels, so
                call before travelling on a festival morning.
              </p>

              <div className={s.infoRow}>
                <Icon name="pin" size={15} />
                <span>
                  {siteConfig.business.area}, {siteConfig.business.city},{' '}
                  {siteConfig.business.state} — walk in from the main road.
                </span>
              </div>

              <p className={s.footnote}>
                <Icon name="clock" size={14} />
                <span>
                  Slots move during exams and festivals — the desk has today&rsquo;s list.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------- fit a slot */}
      <section className={cx('section', s.bodySection)} aria-labelledby="fit-title">
        <div className="shell">
          <SectionHead
            id="fit-title"
            index="03"
            label="Fit your week"
            title={['Tell us when', 'you can train.']}
            lead="If none of these days work, say so. The club shifts sessions to when members can actually reach the floor."
            ghost="Time"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <article className={s.card}>
              <span className={s.cardIcon}>
                <Icon name="clock" size={18} />
              </span>
              <h3 className={s.cardTitle}>Morning slots</h3>
              <p className={s.cardBody}>
                Early sessions before work, for members who want the day&rsquo;s training finished
                before the traffic starts.
              </p>
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'schedule-morning' })}
                >
                  Ask for mornings
                </Button>
              </div>
            </article>

            <article className={s.card}>
              <span className={s.cardIcon}>
                <Icon name="clock" size={18} />
              </span>
              <h3 className={s.cardTitle}>Evening slots</h3>
              <p className={s.cardBody}>
                After-work sessions, the busiest hours on the floor. Zumba and aerobics classes run
                in these blocks.
              </p>
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'schedule-evening' })}
                >
                  Ask for evenings
                </Button>
              </div>
            </article>

            <article className={s.card}>
              <span className={s.cardIcon}>
                <Icon name="whistle" size={18} />
              </span>
              <h3 className={s.cardTitle}>One-to-one</h3>
              <p className={s.cardBody}>
                Personal training is booked around your calendar rather than the class grid — it
                rarely appears on a timetable at all.
              </p>
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'schedule-pt' })}
                >
                  Ask about one-to-one
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Come and train the first one free</h2>
            <p className={s.ctaBody}>
              Pick any class on this page. Walk in for it, see how the floor runs, and decide about
              membership afterwards.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'schedule-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/programs">
                What runs here
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
