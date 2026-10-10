import { createContext, useContext } from 'react';

export interface LeadRequest {
  /** Pre-selects a membership plan inside the form. */
  plan?: string;
  /** Pre-selects the goal select. */
  goal?: string;
  /** Where the request came from, for attribution in the submitted payload. */
  source: string;
}

export interface LeadContextValue {
  /** Currently pre-selected plan, or null. */
  plan: string | null;
  /** Set when the request came from somewhere other than the form itself. */
  source: string | null;
  /**
   * The single entry point every CTA uses: scrolls to the trial form (routing
   * home first when needed) and carries the plan/goal across.
   */
  startLead: (request?: Partial<LeadRequest>) => void;
  /** Clears the carried plan, called when the form unmounts. */
  clearPlan: () => void;
}

export const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead(): LeadContextValue {
  const value = useContext(LeadContext);
  if (!value) throw new Error('useLead must be used inside <LeadProvider>');
  return value;
}

/** DOM id of the trial form, referenced by the sticky bar's visibility check. */
export const LEAD_SECTION_ID = 'free-trial';
