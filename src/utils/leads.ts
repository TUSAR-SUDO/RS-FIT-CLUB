/* ---------------------------------------------------------------------------
   LEAD CAPTURE

   The form is live. `submitLead` validates, then POSTs JSON to an endpoint:

     1. VITE_LEAD_ENDPOINT, when set (Formspree, Google Apps Script, your own
        Express API — anything that accepts JSON and answers 2xx).
     2. Otherwise it falls back to a relay that needs no account: FormSubmit
        forwards the POST straight to the club's inbox at
        siteConfig.business.email. The FIRST submission triggers an activation
        email to that address — one click and every later enquiry is delivered.
        Until that click happens the relay answers with an error, which is why
        the failure message tells the visitor to call instead.

   With no endpoint and no email to relay to, a development build logs the
   submission and a production build fails honestly rather than showing a
   success panel for a lead nobody received.
   --------------------------------------------------------------------------- */

import { isReal, siteConfig } from '../data/siteConfig';
import { trackEvent } from './analytics';

export interface LeadPayload {
  name: string;
  phone: string;
  goal: string;
  preferredTime: string;
  /** Optional: pre-selected membership plan, set when the form is opened from a plan card. */
  plan?: string;
  /** Optional free-text note. */
  message?: string;
  /** Anti-spam honeypot. Must stay empty; a filled value means a bot. */
  company?: string;
  /** Where on the page the form was submitted from, for attribution. */
  source?: string;
}

export interface LeadResult {
  ok: boolean;
  /** Message safe to render to the visitor. */
  message: string;
}

export class LeadValidationError extends Error {
  field: keyof LeadPayload;
  constructor(field: keyof LeadPayload, message: string) {
    super(message);
    this.name = 'LeadValidationError';
    this.field = field;
  }
}

/* --------------------------------------------------------------- validation */

/** Indian mobile numbers: optional +91 / 0 prefix, then a 6-9 leading digit. */
export function normalisePhone(raw: string): string {
  return raw.replace(/[^\d]/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '');
}

export function validatePhone(raw: string): string | null {
  const digits = normalisePhone(raw);
  if (!digits) return 'Enter a phone number so we can call you back.';
  if (digits.length !== 10) return 'Enter a 10-digit mobile number.';
  if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers start with 6, 7, 8 or 9.';
  return null;
}

export function validateName(raw: string): string | null {
  const value = raw.trim();
  if (!value) return 'Please tell us your name.';
  if (value.length < 2) return 'That name looks a little short.';
  return null;
}

/* -------------------------------------------------------------- submission */

/** Last lead captured, kept in memory for manual verification. */
let lastLead: LeadPayload | null = null;
export const getLastLead = (): LeadPayload | null => lastLead;

/** A configured endpoint always wins; the relay is the zero-setup fallback. */
const CONFIGURED: string | undefined = import.meta.env.VITE_LEAD_ENDPOINT || undefined;

const RELAY: string | undefined = isReal(siteConfig.business.email)
  ? `https://formsubmit.co/ajax/${siteConfig.business.email}`
  : undefined;

const ENDPOINT: string | undefined = CONFIGURED ?? RELAY;

/** True when we are posting through the relay, which needs its own field names. */
const VIA_RELAY = !CONFIGURED && Boolean(RELAY);

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const nameError = validateName(payload.name);
  if (nameError) throw new LeadValidationError('name', nameError);

  const phoneError = validatePhone(payload.phone);
  if (phoneError) throw new LeadValidationError('phone', phoneError);

  if (!payload.goal) throw new LeadValidationError('goal', 'Pick a goal so we can plan for you.');

  // Honeypot: silently succeed so bots do not learn they were caught.
  if (payload.company) {
    return { ok: true, message: 'Thanks — we will be in touch.' };
  }

  const outgoing: LeadPayload = {
    ...payload,
    name: payload.name.trim(),
    phone: normalisePhone(payload.phone),
  };

  lastLead = outgoing;

  if (!ENDPOINT) {
    /* Nowhere to send it. In development that is a logged no-op; in a production
       build it is a failure, because a success panel for a lead nobody received
       is the worst possible outcome for this site. */
    if (import.meta.env.DEV) {
      console.info('[leads] no endpoint configured — logging the submission only', outgoing);
      await sleep(400);
      trackEvent('form_submit', { mode: 'dev-only', goal: outgoing.goal });
      return {
        ok: true,
        message: `Got it, ${outgoing.name.split(' ')[0]}. We will call you about your free trial.`,
      };
    }
    trackEvent('form_error', { reason: 'no-endpoint' });
    return {
      ok: false,
      message: `That did not go through. Call us on ${siteConfig.contact.phoneDisplay} and we will sort it out.`,
    };
  }

  const body = VIA_RELAY
    ? {
        ...outgoing,
        /* Relay-only fields. `_subject` is the subject line of the email the
           club receives; `_template: 'table'` keeps it readable on a phone. */
        _subject: `Free trial — ${outgoing.name} (${outgoing.phone})`,
        _template: 'table',
        _captcha: 'false',
      }
    : outgoing;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Endpoint responded ${response.status}`);

    /* The relay answers 200 with { success: "false", message } when it refuses
       (most often because the inbox has not clicked its activation email yet),
       so a 2xx alone is not proof of delivery. */
    if (VIA_RELAY) {
      const result = (await response.json().catch(() => null)) as {
        success?: string;
        message?: string;
      } | null;
      if (result && String(result.success) === 'false') {
        throw new Error(result.message || 'Relay refused the submission');
      }
    }

    trackEvent('form_submit', { mode: 'live', goal: outgoing.goal, time: outgoing.preferredTime });
    return {
      ok: true,
      message: `Got it, ${outgoing.name.split(' ')[0]}. We will call you about your free trial.`,
    };
  } catch (error) {
    console.error('[leads] submission failed', error);
    trackEvent('form_error', { reason: 'network' });
    return {
      ok: false,
      message: `That did not go through. Call us on ${siteConfig.contact.phoneDisplay} and we will sort it out.`,
    };
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
