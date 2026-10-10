import { useEffect, useState } from 'react';

/** SSR/first-paint-safe media query. Defaults to `false` until measured. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has asked the OS to reduce motion. Every animated
 * component in the site checks this and degrades to a static presentation —
 * the loader does not render, parallax becomes a fade, particles switch off.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Coarse pointer / no hover: phones and tablets. */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}
