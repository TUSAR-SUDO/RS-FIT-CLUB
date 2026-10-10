import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { MaskedLines } from './MaskedLines';
import styles from './SectionHead.module.css';

interface SectionHeadProps {
  /** Section number, e.g. "03". Rendered before the label. */
  index: string;
  label: string;
  /** Headline, one entry per line so each line can lift independently. */
  title: ReactNode[];
  lead?: ReactNode;
  actions?: ReactNode;
  /** Oversized outline word set behind the heading. Decorative. */
  ghost?: string;
  id?: string;
  className?: string;
  tight?: boolean;
}

/**
 * The heading block every section shares. Consistency comes from this one
 * component; variety comes from what each section does underneath it.
 */
export function SectionHead({
  index,
  label,
  title,
  lead,
  actions,
  ghost,
  id,
  className,
  tight = false,
}: SectionHeadProps) {
  const hasAside = Boolean(lead || actions);

  return (
    <div
      className={cx(
        styles.head,
        tight && styles['head--tight'],
        !hasAside && styles['head--asideLess'],
        className,
      )}
    >
      {ghost ? (
        <span className={cx('ghost', styles.ghost)} aria-hidden="true">
          {ghost}
        </span>
      ) : null}

      <p className={styles.labelRow}>
        <span className={cx('micro', styles.labelIndex)}>{index}</span>
        <span className="micro">{label}</span>
      </p>

      <MaskedLines
        as="h2"
        id={id}
        lines={title}
        className={cx('display-2', styles.title)}
        stagger={0.07}
      />

      {lead || actions ? (
        <div className={styles.aside}>
          {lead ? <p className={cx('lead', styles.lead)}>{lead}</p> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
