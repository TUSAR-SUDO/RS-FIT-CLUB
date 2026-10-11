import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOGO_MARK } from '../../data/media';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { ScrollTrigger } from '../../lib/gsap';
import { scrollToAnchor, scrollToTop } from '../../lib/scroll';
import { trackEvent } from '../../utils/analytics';
import { cx } from '../../utils/cx';
import styles from './PageTransition.module.css';

type Phase = 'idle' | 'in' | 'out';

/** Class Layout toggles on <html> while the intro loader is on screen. */
const INTRO_CLASS = 'is-intro';

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
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');
  const busy = useRef(false);
  const pendingScroll = useRef(false);

  /* Place the visitor on the new page, then let ScrollTrigger re-measure the
     freshly mounted route.

     A hash wins over the top of the page: the footer and the home page both
     link every programme to /programs#<slug>, and dropping someone at the top
     of a nine-section page would make those links feel broken.

     Two things stop the target from existing on the first frame, and both are
     why this retries instead of scrolling once: route chunks are lazy (the
     element mounts a moment after the navigation), and the first visit in a
     session plays the intro, which locks scrolling on <html> for ~1.5s. A
     browser's own fragment jump cannot survive either, so this is handled in
     JavaScript rather than left to scroll-margin-top. */
  useEffect(() => {
    let seekRaf = 0;
    let alignRaf = 0;
    let frames = 0;
    let cancelled = false;

    const covered = pendingScroll.current;
    pendingScroll.current = false;

    /* Any wheel, tap or key means the visitor has taken over, so the re-align
       loop below stops rather than fighting them for the scroll position. */
    const onTakeover = () => {
      cancelled = true;
      window.cancelAnimationFrame(alignRaf);
    };

    /* Landing exactly is a moving target: photographs above the anchor keep
       decoding after it mounts, and each one that lands pushes the target
       further down the page. So land on it, then re-align while the document is
       still growing — which is also the moment the curtain is covering the
       screen, so the corrections are never seen. */
    const settle = (target: HTMLElement) => {
      let lastHeight = -1;
      let stable = 0;
      let ticks = 0;

      window.addEventListener('wheel', onTakeover, { passive: true, once: true });
      window.addEventListener('touchstart', onTakeover, { passive: true, once: true });
      window.addEventListener('keydown', onTakeover, { once: true });

      const tick = () => {
        if (cancelled || ticks++ > 90) return;
        const height = document.body.scrollHeight;
        if (height !== lastHeight) {
          stable = 0;
          lastHeight = height;
          scrollToAnchor(target, true);
        } else if (++stable > 6) {
          return;
        }
        alignRaf = window.requestAnimationFrame(tick);
      };

      tick();
    };

    const seek = () => {
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      const introPlaying = document.documentElement.classList.contains(INTRO_CLASS);

      if (target && !introPlaying) {
        settle(target);
        return;
      }
      /* ~400ms for the chunk to mount... */
      if (frames++ < 24) {
        seekRaf = window.requestAnimationFrame(seek);
        return;
      }
      /* ...then keep waiting while the intro still owns the scroll (max ~3s). */
      if (introPlaying && frames < 180) {
        seekRaf = window.requestAnimationFrame(seek);
        return;
      }
      /* A slug that never resolves must not leave a covered navigation stuck
         halfway down the previous page. */
      if (covered) scrollToTop(true);
    };

    if (hash) seek();
    else if (covered) scrollToTop(true);

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(refreshRaf);
      window.cancelAnimationFrame(seekRaf);
      window.cancelAnimationFrame(alignRaf);
      window.removeEventListener('wheel', onTakeover);
      window.removeEventListener('touchstart', onTakeover);
      window.removeEventListener('keydown', onTakeover);
    };
  }, [pathname, hash]);

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
