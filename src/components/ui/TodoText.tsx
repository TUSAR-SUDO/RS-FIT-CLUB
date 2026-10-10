import { Fragment } from 'react';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------------------
   Any config string may contain placeholder tokens written as [LIKE THIS].
   This renders them with a dashed accent underline instead of quietly passing
   them off as real content — the club sees exactly what is still missing, and
   nobody can mistake "[OWNER NAME]" for a person.
   --------------------------------------------------------------------------- */

/** Global regex for splitting. */
const TOKEN_SPLIT = /(\[[^\]]+\])/g;
/** Anchored, non-global copy for testing — a /g/ regex with .test() is
    stateful and would match every other token. */
const TOKEN_MATCH = /^\[[^\]]+\]$/;

interface TodoTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'strong' | 'h3' | 'em';
}

export function TodoText({ text, className, as: Tag = 'span' }: TodoTextProps): ReactNode {
  const parts = text.split(TOKEN_SPLIT);

  return (
    <Tag className={className}>
      {parts.map((part, index) =>
        TOKEN_MATCH.test(part) ? (
          <span className="token" key={index} title="Placeholder — to be supplied by the club">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </Tag>
  );
}
