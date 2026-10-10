import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { hasPhone, hasWhatsapp, isReal, siteConfig } from '../../data/siteConfig';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { trackEvent } from '../../utils/analytics';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { useLead } from '../../context/lead';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { RegistrationMarks } from '../ui/RegistrationMarks';
import { cx } from '../../utils/cx';
import styles from './Footer.module.css';

const SOCIAL_LINKS = [
  { key: 'instagram' as const, icon: 'instagram' as const, label: 'Instagram' },
  { key: 'facebook' as const, icon: 'facebook' as const, label: 'Facebook' },
  { key: 'youtube' as const, icon: 'youtube' as const, label: 'YouTube' },
];

export function Footer() {
  const wordmark = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { startLead } = useLead();
  const whatsapp = buildWhatsAppLink({ source: 'footer' });

  /* The wordmark drifts up slightly as the footer arrives — the page's last
     motion beat. Transform only, and skipped entirely for reduced motion. */
  useGSAP(
    () => {
      const el = wordmark.current;
      if (!el || reduced) return;
      gsap.fromTo(
        el,
        { yPercent: 26 },
        {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        },
      );
    },
    { dependencies: [reduced] },
  );

  const socials = SOCIAL_LINKS.filter(({ key }) => {
    const url = siteConfig.social[key];
    return typeof url === 'string' && url.startsWith('http');
  });

  const address = isReal(siteConfig.location.streetLine)
    ? `${siteConfig.location.streetLine}, ${siteConfig.location.area}, ${siteConfig.location.city} ${siteConfig.location.pin}`
    : `${siteConfig.business.area}, ${siteConfig.business.city}, ${siteConfig.business.state}`;

  return (
    <footer className={styles.footer}>
      <div className={cx('shell', styles.grid)}>
        <div className={styles.brandBlock}>
          <Logo height={54} alt={siteConfig.business.name} />
          <p className={styles.tagline}>
            {siteConfig.footer.tagline} Weight training, cardio, Zumba, aerobics, personal training
            and diet planning on one floor.
          </p>
          <div className={styles.ctaRow}>
            <Button variant="primary" size="sm" onClick={() => startLead({ source: 'footer' })}>
              Claim free trial
            </Button>
            {hasWhatsapp && whatsapp ? (
              <Button
                variant="whatsapp"
                size="sm"
                icon="whatsapp"
                iconPosition="start"
                href={whatsapp}
                onClick={() => trackEvent('whatsapp_click', { where: 'footer' })}
              >
                WhatsApp
              </Button>
            ) : null}
          </div>
          {socials.length ? (
            <div className={styles.socials}>
              {socials.map(({ key, icon, label }) => (
                <a
                  key={key}
                  className={styles.social}
                  href={siteConfig.social[key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${siteConfig.business.spokenName} on ${label}`}
                >
                  <Icon name={icon} size={18} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <nav className={styles.col} aria-label="Site pages">
          <h2 className={styles.colTitle}>Explore</h2>
          <div className={styles.links}>
            {siteConfig.nav.map((item) => (
              <Link key={item.to} to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav className={styles.col} aria-label="Programmes">
          <h2 className={styles.colTitle}>Programmes</h2>
          <div className={styles.links}>
            {siteConfig.programs.map((program) => (
              <Link key={program.slug} to={`/programs#${program.slug}`} className={styles.link}>
                {program.title}
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Find us</h2>
          <p className={styles.metaRow}>
            <Icon name="pin" size={15} />
            <span>{address}</span>
          </p>
          {hasPhone ? (
            <a
              className={styles.metaRow}
              href={`tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}`}
              onClick={() => trackEvent('call_click', { where: 'footer' })}
            >
              <Icon name="phone" size={15} />
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
          ) : null}
          <a
            className={styles.metaRow}
            href={`mailto:${siteConfig.business.email}`}
            onClick={() => trackEvent('cta_click', { source: 'footer', kind: 'email' })}
          >
            <Icon name="mail" size={15} />
            <span>{siteConfig.business.email}</span>
          </a>
          <p className={styles.metaRow}>
            <Icon name="clock" size={15} />
            <span>
              {siteConfig.hours.alwaysOpen
                ? 'Open 24 hours'
                : siteConfig.hours.confirmed && siteConfig.hours.rows[0]
                  ? `${siteConfig.hours.rows[0].days}: ${siteConfig.hours.rows[0].time}`
                  : 'Hours to be confirmed'}
            </span>
          </p>
        </div>
      </div>

      <div className={cx('shell', styles.wordmarkSection)}>
        <RegistrationMarks inset={0} />
        <span ref={wordmark} className={styles.wordmark} aria-hidden="true">
          {siteConfig.business.name}
        </span>
      </div>

      <div className={cx('shell', styles.bottom)}>
        <div className={styles.smallPrint}>
          <span>
            © {new Date().getFullYear()} {siteConfig.business.name}, {siteConfig.business.city}.
          </span>
          <span>Email address pending the club&rsquo;s confirmation before launch.</span>
        </div>
        <p className={styles.credit}>
          {isReal(siteConfig.footer.builtBy) ? (
            <span>
              Website by{' '}
              {siteConfig.footer.builtByUrl ? (
                <a href={siteConfig.footer.builtByUrl}>{siteConfig.footer.builtBy}</a>
              ) : (
                siteConfig.footer.builtBy
              )}
            </span>
          ) : (
            /* Credit slot stays visible-but-honest until the name is supplied. */
            <span>Website by [freelancer name]</span>
          )}
        </p>
      </div>
    </footer>
  );
}
