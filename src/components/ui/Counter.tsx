import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { isReal } from '../../data/siteConfig';
import { cx } from '../../utils/cx';

interface CounterProps {
  /** null (or a placeholder string) renders nothing at all. */
  value: number | string | null;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

const formatter = (decimals: number) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Rolls a number up from zero when it scrolls into view.
 *
 * CRITICAL: if the value is not real (null, or a "[TOKEN]" placeholder) the
 * component renders NOTHING. The site must never display an invented member
 * count or years-in-business. `hasRealStats` in siteConfig drives whether the
 * surrounding strip is rendered at all.
 */
export function Counter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const real = isReal(value);
  const target = real ? Number(value) : 0;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !real) return;

      const format = formatter(decimals);
      if (reduced) {
        el.textContent = `${prefix}${format.format(target)}${suffix}`;
        return;
      }

      const state = { n: 0 };
      el.textContent = `${prefix}${format.format(0)}${suffix}`;

      gsap.to(state, {
        n: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${format.format(state.n)}${suffix}`;
        },
      });
    },
    { dependencies: [real, target, reduced, prefix, suffix, decimals, duration] },
  );

  if (!real) return null;

  return (
    <span
      ref={ref}
      className={cx('num', className)}
      /* Screen readers get the final value, not the rolling digits. */
      aria-label={`${prefix}${formatter(decimals).format(target)}${suffix}`}
      role="text"
    >
      {`${prefix}${formatter(decimals).format(target)}${suffix}`}
    </span>
  );
}
