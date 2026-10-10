import { cx } from '../../utils/cx';
import { LOGO, LOGO_MARK } from '../../data/media';

interface LogoProps {
  /** Rendered height in px; width follows the master's aspect ratio exactly. */
  height?: number;
  className?: string;
  /** The compact RS lockup, used by the loader. */
  mark?: boolean;
  /** Only the first logo on the page (the header) should be eager. */
  priority?: boolean;
  /** Overrides the accessible name — used inside labelled links. */
  alt?: string;
}

/**
 * The client's logo, unmodified. Aspect ratio is locked from the master file
 * (1295×760) so it can never be stretched, and width/height are always
 * rendered together to keep CLS at zero.
 */
export function Logo({ height = 34, className, mark = false, priority = false, alt }: LogoProps) {
  const set = mark ? LOGO_MARK : LOGO;
  const width = Math.round(height * set.ratio);
  const label = alt ?? 'RS Fit Club';

  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={mark ? set.avif.srcSet : set.avif.srcSet}
        sizes={`${width}px`}
      />
      <source
        type="image/webp"
        srcSet={mark ? set.webp.srcSet : set.webp.srcSet}
        sizes={`${width}px`}
      />
      <img
        src={mark ? set.webp.src : set.webp.src}
        width={width}
        height={height}
        alt={label}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        /* React 18 does not know the camelCase `fetchPriority` and warns about
           it, so it is spread in lowercase — which React passes through to the
           DOM verbatim, exactly as the browser expects. */
        {...(priority ? { fetchpriority: 'high' } : null)}
        draggable={false}
        className={cx('logo-img', className)}
      />
    </picture>
  );
}
