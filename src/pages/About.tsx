import { Link } from 'react-router-dom';
import { siteConfig, isReal, hoursLine } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { SectionHead } from '../components/ui/SectionHead';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { OwnerFigure } from '../components/ui/OwnerFigure';
import { Photo } from '../components/ui/Photo';
import { cx } from '../utils/cx';
import s from './InteriorPage.module.css';

const VALUES = [
  {
    icon: 'shield' as const,
    title: 'Numbers you can check',
    body: 'The 4.8 rating and the reviews come straight off the club’s Google listing, and the timetable is the timetable the desk actually runs. Where a figure is not published, we say so instead of rounding up.',
  },
  {
    icon: 'whistle' as const,
    title: 'Coaches on the floor',
    body: 'The team trains alongside you. A plan written on paper you carry, reviewed every month and corrected every session.',
  },
  {
    icon: 'plate' as const,
    title: 'Diet that fits your kitchen',
    body: 'Nutritionists build plans around Odia home food — rice, dal, eggs, roti. No photocopied charts, no imported supplements.',
  },
  {
    icon: 'clipboard' as const,
    title: 'Exercise cards, not guesswork',
    body: 'Every set, rep and rest period is written down. You carry your card, your coach updates it, and the guessing stops.',
  },
];

export default function About() {
  const { startLead } = useLead();

  useSeo({
    title: 'About RS Fit Club — Gym in Samantarapur, Bhubaneswar',
    description:
      'The story behind RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar: the founder, the coaches and the floor.',
    path: '/about',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  });

  const owner = siteConfig.owner;

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
            <span className={s.crumbCurrent}>About</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Story
            </span>
            <p className="micro micro--accent">01 / About</p>
            <MaskedLines
              as="h1"
              lines={['The story behind', 'the floor.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            Where RS Fit Club came from, who runs it, and why a gym in Samantarapur looks like this
            one.
          </p>
        </div>
      </header>

      {/* ----------------------------------------------------- founder section */}
      <section className={cx('section', s.body)} aria-labelledby="founder-about">
        <div className="shell">
          <SectionHead
            id="founder-about"
            index="01"
            label="The person behind it"
            title={['He owns', 'the floor.']}
            ghost="Coach"
            tight
          />

          <div className={s.splitGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <div className={s.photoFrame} style={{ aspectRatio: '3/4' }}>
              <OwnerFigure renderWidth={620} sizes="(max-width: 767px) 90vw, 42vw" />
            </div>

            <div style={{ display: 'grid', gap: 'var(--sp-4)', alignContent: 'start' }}>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                &ldquo;{owner.pullQuote}&rdquo;
              </blockquote>

              <p style={{ margin: 0, fontSize: 'var(--fs-small)', color: 'var(--text-dim)' }}>
                {owner.name} — {owner.role}
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 'var(--sp-2)',
                  fontSize: 'var(--fs-body)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--text-dim)',
                }}
              >
                {owner.bio.map((paragraph) => (
                  <p key={paragraph} style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {owner.credentials.map((credential) => (
                  <span className={s.chip} key={credential}>
                    <Icon name="check" size={12} />
                    {credential}
                  </span>
                ))}
              </div>

              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'var(--fs-small)',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                }}
              >
                {owner.signatureLine}
              </p>

              <div>
                <Button
                  variant="primary"
                  icon="arrow-right"
                  onClick={() => startLead({ source: 'about-founder' })}
                >
                  Train with the team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- values / why */}
      <hr className={s.separator} />

      <section className={cx('section', s.bodySection)} aria-labelledby="values-title">
        <div className="shell">
          <SectionHead
            id="values-title"
            index="02"
            label="What we do not do"
            title={['Honest by design,', 'not by slogan.']}
            lead="Four rules the club runs by. None of them are marketing copy — they are the constraints the website was built around."
            ghost="Rules"
          />

          <div className={s.quadGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {VALUES.map((v) => (
              <article className={s.card} key={v.title}>
                <span className={s.cardIcon}>
                  <Icon name={v.icon} size={18} />
                </span>
                <h3 className={s.cardTitle}>{v.title}</h3>
                <p className={s.cardBody}>{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ the floor */}
      <hr className={s.separator} />

      <section className={cx('section', s.bodySection)} aria-labelledby="floor-title">
        <div className="shell">
          <SectionHead
            id="floor-title"
            index="03"
            label="The floor"
            title={['Mahavir Bazar,', 'Samantarapur.']}
            lead={`Walk in from the main road. ${siteConfig.business.area}, ${siteConfig.business.city}, ${siteConfig.business.state}. Weight training, cardio, Zumba, aerobics, personal training and diet planning — one building, one team.`}
            ghost="Floor"
          />

          <div className={s.splitGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <div className={s.photoFrame} style={{ aspectRatio: '16/10' }}>
              <Photo slug="floor-wide" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div style={{ display: 'grid', gap: 'var(--sp-3)', alignContent: 'start' }}>
              <h3 className={s.cardTitle}>Eight programmes, one location</h3>
              <p className={s.cardBody}>
                The club runs weight training, strength training, cardio, Zumba, aerobics, personal
                training, diet planning and exercise card planning on a single floor. Coaches and
                nutritionists work in the same room — the plan on your card and the plate plan in
                your kitchen are written by people who talk to each other.
              </p>
              <p className={s.cardBody}>
                {isReal(siteConfig.location.streetLine)
                  ? `${siteConfig.location.streetLine}, ${siteConfig.location.area}, ${siteConfig.location.city} ${siteConfig.location.pin}`
                  : `${siteConfig.business.area}, ${siteConfig.business.city}, ${siteConfig.business.state}`}
              </p>

              <div className={s.footnote}>
                <Icon name="clock" size={14} />
                <span>Open {hoursLine} for training, classes and diet consults.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Come see it for yourself</h2>
            <p className={s.ctaBody}>
              Your first session is free. No sign-up fee, no pressure, no small print. Walk in,
              lift, and decide afterwards.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'about-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/">
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
