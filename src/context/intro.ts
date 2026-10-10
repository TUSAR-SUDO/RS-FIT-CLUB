import { createContext, useContext } from 'react';

/**
 * True once the intro loader has handed over (or immediately, when no intro
 * plays). The hero holds its entrance animation until this flips, so the
 * headline reveal is never wasted behind the loader.
 *
 * Defaults to `true` so a component rendered outside the provider still
 * animates rather than staying hidden.
 */
export const IntroDoneContext = createContext(true);

export function useIntroDone(): boolean {
  return useContext(IntroDoneContext);
}
