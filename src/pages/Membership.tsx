import { Link } from 'react-router-dom';
import { siteConfig, isReal } from '../data/siteConfig';
import type { Plan } from '../data/siteConfig';
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
   Membership. Plan lengths, inclusions and rates all read from
   siteConfig.membership, so the desk changes a price in one place and every
   card, the home page section and the metadata follow.
   --------------------------------------------------------------------------- */

const JOIN_STEPS = [
  {
    numeral: '01',
    title: 'Train once for free',
    body: 'Walk in, use the floor, take a group class. No card details, no joining fee, no obligation at the desk.',
  },
  {
    numeral: '02',
    title: 'Pick the length',
    body: 'Thirty days if you are testing the habit, ninety if you want the mirror to notice, a year if you are done starting over.',
  },
  {
    numeral: '03',
    title: 'Your card is written',
    body: 'Sets, reps, rest and the plan for the next month — adjusted as the numbers move. Diet consults can be added at any time.',
  },
];

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

function PlanCard({ plan }: { plan: Plan }) {
  const { startLead } = useLead();

  return (
    <article className={cx(s.card, plan.featured && s.cardFeatured)}>
      {plan.featured ? <span className={s.tag}>Most chosen</span> : null}

      <span className={s.cardNumeral}>{plan.duration}</span>
      <h3 className={s.cardTitle}>{plan.name}</h3>

      {/* The rate is printed straight from config; no price, no line. */}
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          lineHeight: 1,
        }}
      >
        {isReal(plan.price) ? (
          <>
            ₹{formatPrice(Number(plan.price))}
            {isReal(plan.wasPrice) ? (
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-faint)',
                  textDecoration: 'line-through',
                }}
              >
                ₹{formatPrice(Number(plan.wasPrice))}
              </span>
            ) : null}
          </>
        ) : null}
      </p>

      <p className={s.cardBody}>{plan.tagline}</p>

      <ul className={s.detailList}>
        {plan.includes.map((item) => (
          <li className={s.detailItem} key={item}>
            <Icon name="check" size={13} />
            <span>
              {item.replace(/\s\*$/, '')}
              {item.endsWith('*') ? <span className="tag-soft">Add-on</span> : null}
            </span>
          </li>
        ))}
      </ul>

      <div>
        <Button
          variant={plan.featured ? 'primary' : 'secondary'}
          block
          icon="arrow-right"
          onClick={() => startLead({ plan: plan.name, source: `plan:${plan.id}` })}
        >
          Ask about {plan.name.toLowerCase()}
        </Button>
      </div>
    </article>
  );
}

export default function Membership() {
  const { startLead } = useLead();
  const { plans, note } = siteConfig.membership;

  useSeo({
    title: 'Membership & Pricing — RS Fit Club, Bhubaneswar',
    description:
      'Monthly, quarterly and annual membership at RS Fit Club, Mahavir Bazar, Samantarapur, Bhubaneswar, with personal training and diet planning add-ons.',
    path: '/membership',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Membership', path: '/membership' },
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
            <span className={s.crumbCurrent}>Membership</span>
          </nav>

          <div className={s.heroHead}>
            <span className={cx('ghost', s.ghost)} aria-hidden="true">
              Join
            </span>
            <p className="micro micro--accent">05 / Membership</p>
            <MaskedLines
              as="h1"
              lines={['Pick a length.', 'Not a lock-in.']}
              className={cx('display-1', s.heroTitle)}
            />
          </div>

          <p className={cx('lead', s.heroLead)}>
            Every plan runs the same floor and the same group classes — the only thing that changes
            is how long you are committed for. Personal training and diet consults are add-ons on
            top, never bundled into a price that hides them.
          </p>
        </div>
      </header>

      {/* -------------------------------------------------------------- plans */}
      <section className={cx('section', s.body)} aria-labelledby="plans-title">
        <div className="shell">
          <SectionHead
            id="plans-title"
            index="01"
            label="The plans"
            title={['Three lengths.', 'Same floor.']}
            lead="What each plan includes is fixed and listed in full. The rates below are the ones the desk charges, and the add-ons on top of them are marked."
            ghost="Plans"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <p className={s.footnote}>
            <Icon name="check" size={14} />
            <span>{note}</span>
          </p>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------------ add-ons */}
      <section className={cx('section', s.bodySection)} aria-labelledby="addons-title">
        <div className="shell">
          <SectionHead
            id="addons-title"
            index="02"
            label="On top"
            title={['Added when', 'you need it.']}
            lead="Two services cost extra because they cost the club extra: a coach dedicated to one person, and a nutritionist writing for one kitchen."
            ghost="Extras"
          />

          <div className={s.splitGrid} style={{ marginTop: 'var(--sp-6)' }}>
            <article className={s.card}>
              <span className={s.cardIcon}>
                <Icon name="whistle" size={18} />
              </span>
              <span className={s.cardNumeral}>Add-on 01</span>
              <h3 className={s.cardTitle}>Personal training</h3>
              <p className={s.cardBody}>
                One coach, one plan, your calendar. Counted reps, corrected setup, and a session
                that moves at your pace instead of the class&rsquo;s. Available on any plan, in
                blocks the desk will quote you.
              </p>
            </article>

            <article className={s.card}>
              <span className={s.cardIcon}>
                <Icon name="plate" size={18} />
              </span>
              <span className={s.cardNumeral}>Add-on 02</span>
              <h3 className={s.cardTitle}>Diet consults</h3>
              <p className={s.cardBody}>
                A nutritionist reads your routine and writes a plate plan around Odia home food —
                rice, dal, roti, eggs — instead of a photocopied chart. The consult rate depends on
                how often you want to be reviewed.
              </p>
            </article>
          </div>
        </div>
      </section>

      <hr className={s.separator} />

      {/* ------------------------------------------------------- how joining */}
      <section className={cx('section', s.bodySection)} aria-labelledby="joining-title">
        <div className="shell">
          <SectionHead
            id="joining-title"
            index="03"
            label="Joining"
            title={['Three steps,', 'no paperwork.']}
            lead="Nothing is collected online. The form on this site gets you a call back; the desk handles the rest."
            ghost="Start"
          />

          <div className={s.triGrid} style={{ marginTop: 'var(--sp-6)' }}>
            {JOIN_STEPS.map((step) => (
              <article className={s.card} key={step.numeral}>
                <span className={s.cardNumeral}>{step.numeral}</span>
                <h3 className={s.cardTitle}>{step.title}</h3>
                <p className={s.cardBody}>{step.body}</p>
              </article>
            ))}
          </div>

          <div className={s.infoRow} style={{ marginTop: 'var(--sp-4)' }}>
            <Icon name="check" size={15} />
            <span>
              Ask at the desk for the joining fee, whether a membership can be frozen, and which
              payment methods they accept. Those terms are set by the club, not by this page — so
              this page does not guess at them.
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className={cx('section', s.bodySection)}>
        <div className="shell">
          <div className={s.ctaStrip}>
            <h2 className={s.ctaTitle}>Start with the free session</h2>
            <p className={s.ctaBody}>
              Train once before you pay anything. If the floor is not for you, you have lost an hour
              and nothing else.
            </p>
            <div className={s.ctaActions}>
              <Button
                variant="primary"
                icon="arrow-right"
                onClick={() => startLead({ source: 'membership-cta' })}
              >
                Claim your free trial
              </Button>
              <Button variant="secondary" to="/programs">
                See what runs here
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
