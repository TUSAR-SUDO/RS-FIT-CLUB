import { siteConfig, isReal } from '../data/siteConfig';

export interface WhatsAppContext {
  name?: string;
  goal?: string;
  plan?: string;
  source?: string;
}

/**
 * Build a wa.me deep link with a pre-filled, human-sounding message.
 * Returns null when the club has not supplied a number yet, so callers can
 * fall back to the phone/contact form instead of shipping a broken link.
 */
export function buildWhatsAppLink(context: WhatsAppContext = {}): string | null {
  const number = siteConfig.contact.whatsappNumber;
  if (!isReal(number)) return null;

  return `https://wa.me/${number}?text=${encodeURIComponent(buildMessage(context))}`;
}

export function buildMessage({ name, goal, plan, source }: WhatsAppContext = {}): string {
  const club = siteConfig.business.spokenName;
  const parts: string[] = [`Hi ${club},`];

  if (name && name.trim()) {
    parts.push(`I'm ${name.trim()}.`);
  } else {
    parts.push('I found you through the website.');
  }

  if (plan) {
    parts.push(`I'm interested in the ${plan} plan.`);
  }
  if (goal) {
    parts.push(`My goal is ${goal.toLowerCase()}.`);
  }

  if (parts.length === 1) parts.push(siteConfig.contact.whatsappMessage);

  parts.push('Can you tell me about the free trial session?');
  if (source) parts.push(`(Sent from ${source})`);

  return parts.join(' ');
}
