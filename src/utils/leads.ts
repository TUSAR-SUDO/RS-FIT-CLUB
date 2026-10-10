/* ---------------------------------------------------------------------------
   LEAD CAPTURE — FRONTEND STUB

   Phase 1 has no backend. `submitLead` performs real validation, then either
   posts to VITE_LEAD_ENDPOINT (if you have one) or resolves against an
   in-memory simulation so the whole form flow — loading, success, error,
   double-submit guard — can be built and reviewed properly.

   >>> PLUG A REAL ENDPOINT IN HERE <<<
   Set VITE_LEAD_ENDPOINT in .env to any of:
     · Formspree            https://formspree.io/f/xxxxxxx
     · Google Apps Script    https://script.google.com/macros/s/xxx/exec
     · your own Express+Mongo API   https://api.rsfitclub.in/leads
   The payload shape below is what your endpoint receives.
   --------------------------------------------------------------------------- */

import { siteConfig } from '../data/siteConfig';
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

/** Last lead captured, kept in memory for the stub + manual verification. */
let lastLead: LeadPayload | null = null;
export const getLastLead = (): LeadPayload | null => lastLead;

const ENDPOINT: string | undefined = import.meta.env.VITE_LEAD_ENDPOINT || undefined;

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
    // ---- SIMULATION: no endpoint configured (Phase 1 default) -------------
    console.info(
      '[leads] simulated submission — connect a real endpoint in src/utils/leads.ts',
      outgoing,
    );
    await sleep(750);
    trackEvent('form_submit', { mode: 'stub', goal: outgoing.goal, time: outgoing.preferredTime });
    return {
      ok: true,
      message: `Got it, ${outgoing.name.split(' ')[0]}. We will call you about your free trial.`,
    };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(outgoing),
    });

    if (!response.ok) throw new Error(`Endpoint responded ${response.status}`);

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
