import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/* ---------------------------------------------------------------------------
   One Lenis instance for the whole app, created from the layout and reachable
   from anywhere (header links, mobile menu, footer, the "back to top" cue).

   Phones are deliberately NOT smooth-scrolled: syncTouch stays false so the
   native momentum scroll is untouched, which is what actually feels right on
   Android and iOS. Lenis only takes over wheel input on pointer:fine devices.
   --------------------------------------------------------------------------- */

let instance: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initSmoothScroll(): Lenis | null {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (reduce || coarse || instance) return null;

  const lenis = new Lenis({
    duration: 0.9,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    syncTouch: false, // never hijack touch momentum
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
    lerp: 0.11,
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  return lenis;
}

export function destroySmoothScroll(): void {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  instance?.destroy();
  instance = null;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Pause wheel scrolling (used while the full-screen menu is open). */
export function lockScroll(): void {
  instance?.stop();
  document.documentElement.style.overflow = instance ? '' : 'clip';
}

export function unlockScroll(): void {
  instance?.start();
  document.documentElement.style.overflow = '';
}

/** Jump to the top without triggering smooth-scroll inertia. */
export function scrollToTop(immediate = true): void {
  if (instance) {
    instance.scrollTo(0, { immediate });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

/**
 * Scroll to an element or offset. Used by every in-page anchor so that the
 * fixed header height is always accounted for.
 *
 * `immediate` skips the easing entirely. Used by route changes that arrive with
 * a hash (e.g. /programs#weight-training): the curtain is covering the screen at
 * that moment, so an animated scroll would be invisible motion that also fires
 * every reveal animation on the way past.
 */
export function scrollToTarget(
  target: string | HTMLElement | number,
  offset = 0,
  immediate = false,
): void {
  const extra = offset - headerHeight();
  if (instance) {
    instance.scrollTo(
      target,
      immediate ? { offset: extra, immediate: true } : { offset: extra, duration: 1 },
    );
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target + extra, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + extra;
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
}

/**
 * Land on a deep-link target the way the browser itself would: honouring the
 * element's own `scroll-margin-top`.
 *
 * `scrollToTarget` subtracts the header height, which is right for a section id
 * with no margin of its own — but on a target that already carries
 * `scroll-margin-top` (the programme cards do, so a native fragment jump clears
 * the header) that compensation is counted twice and the page stops ~90px short.
 */
export function scrollToAnchor(target: HTMLElement, immediate = false): void {
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);

  if (instance) {
    instance.scrollTo(top, immediate ? { immediate: true } : { duration: 1 });
    return;
  }
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
}

function headerHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
}
