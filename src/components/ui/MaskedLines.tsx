import { useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { cx } from '../../utils/cx';
import styles from './MaskedLines.module.css';

interface MaskedLinesProps {
  /** One entry per visual line. Strings and spans both work. */
  lines: ReactNode[];
  /** Semantic element for the whole headline, e.g. 'h1' | 'h2' | 'p'. */
  as?: ElementType;
  className?: string;
  /** Delay before the first line lifts, in seconds. */
  delay?: number;
  /** Seconds between lines. */
  stagger?: number;
  /** Off for headline reveals handled by a parent timeline (the hero). */
  selfAnimate?: boolean;
  /** Rendered, but with the animation suppressed. */
  static?: boolean;
  /** Forwarded to the wrapper element, for aria-labelledby targets. */
  id?: string;
}

/**
 * Reveals each line from behind a hard mask, driven by ScrollTrigger.
 * With `prefers-reduced-motion` the text simply appears — no transform, no
 * hidden state, and ScrollTrigger is never created.
 */
export function MaskedLines({
  lines,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.075,
  selfAnimate = true,
  static: isStatic = false,
  id,
}: MaskedLinesProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const animate = selfAnimate && !reduced && !isStatic;

  useGSAP(
    () => {
      if (!animate) return;
      const targets = gsap.utils.toArray<HTMLElement>(`.${styles.inner}`, root.current);
      if (!targets.length) return;

      gsap.from(targets, {
        yPercent: 115,
        duration: 1,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 88%',
          once: true,
        },
      });
    },
    { scope: root, dependencies: [animate, delay, stagger] },
  );

  return (
    <Tag ref={root} id={id} className={cx(styles.wrap, className)}>
      {lines.map((line, index) => (
        <span key={index} className={cx(styles.line, isOutline(line) && styles['line--outline'])}>
          <span className={styles.inner}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Outlined words need overflow visible, or the stroke gets clipped. */
function isOutline(node: ReactNode): boolean {
  if (!node || typeof node !== 'object') return false;
  const props = (node as { props?: { className?: string } }).props;
  return typeof props?.className === 'string' && props.className.includes('outline');
}
