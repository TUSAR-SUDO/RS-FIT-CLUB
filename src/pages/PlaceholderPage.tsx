import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { breadcrumbSchema } from '../utils/structuredData';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cx } from '../utils/cx';
import styles from './PlaceholderPage.module.css';

export interface PlaceholderPageProps {
  index: string;
  /** Nav label, also used in the breadcrumb. */
  label: string;
  /** Headline lines. */
  title: string[];
  lead: string;
  /** Ghost word behind the title. */
  ghost: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  /** What this page will contain in Phase 2. */
  coming: string[];
  note?: string;
}

/**
 * Every Phase 1 stub uses this. It is deliberately finished-looking: a real
 * breadcrumb, a headline that behaves like the rest of the site, and a panel
 * that lists exactly what will fill the page next. No lorem ipsum, no empty
 * grey boxes, and always a route back to the one form that matters.
 */
export function PlaceholderPage({
  index,
  label,
  title,
  lead,
  ghost,
  seoTitle,
  seoDescription,
  path,
  coming,
  note,
}: PlaceholderPageProps) {
  const { startLead } = useLead();

  useSeo({
    title: seoTitle,
    description: seoDescription,
    path,
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: label, path },
    ]),
  });

  return (
    <div className={styles.wrap}>
      <span className={styles.gridLines} aria-hidden="true" />
      <RegistrationMarks inset={20} />

      <div className={cx('shell', styles.inner)}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className={styles.crumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.crumbCurrent}>{label}</span>
        </nav>

        <div className={styles.head}>
          <span className={cx('ghost', styles.ghost)} aria-hidden="true">
            {ghost}
          </span>
          <p className="micro micro--accent">
            {index} / {label}
          </p>
          <MaskedLines as="h1" lines={title} className={cx('display-1', styles.title)} />
        </div>

        <p className={cx('lead', styles.lead)}>{lead}</p>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.badge}>
              <Icon name="clock" size={12} />
              Coming in Phase 2
            </span>
            <span className="micro">{String(coming.length).padStart(2, '0')} blocks planned</span>
          </div>

          <h2 className={styles.panelTitle}>What lands on this page next</h2>

          <ul className={styles.list}>
            {coming.map((item, itemIndex) => (
              <li className={styles.item} key={item}>
                <span className={styles.itemNum}>{String(itemIndex + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {note ? <p className={styles.note}>{note}</p> : null}

          <div className={styles.actions}>
            <Button
              variant="primary"
              icon="arrow-right"
              onClick={() => startLead({ source: path })}
            >
              Claim your free trial
            </Button>
            <Button variant="secondary" to="/">
              Back to home
            </Button>
          </div>
        </div>

        <p className={styles.note}>
          Phase 1 covers the home page in full. Everything above is wired into the navigation and
          the footer already, so nothing here is a dead end — but the content itself is deliberately
          not built yet. {siteConfig.business.spokenName}, {siteConfig.business.city}.
        </p>
      </div>
    </div>
  );
}
