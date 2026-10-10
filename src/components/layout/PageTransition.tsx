import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOGO_MARK } from '../../data/media';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { ScrollTrigger } from '../../lib/gsap';
import { scrollToTop } from '../../lib/scroll';
import { trackEvent } from '../../utils/analytics';
import { cx } from '../../utils/cx';
import styles from './PageTransition.module.css';

type Phase = 'idle' | 'in' | 'out';

/**
 * Route-change curtain plus scroll restoration.
 *
 * Link clicks are intercepted in the CAPTURE phase, before React Router's own
 * delegated handler runs, so the curtain is already covering the screen by the
 * time the new route mounts — no flash of swapped content. In-page anchors
 * (#programs), modifier-clicked links, external links and downloads are left
 * completely alone.
 *
 * With reduced motion nothing is intercepted at all: navigation is instant.
 */
export function PageTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const busy = useRef(false);
  const pendingScroll = useRef(false);

  /* After a covered navigation, put the visitor at the top of the new page and
     let ScrollTrigger re-measure the freshly mounted route. */
  useEffect(() => {
    if (pendingScroll.current) {
      scrollToTop(true);
      pendingScroll.current = false;
    }
    const raf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (reduced) return;

    const onCapture = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const samePage = url.pathname === window.location.pathname;
      const sameSearch = url.search === window.location.search;
      // A pure in-page anchor is a scroll, not a navigation.
      if (samePage && url.hash) return;
      if (samePage && sameSearch) return;
      if (busy.current) {
        event.preventDefault();
        return;
      }

      /* Take the click away from React Router and drive it ourselves. */
      event.preventDefault();
      event.stopPropagation();
      busy.current = true;
      pendingScroll.current = true;
      trackEvent('nav_click', { where: 'transition', to: `${url.pathname}${url.hash}` });

      setPhase('in');
      window.setTimeout(() => {
        navigate(`${url.pathname}${url.search}${url.hash}`);
        window.setTimeout(() => {
          setPhase('out');
          window.setTimeout(() => {
            setPhase('idle');
            busy.current = false;
          }, 300);
        }, 40);
      }, 215);
    };

    document.addEventListener('click', onCapture, true);
    return () => document.removeEventListener('click', onCapture, true);
  }, [navigate, reduced]);

  if (reduced) return null;

  return (
    <div
      className={cx(styles.curtain, phase === 'in' && styles.in, phase === 'out' && styles.out)}
      aria-hidden="true"
    >
      <picture className={styles.mark}>
        <source type="image/avif" srcSet={LOGO_MARK.avif.srcSet} sizes="84px" />
        <source type="image/webp" srcSet={LOGO_MARK.webp.srcSet} sizes="84px" />
        <img src={LOGO_MARK.webp.src} width={84} height={Math.round(84 / LOGO_MARK.ratio)} alt="" />
      </picture>
    </div>
  );
}
