import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from './Icon';
import styles from './BeforeAfter.module.css';

interface BeforeAfterProps {
  /** The "before" visual — a Photo, or any frame that fills the slider. */
  before: ReactNode;
  /** The "after" visual, stacked on top and clipped by the handle. */
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Starting position, 0–100. */
  initial?: number;
  /** Used in the range input's accessible name. */
  label: string;
  className?: string;
}

/**
 * A touch-friendly comparison slider.
 *
 * Accessibility: the visible knob is decoration — the actual control is a
 * real `<input type="range">` layered over the frame, so arrow keys, Home/End
 * and screen readers all work without any custom key handling. Vertical
 * swipes still scroll the page (`touch-action: pan-y`), so it never traps a
 * phone user's scroll.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initial = 54,
  label,
  className,
}: BeforeAfterProps) {
  const root = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, Math.round(pct))));
  }, []);

  return (
    <div
      ref={root}
      className={cx(styles.root, className)}
      data-dragging={dragging}
      style={{ ['--pos' as string]: value }}
      onPointerDown={(event) => {
        // Ignore the range input itself; it handles its own input events.
        if ((event.target as HTMLElement).classList.contains(styles.range)) return;
        setDragging(true);
        updateFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        updateFromPointer(event.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <span className={styles.ticks} aria-hidden="true" />

      <div className={styles.layer}>{before}</div>
      <div className={styles.layerAfter}>{after}</div>

      <span className={cx(styles.tag, styles.tagBefore)}>{beforeLabel}</span>
      <span className={cx(styles.tag, styles.tagAfter)}>{afterLabel}</span>

      <span className={styles.handle} aria-hidden="true">
        <span className={styles.knob}>
          <Icon name="drag" size={20} />
        </span>
      </span>

      <input
        className={styles.range}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={label}
        aria-valuetext={`${value}% revealed`}
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
}
