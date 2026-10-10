import type { ReactNode, SVGProps } from 'react';
import type { IconName } from '../../data/siteConfig';

/* ---------------------------------------------------------------------------
   One hand-built icon family. 24×24 grid, 1.5px strokes, round caps/joins,
   currentColor throughout. Brand marks (WhatsApp, Instagram…) are the same
   geometry as the line glyphs so nothing looks pasted in from a sticker pack.
   --------------------------------------------------------------------------- */

export type { IconName };

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Decorative by default: icons repeat what the adjacent text already says. */
  title?: string;
}

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const glyphs: Record<IconName, ReactNode> = {
  /* ---------------------------------------------------------------- training */
  dumbbell: (
    <>
      <path d="M3.5 9.5v5M6.5 8v8M17.5 8v8M20.5 9.5v5" {...S} />
      <path d="M6.5 12h11" {...S} />
    </>
  ),
  barbell: (
    <>
      <path d="M2 10.5v3M4.5 8v8M19.5 8v8M22 10.5v3" {...S} />
      <path d="M7 12h10" {...S} />
      <path d="M4.5 12h2.5M17 12h2.5" {...S} />
    </>
  ),
  pulse: (
    <>
      <path d="M2.5 12.5h4l2.2-5.5 3.1 11 2.4-6.2 1.6 3h5.7" {...S} />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6.6l10-2.1V16" {...S} />
      <circle cx="6.5" cy="18" r="2.5" {...S} />
      <circle cx="16.5" cy="16" r="2.5" {...S} />
    </>
  ),
  aerobics: (
    <>
      <circle cx="13.5" cy="4.6" r="2.1" {...S} />
      <path d="M13 8.4 9.2 12l2.6 2.6V21" {...S} />
      <path d="m13 8.4 3.6 2.2 3.4-.9" {...S} />
      <path d="M9.2 12 5.5 10.6 3 12.6" {...S} />
    </>
  ),
  whistle: (
    <>
      <path d="M8 8.5h6.5l4.5-1.8v6.8H8z" {...S} />
      <circle cx="5.6" cy="11" r="3.1" {...S} />
      <path d="M19 13.5c0 2.6-2.2 4.5-5.5 4.5" {...S} />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.5" {...S} />
      <circle cx="12" cy="12" r="3" {...S} />
    </>
  ),
  clipboard: (
    <>
      <path
        d="M9 4.5H7.5A1.5 1.5 0 0 0 6 6v13a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V6a1.5 1.5 0 0 0-1.5-1.5H15"
        {...S}
      />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" {...S} />
      <path d="M9 11h6M9 15h4" {...S} />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 5 5.4v5.9c0 4 2.8 7.5 7 9.9 4.2-2.4 7-5.9 7-9.9V5.4z" {...S} />
      <path d="m9 12 2.2 2.2L15.4 10" {...S} />
    </>
  ),

  /* -------------------------------------------------------------- interface */
  pin: (
    <>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" {...S} />
      <circle cx="12" cy="10.5" r="2.6" {...S} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.8" {...S} />
      <path d="M12 7v5.4l3.4 2" {...S} />
    </>
  ),
  phone: (
    <>
      <path
        d="M6.2 3.5h3l1.4 4-2.1 1.4a11.5 11.5 0 0 0 5.6 5.6l1.4-2.1 4 1.4v3A2.5 2.5 0 0 1 17 20.5C10 20.5 3.5 14 3.5 7a2.5 2.5 0 0 1 2.7-3.5z"
        {...S}
      />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2" {...S} />
      <path d="m3.5 7 8.5 6.2L20.5 7" {...S} />
    </>
  ),
  star: (
    <>
      <path d="m12 3.3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.8l6.1-.9z" {...S} />
    </>
  ),
  check: (
    <>
      <path d="m5 12.8 4.6 4.4L19 6.6" {...S} />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M4 12h15" {...S} />
      <path d="m13 6 6 6-6 6" {...S} />
    </>
  ),
  'arrow-down': (
    <>
      <path d="M12 4v15" {...S} />
      <path d="m6 13 6 6 6-6" {...S} />
    </>
  ),
  chevron: (
    <>
      <path d="m6 9.5 6 6 6-6" {...S} />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" {...S} />
    </>
  ),
  drag: (
    <>
      <path d="M8.5 12h-5M20.5 12h-5" {...S} />
      <path d="m6.5 9.5-3 2.5 3 2.5M17.5 9.5l3 2.5-3 2.5" {...S} />
      <path d="M12 3v18" {...S} strokeDasharray="2 3" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5 13.9 9l6.6 3-6.6 3-1.9 6.5L10.1 15 3.5 12l6.6-3z" {...S} />
    </>
  ),

  /* ------------------------------------------------------------ brand marks */
  whatsapp: (
    <>
      <path
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zm-7.01 15.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"
        fill="currentColor"
      />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.2" {...S} />
      <circle cx="12" cy="12" r="4.1" {...S} />
      <circle cx="17.2" cy="6.9" r="1.15" fill="currentColor" />
    </>
  ),
  facebook: (
    <>
      <path
        d="M14.6 21.5V13.6h2.5l.4-3h-2.9V8.7c0-.87.24-1.46 1.5-1.46h1.6V4.55c-.28-.04-1.24-.12-2.35-.12-2.33 0-3.92 1.42-3.92 4.03v2.24H8.9v3h2.53v7.9"
        {...S}
      />
    </>
  ),
  youtube: (
    <>
      <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" {...S} />
      <path d="M10.6 9.4 15.4 12l-4.8 2.6z" fill="currentColor" />
    </>
  ),
  google: (
    <>
      <path d="M12 8.4a3.6 3.6 0 1 0 3.5 4.5H12" {...S} />
      <path d="M12 3.2a8.8 8.8 0 1 0 8.5 11.4h-8.5" {...S} opacity=".55" />
    </>
  ),
};

export function Icon({ name, size = 24, title, ...rest }: IconProps) {
  const decorative = !title;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {glyphs[name]}
    </svg>
  );
}
