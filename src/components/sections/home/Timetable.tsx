import { useMemo, useState } from 'react';
import { siteConfig } from '../../../data/siteConfig';
import { SectionHead } from '../../ui/SectionHead';
import { Icon } from '../../ui/Icon';
import { cx } from '../../../utils/cx';
import styles from './Timetable.module.css';

/* ---------------------------------------------------------------------------
   Weekly schedule, read from siteConfig.timetable. Sessions are grouped by day
   on the desktop grid and by tab on a phone; the note under the grid is the
   line the desk gives for a slot that has moved.
   --------------------------------------------------------------------------- */

type Focus = 'strength' | 'cardio' | 'dance' | 'coach' | 'open';

const CHIP: Record<Focus, string> = {
  strength: 'chipStrength',
  cardio: 'chipCardio',
  dance: 'chipDance',
  coach: 'chipCoach',
  open: 'chipOpen',
};

const LEGEND: Array<{ focus: Focus; label: string }> = [
  { focus: 'strength', label: 'Weights & strength' },
  { focus: 'cardio', label: 'Cardio' },
  { focus: 'dance', label: 'Zumba & aerobics' },
  { focus: 'coach', label: 'One-to-one' },
  { focus: 'open', label: 'Open floor' },
];

function SessionRow({
  time,
  program,
  focus,
  className,
}: {
  time: string | null;
  program: string;
  focus: Focus;
  className?: string;
}) {
  return (
    <li className={cx(styles.session, className)}>
      <span className={styles.sessionTime}>{time}</span>
      <span className={styles.sessionName}>{program}</span>
      <span className={cx(styles.chip, styles[CHIP[focus]])}>
        {focus === 'open' ? 'Open floor' : LEGEND.find((l) => l.focus === focus)?.label}
      </span>
    </li>
  );
}

export function Timetable() {
  const { days, sessions, note } = siteConfig.timetable;
  /* "Always open" is only shown when the club confirms 24-hour access. */
  const { alwaysOpen } = siteConfig.hours;
  const [activeDay, setActiveDay] = useState<string>(days[0]);

  const byDay = useMemo(() => {
    const map = new Map<string, typeof sessions>();
    for (const day of days)
      map.set(
        day,
        sessions.filter((s) => s.day === day),
      );
    return map;
  }, [days, sessions]);

  const todaySessions = byDay.get(activeDay) ?? [];

  return (
    <section className={cx('section', styles.section)} aria-labelledby="timetable-title">
      <div className="shell">
        <SectionHead
          id="timetable-title"
          index="06"
          label="The week"
          title={['Your week,', 'already planned.']}
          lead="Weights days, cardio days, and the classes that make the rest of the week possible. Pick a day to see what runs."
          ghost="Week"
          actions={
            alwaysOpen ? <span className="micro micro--accent">Open 24 hours</span> : undefined
          }
        />

        {/* ---------------------------------------------------- desktop grid */}
        <div className={styles.deskGrid}>
          {days.map((day) => {
            const daySessions = byDay.get(day) ?? [];
            return (
              <div className={styles.deskDay} key={day}>
                <div className={styles.deskDayHead}>
                  <span className={styles.deskDayName}>{day}</span>
                  <span className={styles.deskDayCount}>
                    {String(daySessions.length).padStart(2, '0')}
                  </span>
                </div>
                {daySessions.length ? (
                  <ul>
                    {daySessions.map((session, index) => (
                      <SessionRow
                        key={`${day}-${index}`}
                        time={session.time}
                        program={session.program}
                        focus={session.focus as Focus}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyDay}>Rest day</p>
                )}
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------ mobile tabs */}
        <div className={styles.mobileWrap}>
          <div className={styles.tabs} role="tablist" aria-label="Choose a day">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                role="tab"
                id={`tab-${day}`}
                aria-selected={activeDay === day}
                aria-controls="day-panel"
                className={styles.tab}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <ul
            className={styles.list}
            id="day-panel"
            role="tabpanel"
            aria-labelledby={`tab-${activeDay}`}
            tabIndex={-1}
          >
            {todaySessions.length ? (
              todaySessions.map((session, index) => (
                <SessionRow
                  key={`${activeDay}-${index}`}
                  time={session.time}
                  program={session.program}
                  focus={session.focus as Focus}
                  className={styles.mobileSession}
                />
              ))
            ) : (
              <li className={styles.mobileSession}>
                <span className={styles.sessionTime}>—</span>
                <span className={styles.sessionName}>Rest day</span>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.legend}>
          {LEGEND.map(({ focus, label }) => (
            <span key={focus} className={cx(styles.chip, styles[CHIP[focus]])}>
              {label}
            </span>
          ))}
        </div>

        {note ? (
          <p className={styles.note}>
            <Icon name="clock" size={15} />
            <span>{note}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
