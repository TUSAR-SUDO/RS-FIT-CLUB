import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { cx } from '../../utils/cx';
import { Icon } from './Icon';
import styles from './Marquee.module.css';

interface MarqueeProps {
  items: readonly string[];
  /** Seconds for one full loop at rest. Larger = slower. */
  speed?: number;
  /** 1 scrolls left, -1 scrolls right. */
  direction?: 1 | -1;
  variant?: 'fill' | 'outline' | 'steel';
  className?: string;
  separator?: 'sparkle' | 'diamond' | 'none';
}

/**
 * Infinite service strip whose speed is coupled to scroll velocity: it drags
 * while you scroll and settles back to its resting speed when you stop.
 *
 * The duplicate group is aria-hidden so a screen reader hears the service list
 * once. With reduced motion the track simply sits still and remains readable.
 */
export function Marquee({
  items,
  speed = 26,
  direction = 1,
  variant = 'fill',
  className,
  separator = 'sparkle',
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = track.current;
      if (!el || reduced) return;

      /* Two identical groups sit side by side. Travelling exactly one group
         width per loop makes the seam invisible. Scrolling right starts half
         a track to the left so there is never a gap on the leading edge. */
      const from = direction === 1 ? 0 : -50;
      const to = direction === 1 ? -50 : 0;
      const loop = gsap.fromTo(
        el,
        { xPercent: from },
        { xPercent: to, duration: speed, ease: 'none', repeat: -1 },
      );

      /* Velocity coupling. ScrollTrigger.getVelocity() is in px/s; we clamp it
         to a sane timeScale so a fling scroll does not send the band into
         hyperspace, then ease back to the resting speed. */
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(0, 5.5, Math.abs(self.getVelocity()) / 420);
          gsap.to(loop, {
            timeScale: 1 + boost,
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(loop, { timeScale: 1, duration: 0.9, ease: 'power2.out' });
            },
          });
        },
      });

      return () => {
        loop.kill();
        trigger.kill();
      };
    },
    { scope: root, dependencies: [reduced, speed, direction] },
  );

  const glyph = <Icon name="sparkle" size={14} className={styles.glyph} />;

  const group = (hidden: boolean) => (
    <ul className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className={styles.item}>
          <span>{item}</span>
          {separator !== 'none' ? glyph : null}
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className={cx(styles.band, styles[variant], className)}>
      <div ref={track} className={styles.track}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
