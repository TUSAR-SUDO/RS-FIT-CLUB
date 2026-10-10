/** Join truthy class names. Keeps JSX readable without pulling in a library. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
