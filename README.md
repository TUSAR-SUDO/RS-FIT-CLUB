# RS FIT CLUB — website

Phase 1 of the RS Fit Club site (Samantarapur, Mahavir Bazar, Bhubaneswar, Odisha): project
scaffold, design system, global shell and a fully built **Home page**. Every other route is a
designed placeholder stub, ready for Phase 2.

The site has **one job**: turn a phone visitor arriving from a WhatsApp / Instagram / Google link
into a free-trial enquiry, a call or a WhatsApp message. Frontend only — no backend, no CMS.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                                                               |
| `npm run build`     | `tsc -b` then `vite build` → `dist/`                                                          |
| `npm run preview`   | Serve the production build locally                                                            |
| `npm run typecheck` | `tsc -b --noEmit`                                                                             |
| `npm run lint`      | ESLint (flat config)                                                                          |
| `npm run format`    | Prettier over `src/**` and root config files                                                  |
| `npm run assets`    | Rebuild logo / photo derivatives from the masters in `FILES/` (needs Python + Pillow + numpy) |

## Stack, and why

- **Vite + React 18 + TypeScript.** Small, fast, no framework tax for a mostly-static marketing page.
- **React Router 6** with `createBrowserRouter` and a lazy route per page. Each stub page is ~1 kB of
  its own JS; React, GSAP and Lenis are split into separate vendor chunks.
- **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`) for the scroll scenes: hero parallax, masked
  headline reveals, the desktop pinned programmes rail, clip-path image reveals.
- **Lenis** for smooth scrolling on desktop only. Touch keeps native momentum
  (`syncTouch: false`) — hijacking a phone's scroll is the fastest way to feel cheap.
- **CSS Modules + custom properties.** No UI kit, no Tailwind. Every colour, size, duration and
  easing is a token in `src/styles/tokens.css`; components never hard-code a colour.
- **No icon library.** One hand-drawn inline SVG family (`src/components/ui/Icon.tsx`) at a
  consistent stroke weight. No emoji anywhere.

Self-hosted fonts via `@fontsource-variable` (Unbounded for display, Manrope for text) — no
render-blocking `<link>` to Google.

## Structure

```
src/
  assets/brand/     logo derivations (AVIF/WebP, hashed by Vite)
  assets/tex/       grain tile
  components/
    layout/         Header, MobileMenu, MobileActionBar, Footer, IntroLoader, PageTransition, Layout
    motion/         Sparks.tsx (lazy-loaded particle field)
    sections/home/  one folder per Home section: .tsx + .module.css
    ui/             Button, Icon, SectionHead, Marquee, BeforeAfter, Counter, ImagePlaceholder,
                    MaskedLines, RegistrationMarks, OwnerFigure, Logo, TodoText
  context/          lead (which plan/source opened the form), intro loader state
  data/
    siteConfig.ts   ← EVERY client fact and placeholder lives here
    media.ts        image sets, srcsets, intrinsic ratios
  hooks/            useMediaQuery/useReducedMotion/useIsTouch, useFocusTrap, useSeo, useLenis
  lib/gsap.ts       one GSAP registration point
  pages/            Home + 9 routed placeholders + 404
  styles/           tokens.css, fonts.css, global.css, utilities.css
  utils/            leads.ts, whatsapp.ts, analytics.ts, structuredData.ts, cx.ts
public/media/       founder cutout at stable URLs (the LCP preload points here)
```

## The one file to hand a non-developer

`src/data/siteConfig.ts` holds every business fact. Components read from it and use `isReal()` to
decide whether a value is genuine:

```ts
isReal('[OWNER NAME]'); // false → the element hides or shows a token
isReal('Bhubaneswar'); // true  → render it
```

That is why an unconfirmed phone number produces **no** `tel:` link rather than a dead one, why the
counter row disappears while the stats are `null`, and why no testimonial is ever shown until a real
one exists. `CLIENT_CHECKLIST.md` is the list of what to collect.

## Swap the accent colour

`src/styles/tokens.css` — one line, and the whole site follows (buttons, hairlines, glows, focus
rings, the loader, the marquee band, the mobile action bar):

```css
--accent: #fc0273; /* hot pink sampled from LOGO.png */
--accent-ink: #08000b; /* text that sits on the accent fill — keep contrast ≥ 4.5:1 */
--accent-deep: #a2014a; /* gradients and pressed states */
```

To go back to the orange of the original reference, set `--accent: #ff5a1f`, `--accent-deep: #b23a0c`
and keep `--accent-ink` dark.

## Replace images

