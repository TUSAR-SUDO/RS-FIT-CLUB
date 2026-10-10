import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from '../../lib/gsap';

/* ---------------------------------------------------------------------------
   Magnetic hover. Cursor gets within `radius` of the element's centre and the
   element leans towards it, then springs back with a slight overshoot.

   Desktop only: skipped entirely for touch devices and for visitors who asked
   for reduced motion, so a phone never pays for the listener.
   --------------------------------------------------------------------------- */
export function useMagnetic(ref: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const strength = 0.28;
    const radius = 110;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(radius, rect.width / 2 + 40);
      if (distance > reach) {
        xTo(0);
        yTo(0);
        return;
      }
      const falloff = 1 - distance / reach;
      xTo(dx * strength * falloff);
      yTo(dy * strength * falloff);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, enabled]);
}
