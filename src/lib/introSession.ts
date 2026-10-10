/* ---------------------------------------------------------------------------
   Intro session bookkeeping.

   Kept out of the IntroLoader component file so that file exports only a
   component (which keeps React Fast Refresh working in development).
   --------------------------------------------------------------------------- */

/**
 * Only the first visit in a session gets the intro, and never when the visitor
 * has asked for reduced motion.
 */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    if (window.sessionStorage.getItem('rs-intro-shown') === '1') return false;
    window.sessionStorage.setItem('rs-intro-shown', '1');
  } catch {
    /* Private mode: show it, it is only 1.5 seconds. */
  }
  return true;
}
