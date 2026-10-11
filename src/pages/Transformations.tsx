import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { BeforeAfter } from '../components/ui/BeforeAfter';
import { Photo } from '../components/ui/Photo';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

/* ---------------------------------------------------------------------------
   Proof of results, done honestly.

   The slider and the story cards both read from config — the pair from
   src/data/photos.ts, the members from siteConfig.transformations. The variance
   line is not decoration: it is the sentence that keeps a gym out of trouble.
   --------------------------------------------------------------------------- */

const RULES = [
  {
    icon: 'check' as const,
    title: 'Written consent, every time',
    body: 'A photo of a member is published only after that member agrees in writing to it being on this site. No exceptions, and no “it’s only WhatsApp”.',
  },
  {
    icon: 'check' as const,
    title: 'Same light, same spot',
    body: 'Before and after are shot in the same corner, under the same lights, in roughly the same posture. If a pair only works because the lighting changed, it does not go up.',
  },
  {
    icon: 'check' as const,
    title: 'The real timeline, plateaus included',
    body: 'How long it actually took, including the months where nothing moved. A six-week miracle is usually a six-week cut, and this page does not sell cuts.',
  },
  {
    icon: 'check' as const,
    title: 'Results vary, and it says so',
    body: 'The note under every pair states plainly that results differ from person to person. No promises about kilograms, weeks or inches.',
  },
];

export default function Transformations() {
  const { startLead } = useLead();
  const stories = siteConfig.transformations;

  useSeo({
    title: 'Member Transformations — RS Fit Club, Bhubaneswar',
    description:
      'Before and after comparisons, goals and honest timelines from members training at RS Fit Club, Mahavir Bazar, Bhubaneswar.',
    path: '/transformations',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Transformations', path: '/transformations' },
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
            <span className={s.crumbCurrent}>Transformations</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Proof
            </span>
            <p className="micro micro--accent">04 / Transformations</p>
            <MaskedLines
              as="h1"
              lines={['Real members.', 'Real timelines.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            Drag the handle below to see how one member changed shape over their training block.
            Every pair on this page was shot in the same corner under the same lights, and none of
            them goes up without that member&rsquo;s written consent.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------ slider */}
      <section className={cx('section', s.body)} aria-labelledby="compare-title">
        <div className="shell">
          <SectionHead
            id="compare-title"
            index="01"
            label="Compare"
            title={['Drag the line.', 'See the work.']}
            lead="Same spot, same lights, months apart. Slide it across and watch the shoulders, not just the waistline."
            ghost="Slider"
          />

          <div className={s.splitGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <div>
              <div className={s.photoFrame}>
                <BeforeAfter
                  label="Compare a member's before and after photographs"
                  beforeLabel="Before"
                  afterLabel="After"
                  before={
                    <Photo
                      slug="transform-before"
                      sizes="(min-width: 768px) 46vw, 92vw"
                      alt="Member at the start of their training block"
                    />
                  }
                  after={
                    <Photo
                      slug="transform-after"
                      sizes="(min-width: 768px) 46vw, 92vw"
                      alt="Member after their training block"
                    />
                  }
                />
              </div>

              <p className={s.footnote}>
                <Icon name="check" size={14} />
                <span>{siteConfig.transformationsNote}</span>
              </p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--sp-4)', alignContent: 'start' }}>
              <h3 className={s.cardTitle}>What a published pair carries</h3>
              <ul className={s.detailList}>
                <li className={s.detailItem}>
                  <Icon name="check" size={13} />
                  <span>The member&rsquo;s first name, or initials if they prefer.</span>
                </li>
                <li className={s.detailItem}>
                  <Icon name="check" size={13} />
                  <span>The goal they walked in with, in their own words.</span>
                </li>
                <li className={s.detailItem}>
                  <Icon name="check" size={13} />
                  <span>How long it took, counted in weeks and months.</span>
                </li>
                <li className={s.detailItem}>
                  <Icon name="check" size={13} />
                  <span>Which programme they trained and who coached them.</span>
                </li>
              </ul>

              <div className={s.infoRow}>
                <Icon name="shield" size={15} />
                <span>
                  No medical claims, no supplements, no &ldquo;guaranteed&rdquo; anything. Training
                  and diet change a body at different speeds for different people.
                </span>
              </div>

              <div>
                <Button
                  variant="primary"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'transformations-cta' })}
                >
                  Start your own block
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------- stories */}
      <section className={cx('section', s.bodySection)} aria-labelledby="stories-title">
        <div className="shell">
          <SectionHead
            id="stories-title"
            index="02"
            label="Member stories"
            title={['Who started', 'where.']}
            lead="One entry per member: the goal they arrived with, what they trained, how long it took and what actually changed."
            ghost="Stories"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {stories.length > 0 ? (
              stories.map((story) => (
                <article className={s.card} key={story.name}>
                  <span className={s.cardNumeral}>{story.duration}</span>
                  <h3 className={s.cardTitle}>{story.name}</h3>
                  <p className={s.cardBody}>{story.goal}</p>
                  <ul className={s.detailList}>
                    <li className={s.detailItem}>
                      <Icon name="check" size={13} />
                      <span>{story.result}</span>
                    </li>
                  </ul>
                </article>
              ))
            ) : (
              <article className={s.card} style={{ gridColumn: '1 / -1' }}>
                <span className={s.cardNumeral}>With consent</span>
                <h3 className={s.cardTitle}>Yours could be the next card</h3>
                <p className={s.cardBody}>
                  Every story here carries three things: a before and after pair the member agreed
                  to publish, the goal they started with, and the honest length of time it took.
                </p>
                <p className={s.cardBody}>
                  Train for a few months and the desk will ask whether you want yours on the page.
                  If you would rather stay off it, that is the end of the conversation.
                </p>
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="arrow-right"
                    onClick={() => startLead({ source: 'transformations-share' })}
                  >
                    Start your own block
                  </Button>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* -------------------------------------------------------------- rules */}
      <section className={cx('section', s.bodySection)} aria-labelledby="rules-title">
        <div className="shell">
          <SectionHead
            id="rules-title"
            index="03"
            label="The rules"
            title={['Four things', 'we will not do.']}
            lead="Four rules, and the reason a pair published on this page is worth trusting. They also explain why the page is short: nothing goes up until it is true."
            ghost="Rules"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {RULES.map((rule) => (
              <article className={s.card} key={rule.title}>
                <span className={s.cardIcon}>
                  <Icon name={rule.icon} size={18} />
                </span>
                <h3 className={s.cardTitle}>{rule.title}</h3>
                <p className={s.cardBody}>{rule.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Your before photo is today</h2>
            <p className={s.ctaBody}>
              Everyone&rsquo;s first frame looks the same: not the point you wanted to start from.
              Train once free and start the timeline anyway.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'transformations-end-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/schedule">
                See the timetable
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
