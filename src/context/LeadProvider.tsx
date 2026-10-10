import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LEAD_SECTION_ID, LeadContext } from './lead';
import type { LeadRequest } from './lead';
import { scrollToTarget } from '../lib/scroll';
import { trackEvent } from '../utils/analytics';

/* ---------------------------------------------------------------------------
   Every "Free trial" affordance in the site — header, hero, sticky bar, plan
   cards, footer — routes through startLead(). That keeps three things true in
   one place: the scroll behaviour, the carried plan selection, and the
   analytics event. Without it each CTA would drift.
   --------------------------------------------------------------------------- */
export function LeadProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const scrollToForm = useCallback((attempt = 0) => {
    const el = document.getElementById(LEAD_SECTION_ID);
    if (el) {
      scrollToTarget(el, -8);
      return;
    }
    // Route just changed and the form has not mounted yet: try a few frames.
    if (attempt < 12) window.requestAnimationFrame(() => scrollToForm(attempt + 1));
  }, []);

  const startLead = useCallback(
    (request: Partial<LeadRequest> = {}) => {
      const nextPlan = request.plan ?? null;
      setPlan(nextPlan);
      setSource(request.source ?? null);

      trackEvent('cta_click', {
        source: request.source ?? 'unknown',
        plan: nextPlan ?? 'none',
        goal: request.goal ?? 'none',
      });

      if (pathRef.current !== '/') {
        navigate('/');
        // Wait for the home route to paint before measuring the form.
        window.setTimeout(() => scrollToForm(), 120);
      } else {
        scrollToForm(0);
      }
    },
    [navigate, scrollToForm],
  );

  const clearPlan = useCallback(() => {
    setPlan(null);
    setSource(null);
  }, []);

  const value = useMemo(
    () => ({ plan, source, startLead, clearPlan }),
    [plan, source, startLead, clearPlan],
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}
