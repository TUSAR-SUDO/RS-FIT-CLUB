import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './ImagePlaceholder.module.css';

interface ImagePlaceholderProps {
  /** What the photograph should show, e.g. "Gym floor, wide shot". */
  label: string;
  /**
   * CSS aspect-ratio string: "16/9", "4/5", "1/1"…
   * When omitted, `height` must be supplied instead.
   */
  ratio?: string;
  /** Explicit height for frames that must not be ratio-driven. */
  height?: CSSProperties['height'];
  /** Small frames drop to a tighter layout for grids and carousels. */
  size?: 'sm' | 'md' | 'lg';
  /** Extra note under the label, e.g. "Client to supply". */
  note?: ReactNode;
  className?: string;
  /** Hides the "placeholder" tag where it would be redundant. */
  hideTag?: boolean;
}

/**
 * A frame standing in for a photograph the client has not supplied yet.
 * Deliberately never a stock photo: a labelled shot list is more useful to
 * everyone than a borrowed image nobody owns.
 */
export function ImagePlaceholder({
  label,
  ratio = '16/9',
  height,
  size = 'md',
  note,
  className,
  hideTag = false,
}: ImagePlaceholderProps) {
  const iconSize = size === 'sm' ? 22 : 28;

  return (
    <div
      className={cx('cut', styles.frame, styles.marks, size === 'sm' && styles.sm, className)}
      style={{ aspectRatio: height ? undefined : ratio, height }}
      role="img"
      aria-label={`Placeholder image: ${label}`}
    >
      {!hideTag ? <span className={styles.tag}>Placeholder</span> : null}
      <div className={styles.inner}>
        <svg
          className={styles.icon}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9l1.3-2h6.6l1.3 2h1.9A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12.4" r="3.3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className={styles.label}>{label}</span>
        {note ? <span className={styles.note}>{note}</span> : null}
        <span className={styles.meta}>
          <span>{ratio.replace('/', ' : ')}</span>
          <span aria-hidden="true">·</span>
          <span>Shot pending</span>
        </span>
      </div>
    </div>
  );
}
