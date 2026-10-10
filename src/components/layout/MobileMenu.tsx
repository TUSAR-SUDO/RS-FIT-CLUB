import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { siteConfig, hasPhone, hasWhatsapp, isReal } from '../../data/siteConfig';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { trackEvent } from '../../utils/analytics';
import { lockScroll, unlockScroll } from '../../lib/scroll';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLead } from '../../context/lead';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { cx } from '../../utils/cx';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const SOCIALS = [
  { key: 'instagram' as const, icon: 'instagram' as const, label: 'Instagram' },
  { key: 'facebook' as const, icon: 'facebook' as const, label: 'Facebook' },
  { key: 'youtube' as const, icon: 'youtube' as const, label: 'YouTube' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const { startLead } = useLead();

  /* Esc + Tab containment + focus restore. */
  useFocusTrap(panel, open, onClose);

  /* Lock page scroll while the overlay is up. */
  useEffect(() => {
    if (open) {
      lockScroll();
      return () => unlockScroll();
    }
    return undefined;
  }, [open]);

  const whatsapp = buildWhatsAppLink({ source: 'menu' });
  const visibleSocials = SOCIALS.filter(({ key }) => {
    const url = siteConfig.social[key];
    return typeof url === 'string' && url.startsWith('http');
  });

  return (
    <div
      id="site-menu"
      ref={panel}
      className={styles.menu}
      data-open={open}
      /* No `inert` needed: `visibility: hidden` while closed already removes
         every link inside from the tab order and the accessibility tree. */
      aria-label="Site menu"
    >
      <div className={cx('shell', styles.top)}>
        <Logo height={38} alt={siteConfig.business.name} />
        <button type="button" className={styles.close} onClick={onClose}>
          <span>Close</span>
          <span className={styles.closeIcon}>
            <Icon name="close" size={16} />
          </span>
        </button>
      </div>

      <nav className={cx('shell', styles.nav)} aria-label="All pages">
        <ul className={styles.list}>
          {siteConfig.nav.map((item, index) => (
            <li key={item.to} className={styles.item} style={{ ['--i' as string]: index }}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={styles.link}
                onClick={() => trackEvent('nav_click', { where: 'menu', to: item.to })}
              >
                <span className={styles.linkNum}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.linkText}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={cx('shell', styles.foot)}
        style={{ ['--items' as string]: siteConfig.nav.length }}
      >
        <div className={styles.footMeta}>
          <span className={styles.footLine}>
            <Icon name="pin" size={16} />
            {isReal(siteConfig.location.streetLine)
              ? `${siteConfig.location.streetLine}, ${siteConfig.location.area}`
              : `${siteConfig.business.area}, ${siteConfig.business.city}`}
          </span>
          {hasPhone ? (
            <a
              className={styles.footLine}
              href={`tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}`}
              onClick={() => trackEvent('call_click', { where: 'menu' })}
            >
              <Icon name="phone" size={16} />
              {siteConfig.contact.phoneDisplay}
            </a>
          ) : null}
          <a
            className={styles.footLine}
            href={`mailto:${siteConfig.business.email}`}
            onClick={() => trackEvent('cta_click', { source: 'menu', kind: 'email' })}
          >
            <Icon name="mail" size={16} />
            {siteConfig.business.email}
          </a>
        </div>

        {visibleSocials.length ? (
          <div className={styles.socials}>
            {visibleSocials.map(({ key, icon, label }) => (
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

        <div className={styles.ctaRow}>
          <Button
            variant="primary"
            block
            onClick={() => {
              onClose();
              startLead({ source: 'menu' });
            }}
          >
            Claim free trial
          </Button>
          {hasWhatsapp && whatsapp ? (
            <Button
              variant="whatsapp"
              block
              icon="whatsapp"
              iconPosition="start"
              href={whatsapp}
              onClick={() => trackEvent('whatsapp_click', { where: 'menu' })}
            >
              WhatsApp
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
