import { useEffect, useRef, useState } from 'react';

/**
 * 'up' | 'down' based on scroll direction, with a threshold so the header
 * does not flicker on rubber-band scrolling. Listener is passive and the
 * state only changes when the direction actually flips.
 */
export function useScrollDirection(threshold = 8): 'up' | 'down' {
  const last = useRef(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    last.current = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) < threshold) return;
      const next = delta > 0 ? 'down' : 'up';
      last.current = y;
      setDirection((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return direction;
}
