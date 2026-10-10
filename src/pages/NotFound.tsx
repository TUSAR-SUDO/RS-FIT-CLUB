import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useSeo } from '../hooks/useSeo';
import { useLead } from '../context/lead';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { MaskedLines } from '../components/ui/MaskedLines';
import { RegistrationMarks } from '../components/ui/RegistrationMarks';
import { cx } from '../utils/cx';
import styles from './PlaceholderPage.module.css';

const LINKS = siteConfig.nav.slice(1);

export default function NotFound() {
  const { startLead } = useLead();

  useSeo({
    title: 'Page not found — RS Fit Club',
    description: 'That page has gone missing. Back to the gym floor.',
    path: '/404',
    noindex: true,
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
          <span className={styles.crumbCurrent}>404</span>
        </nav>

        <div className={styles.head}>
          <span className={cx('ghost', styles.ghost)} aria-hidden="true">
            404
          </span>
          <p className="micro micro--accent">Error 404</p>
          <MaskedLines
            as="h1"
            lines={['That rep failed.', 'Try the next set.']}
            className={cx('display-1', styles.title)}
          />
        </div>

        <p className={cx('lead', styles.lead, styles.joke)}>
          Nobody spotted this page. It is not on the timetable, it is not on the rack, and it is not
          behind the desk. The links below all work — pick one and carry on.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" icon="arrow-right" onClick={() => startLead({ source: '404' })}>
            Claim your free trial
          </Button>
          <Button variant="secondary" to="/" icon="arrow-right" iconPosition="start">
            Back to home
          </Button>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.badge}>
              <Icon name="check" size={12} />
              Still open
            </span>
            <span className="micro">{LINKS.length} pages</span>
          </div>
          <h2 className={styles.panelTitle}>Where you probably meant to go</h2>
          <ul className={styles.list}>
            {LINKS.map((item, index) => (
              <li className={styles.item} key={item.to}>
                <span className={styles.itemNum}>{String(index + 1).padStart(2, '0')}</span>
                <Link className="link-underline" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
