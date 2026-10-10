import { cx } from '../../utils/cx';
import styles from './RegistrationMarks.module.css';

interface RegistrationMarksProps {
  className?: string;
  accent?: boolean;
  /** Inset from the edges, in px. */
  inset?: number;
}

/**
 * Four corner crosshairs. Purely decorative — rendered as an overlay inside a
 * `position: relative` section so nothing shifts when they are removed.
 */
export function RegistrationMarks({ className, accent = false, inset }: RegistrationMarksProps) {
  const corners = ['tl', 'tr', 'bl', 'br'] as const;
  return (
    <div
      className={cx(styles.marks, accent && styles.accent, className)}
      aria-hidden="true"
      style={inset !== undefined ? { inset: `${inset}px` } : undefined}
    >
      {corners.map((corner) => (
        <span key={corner} className={cx(styles.mark, styles[corner])} />
      ))}
    </div>
  );
}
