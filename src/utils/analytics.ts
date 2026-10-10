/* ---------------------------------------------------------------------------
   ANALYTICS STUB
   Fires to whatever tag manager happens to be installed. Nothing is loaded by
   this file — if gtag/fbq/plausible are absent, the calls are silent no-ops,
   so the site ships with zero third-party scripts until the client adds them.

   Hook a real provider up by dropping its snippet in index.html; the events
   below already cover the whole conversion path.
   --------------------------------------------------------------------------- */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (event: string, options?: { props?: Params }) => void;
  }
}

export type EventName =
  | 'cta_click'
  | 'call_click'
  | 'whatsapp_click'
  | 'form_start'
  | 'form_submit'
  | 'form_error'
  | 'plan_select'
  | 'map_load'
  | 'nav_click'
  | 'video_play';

const EVENT_LABELS: Record<EventName, string> = {
  cta_click: 'CTA Click',
  call_click: 'Call Click',
  whatsapp_click: 'WhatsApp Click',
  form_start: 'Form Start',
  form_submit: 'Form Submit',
  form_error: 'Form Error',
  plan_select: 'Plan Select',
  map_load: 'Map Load',
  nav_click: 'Nav Click',
  video_play: 'Video Play',
};

export function trackEvent(name: EventName, params: Params = {}): void {
  if (typeof window === 'undefined') return;

  const payload = { ...params, event_category: 'rsfitclub' };

  // Debug breadcrumb in development so the funnel is visible without a tool.
  if (import.meta.env.DEV) {
    console.info(`[analytics] ${name}`, payload);
  }

  try {
    window.gtag?.('event', name, payload);
    window.fbq?.('trackCustom', EVENT_LABELS[name], payload);
    window.plausible?.(name, { props: payload });
  } catch {
    /* Analytics must never break the page. */
  }
}
