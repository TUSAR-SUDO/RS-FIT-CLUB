import { forwardRef } from 'react';
import { OWNER_RATIO, ownerSrcSet } from '../../data/media';
import { siteConfig } from '../../data/siteConfig';
import { cx } from '../../utils/cx';
import styles from './OwnerFigure.module.css';

interface OwnerFigureProps {
  /** Width the layout will actually render, used to derive height for CLS. */
  renderWidth: number;
  /** Above-the-fold instance: eager + high priority. */
  priority?: boolean;
  sizes: string;
  className?: string;
  /** Adds the hard accent edge that sits behind the shoulder. */
  edge?: boolean;
  /**
   * Pulls the rim light back and drops the accent edge — for the small
   * portraits, where the hero's treatment fills the whole plate with glow.
   */
  quiet?: boolean;
}

/**
 * The client's transparent-background cutout, at the master's true aspect
 * ratio (1019×1520). Width and height are always emitted together so the
 * hero never shifts while the PNG decodes.
 */
export const OwnerFigure = forwardRef<HTMLImageElement, OwnerFigureProps>(function OwnerFigure(
  { renderWidth, priority = false, sizes, className, edge = false, quiet = false },
  ref,
) {
  const height = Math.round(renderWidth / OWNER_RATIO);

  return (
    <figure
      className={cx(styles.figure, edge && styles['figure--edge'], quiet && styles['figure--quiet'], className)}
    >
      <picture>
        <source type="image/avif" srcSet={ownerSrcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={ownerSrcSet('webp')} sizes={sizes} />
        <img
          ref={ref}
          src="/media/owner-800.webp"
          alt={
            siteConfig.owner.name.includes('[')
              ? 'RS Fit Club founder on the gym floor'
              : siteConfig.owner.name
          }
          width={renderWidth}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          /* Lowercase on purpose: React 18 does not recognise the camelCase
             prop and would drop it with a console warning. */
          {...(priority ? { fetchpriority: 'high' } : null)}
          draggable={false}
        />
      </picture>
    </figure>
  );
});
