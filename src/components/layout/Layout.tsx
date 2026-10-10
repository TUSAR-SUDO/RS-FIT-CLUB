import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { destroySmoothScroll, initSmoothScroll, scrollToTarget } from '../../lib/scroll';
import { ScrollTrigger } from '../../lib/gsap';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { MobileActionBar } from './MobileActionBar';
import { Footer } from './Footer';
import { Overlays } from './Overlays';
import { PageTransition } from './PageTransition';
import { IntroLoader } from './IntroLoader';
import { shouldPlayIntro } from '../../lib/introSession';
import { IntroDoneContext } from '../../context/intro';

/**
 * The global shell. Rendered once per app and never unmounted, so the header,
 * the smooth-scroll instance and the overlay stack all survive navigation —
 * which is what makes route changes feel like a scene change rather than a
 * page reload.
 */
export function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro, setIntro] = useState(() => shouldPlayIntro());

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const endIntro = useCallback(() => setIntro(false), []);

  /* Freeze the page while the intro plays. */
  useEffect(() => {
    document.documentElement.classList.toggle('is-intro', intro);
    return () => document.documentElement.classList.remove('is-intro');
  }, [intro]);

  /* Smooth scrolling starts only after the intro hands over, so Lenis and the
     intro never fight over the scroll position. Phones get native scrolling —
     see initSmoothScroll(). */
  useEffect(() => {
    if (intro) return;
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, [intro]);

  /* Any navigation closes the full-screen menu. */
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  /* Re-measure pinned scenes once fonts and images have settled. */
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts?.ready) void document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const onSkip = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById('main');
    if (!main) return;
    main.focus({ preventScroll: true });
    scrollToTarget(main, -8);
  }, []);

  return (
    <>
      {intro ? <IntroLoader onDone={endIntro} /> : null}

      <a className="sr-only sr-only--focusable" href="#main" onClick={onSkip}>
        Skip to content
      </a>

      <Header onOpenMenu={openMenu} menuOpen={menuOpen} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />

      {/* tabIndex lets the skip link place real focus inside <main>. */}
      <main id="main" tabIndex={-1}>
        <IntroDoneContext.Provider value={!intro}>
          <Outlet />
        </IntroDoneContext.Provider>
      </main>

      <Footer />
      <MobileActionBar />
      <PageTransition />
      <Overlays />
    </>
  );
}
