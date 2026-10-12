import { useEffect } from 'react';
import type { RefObject } from 'react';

/* ---------------------------------------------------------------------------
   Pointer tilt.

   The 3D parallax figure (CoachFigure) leans towards the cursor: the figure
   turns a few degrees, shifts against its own background, and the ghost word
   behind it drifts the other way. All of it is two CSS custom properties
   written onto the element that carries `[data-tilt]` — the movement itself is
   CSS transforms, so nothing here touches layout and a pointer that stops
   moving costs nothing.

   Same shape as useSpotlight: one listener per host section, found by walking
   up from the event target, so a page with several figures still has a single
   handler. Skipped entirely on touch pointers, where there is no hover to
   track, and under reduced motion, where the figure simply stands still.
   --------------------------------------------------------------------------- */
const MAX_TURN = 13; /* degrees of rotateY at the edge of the figure */
const MAX_PITCH = 9; /* degrees of rotateX */
const MAX_SHIFT = 16; /* px the figure slides against its backdrop */

export function useTilt3d(container: RefObject<HTMLElement | null>, reduced: boolean): void {
  useEffect(() => {
    const host = container.current;
    if (!host || reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let frame = 0;
    let pending: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = pending;
      pending = null;
      if (!event) return;

      const target = event.target as HTMLElement | null;
      const figure = target?.closest<HTMLElement>('[data-tilt]');
      if (!figure || !host.contains(figure)) return;

      const rect = figure.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      figure.style.setProperty('--tilt-y', `${(nx * MAX_TURN).toFixed(2)}deg`);
      figure.style.setProperty('--tilt-x', `${(-ny * MAX_PITCH).toFixed(2)}deg`);
      figure.style.setProperty('--shift-x', `${(nx * MAX_SHIFT).toFixed(2)}px`);
      figure.style.setProperty('--shift-y', `${(ny * MAX_SHIFT * 0.6).toFixed(2)}px`);
    };

    /* One custom property write per frame, not per pointer event: a phone-class
       CPU should never be asked to lay out on every mouse move. */
    const move = (event: PointerEvent) => {
      pending = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      const figures = host.querySelectorAll<HTMLElement>('[data-tilt]');
      figures.forEach((figure) => {
        figure.style.removeProperty('--tilt-y');
        figure.style.removeProperty('--tilt-x');
        figure.style.removeProperty('--shift-x');
        figure.style.removeProperty('--shift-y');
      });
    };

    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', reset);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', reset);
    };
  }, [container, reduced]);
}
