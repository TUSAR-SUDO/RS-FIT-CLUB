import { useEffect } from 'react';
import type { RefObject } from 'react';

/* ---------------------------------------------------------------------------
   Pointer spotlight.

   One listener per section, not one per card: the handler walks up from the
   event target to the nearest `[data-spotlight]` element and writes the pointer
   position onto it as `--mx` / `--my` (percentages). The highlight itself is
   pure CSS — a radial-gradient whose centre is those two variables — so nothing
   here touches layout, and a card with no pointer over it simply keeps the
   defaults.

   Skipped entirely on touch pointers, where there is no hover state to track,
   and when GSAP reports reduced motion, because the highlight is decoration.
   --------------------------------------------------------------------------- */

export function useSpotlight(container: RefObject<HTMLElement>, reduced = false): void {
  useEffect(() => {
    const el = container.current;
    if (!el || reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>('[data-spotlight]');
      if (!card || !el.contains(card)) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      card.style.setProperty(
        '--mx',
        `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`,
      );
      card.style.setProperty(
        '--my',
        `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`,
      );
    };

    el.addEventListener('pointermove', move, { passive: true });
    return () => el.removeEventListener('pointermove', move);
  }, [container, reduced]);
}