Photo slots are deliberately **labelled placeholder frames** (`ImagePlaceholder`) — never stock
photos. Each one names the shot to take ("Gym floor, wide shot", "Member photo — day one", …) and
its ratio, so a photographer can work straight from the page.

1. Drop the new file over the matching slot in `src/components/sections/home/*`,
   replacing `<ImagePlaceholder label="…" ratio="…" />` with an `<img>` carrying `srcset`, `sizes`,
   `width`/`height` and `loading="lazy" decoding="async"`.
2. Derivatives are generated by `python scripts/build_assets.py` from the masters in `FILES/`
   (logo at 320/640/960, founder cutout at 480/800/1200/1600, AVIF + WebP, alpha preserved).
3. The founder cutout lives in `public/media/` with **stable, unhashed names** because the LCP
   preload in `index.html` has to point at exact URLs. Keep those names if you replace it, or update
   both places.

## Connect the lead form

The form is complete — validation (10-digit Indian mobile, leading 6–9), inline errors announced in
a live region, honeypot, double-submit guard, loading/success/error states, and a pre-filled
WhatsApp hand-off on success. It currently resolves against an in-memory simulation.

Open `src/utils/leads.ts` and set one variable:

```bash
# .env  (never committed)
VITE_LEAD_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Any JSON-accepting endpoint works — Formspree, a Google Apps Script web app, or your own
Express + Mongo API. The payload shape and the `submitLead()` contract are documented in
`src/utils/leads.ts`. `buildWhatsAppLink()` in `src/utils/whatsapp.ts` builds the `wa.me` deep links;
`trackEvent()` in `src/utils/analytics.ts` forwards to `gtag`/`fbq` if they are present, and is a
no-op otherwise. Events fired: `cta_click`, `call_click`, `whatsapp_click`, `form_start`,
`form_submit`, `form_error`.

## SEO & access

Unique `<title>`/description per route (targeting "gym in Bhubaneswar / Samantarapur / Mahavir
Bazar"), canonical, Open Graph + Twitter cards, `robots.txt`, `sitemap.xml` and JSON-LD
`HealthClub` (address, geo, hours, telephone — all from config, so nothing false is published).

Accessibility: skip link, semantic landmarks, one `h1` per page, focus trap in the mobile menu and
sheet, Escape to close, visible focus rings, keyboard-operable before/after slider (arrow keys),
`aria-live` for form status, `aria-hidden` on the sticky bar while it is off screen, ≥ 44px tap
targets, `prefers-reduced-motion` honoured throughout (loader, parallax, marquee, particles, counters
all degrade to a static state).

## Deploy

Static output — any static host works.

- **Vercel / Netlify:** build `npm run build`, publish `dist/`. The host must rewrite unknown paths
  to `/index.html` (SPA fallback). Vercel's Vite preset does this; on Netlify add
  `/* /index.html 200`.
- Set `VITE_LEAD_ENDPOINT` in the host's environment variables, then rebuild.
- `dist/index.html` is the only HTML file; assets are content-hashed and safe to cache forever.

## Phase 1 scope, and what is not here

Built: Home (all sections in the brief), the global shell (header, full-screen mobile menu, sticky
action bar, footer, intro loader, page transitions), 9 routed placeholder pages and a 404.
Not here, by design: any other page's real content, a backend/CMS, auth, payments, analytics IDs.

## Assumptions and unverified items

1. **Verified** (from the club's public listing): the name, area, city, the eight services, the
   mission paraphrase, and the email `rsfitness@gmail.com` — the last one still needs confirming
   before launch (it is shown, and flagged in `CLIENT_CHECKLIST.md`).
2. **Everything else is a placeholder**: owner's name, story and certifications, phone/WhatsApp,
   hours, street address and PIN, map links, social URLs, team, timetable times, prices and plan
   names, stats, reviews, before/after photos, Google reviews link and the footer credit.
3. **Not invented, on purpose**: no member counts, no years in business, no ratings, no testimonials,
   no prices, no "always open". Unsupplied numbers hide rather than round up.
4. **Font glyph note**: our self-hosted subsets do not include the Indian rupee sign (U+20B9), so the
   `₹` in a price renders from the device's system font. It looks correct everywhere it was tested;
   if the club ever wants a fully bespoke currency mark, that is a one-off asset.
5. **Not verified in this environment**: real iOS Safari behaviour (it uses `100svh`, safe-area
   insets and `transform`-only parallax to be safe there) and real 4× CPU throttling numbers on a
   mid-range Android. Both should be checked on a physical device before launch.
