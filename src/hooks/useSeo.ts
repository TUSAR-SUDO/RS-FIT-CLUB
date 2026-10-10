import { useEffect, useRef } from 'react';
import { siteConfig } from '../data/siteConfig';

/* ---------------------------------------------------------------------------
   Instead of react-helmet-async (≈14 kB for four tags) this hook writes the
   handful of head elements this site actually needs. Same result, no
   dependency, and no render-blocking work — it runs after paint.
   --------------------------------------------------------------------------- */

export interface SeoInput {
  title: string;
  description: string;
  /** Path beginning with "/" — appended to the configured site URL. */
  path: string;
  image?: string;
  /** Structured data. `null` clears any block left by the previous page. */
  jsonLd?: Record<string, unknown> | null;
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'rs-jsonld';

export function useSeo({ title, description, path, image, jsonLd, noindex }: SeoInput): void {
  /* Serialise the structured data so the effect only re-runs when its content
     actually changes — callers build it inline, so the object identity is new
     on every render. */
  const jsonLdRef = useRef(jsonLd);
  jsonLdRef.current = jsonLd;
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const url = `${siteConfig.seo.siteUrl.replace(/\/$/, '')}${path === '/' ? '/' : path}`;
    const ogImage = `${siteConfig.seo.siteUrl.replace(/\/$/, '')}${image ?? siteConfig.seo.ogImage}`;

    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setLink('canonical', url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    const payload = jsonLdRef.current;
    const existing = document.getElementById(JSON_LD_ID);
    if (payload) {
      const script = existing ?? document.createElement('script');
      script.id = JSON_LD_ID;
      (script as HTMLScriptElement).type = 'application/ld+json';
      script.textContent = JSON.stringify(payload);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, path, image, jsonLdKey, noindex]);
}
