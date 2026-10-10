import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { siteConfig, hasPhone } from '../../data/siteConfig';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useLead } from '../../context/lead';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { cx } from '../../utils/cx';
import { trackEvent } from '../../utils/analytics';
import styles from './Header.module.css';

interface HeaderProps {
  /** Opens the full-screen menu. */
  onOpenMenu: () => void;
  menuOpen: boolean;
}

export function Header({ onOpenMenu, menuOpen }: HeaderProps) {
  const { startLead } = useLead();
  const { pathname } = useLocation();
  const direction = useScrollDirection();
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);
  const isHome = pathname === '/';

  /* Solid bar as soon as the hero starts leaving; transparent only at rest
     over the hero on the home page. Interior pages get the solid bar at once
     because their page header sits directly under it. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll progress hairline. Driven by ScrollTrigger rather than a scroll
     listener so it is already frame-synced with every other animation. */
  useGSAP(() => {
    const el = progress.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
    });
    return () => trigger.kill();
  }, []);

  /* Hide while travelling down, return the moment the visitor scrolls up.
     Never while the full-screen menu is open — the close button lives here. */
  const hidden = !menuOpen && direction === 'down' && scrolled;

  return (
    <header
      className={cx(styles.header, (scrolled || !isHome) && styles.solid, hidden && styles.hidden)}
    >
      <div className={cx('shell', styles.inner)}>
        <Link to="/" className={styles.brand} aria-label={`${siteConfig.business.name} — home`}>
          <Logo height={26} priority alt={siteConfig.business.name} />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}
                  onClick={() => trackEvent('nav_click', { where: 'header', to: item.to })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {hasPhone ? (
            <a
              className={styles.quickCall}
              href={`tel:${siteConfig.contact.phoneDisplay.replace(/\s/g, '')}`}
              onClick={() => trackEvent('call_click', { where: 'header' })}
            >
              <Icon name="phone" size={15} />
              {siteConfig.contact.phoneDisplay}
            </a>
          ) : null}

          <Button
            variant="primary"
            size="sm"
            className={styles.headerCta}
            onClick={() => startLead({ source: 'header' })}
          >
            Free trial
          </Button>

          <button
            type="button"
            className={styles.burger}
            onClick={onOpenMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label="Open menu"
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>

      <span ref={progress} className={styles.progress} aria-hidden="true" />
    </header>
  );
}
