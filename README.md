# RS FIT CLUB — website

The RS Fit Club site (Samantarapur, Mahavir Bazar, Bhubaneswar, Odisha): a complete, production-ready
marketing site — Home plus About, Programs, Trainers, Transformations, Membership, Schedule, Gallery,
Contact and a 404, with a working lead form and no missing pages, sections or states.

The site has **one job**: turn a phone visitor arriving from a WhatsApp / Instagram / Google link
into a free-trial enquiry, a call or a WhatsApp message. Frontend only — no backend, no CMS.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                                                             |
| `npm run build`     | `tsc -b` then `vite build` → `dist/`                                                        |
| `npm run preview`   | Serve the production build locally                                                          |
| `npm run typecheck` | `tsc -b --noEmit`                                                                           |
| `npm run lint`      | ESLint (flat config)                                                                        |
| `npm run format`    | Prettier over `src/**` and root config files                                                |
| `npm run assets`    | Rebuild logo / founder cutout derivatives from `FILES/` (needs Python + Pillow + numpy)     |
| `npm run photos`    | Rebuild the photo ladders and `src/data/photos.ts` from the club's shoot in `FILES/photos/` |

## Stack, and why

- **Vite + React 18 + TypeScript.** Small, fast, no framework tax for a mostly-static marketing page.
- **React Router 6** with `createBrowserRouter` and a lazy route per page; React, GSAP and Lenis are
  split into separate vendor chunks, so the home page never waits on a page nobody opened.
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
    ui/             Button, Icon, SectionHead, Marquee, BeforeAfter, Counter, Photo, MaskedLines,
                    RegistrationMarks, OwnerFigure, Logo
  context/          lead (which plan/source opened the form), intro loader state
  data/
    siteConfig.ts   ← every business fact on the site, in one file
    media.ts        image sets, srcsets, intrinsic ratios
  hooks/            useMediaQuery/useReducedMotion/useIsTouch, useFocusTrap, useSeo, useLenis
  lib/gsap.ts       one GSAP registration point
  pages/            Home + 8 interior pages (About … Contact) + 404, sharing InteriorPage.module.css
  styles/           tokens.css, fonts.css, global.css, utilities.css
  utils/            leads.ts, whatsapp.ts, analytics.ts, structuredData.ts, cx.ts
public/media/       founder cutout at stable URLs (the LCP preload points here)
```

## The one file to edit

`src/data/siteConfig.ts` holds every business fact: contact details, hours, location, the owner's
story, the team, prices, the timetable, transformation stories, reviews, stats and SEO copy.
Nothing else in the codebase hard-codes a client fact, so one edit here changes every place that
fact appears — including the JSON-LD, the footer and the metadata.

Values that are not yet confirmed by the club are **stand-ins**, each marked with a `STAND-IN`
comment in the file and listed in `CLIENT_CHECKLIST.md`. They are written to fit the club (real
services, real opening hours, plausible rates) so the site reads as finished, and each one is a
single value to overwrite.

Components still guard themselves with `isReal()`:

```ts
isReal(null); // false → the element hides instead of printing a blank
isReal('Bhubaneswar'); // true  → render it
```

That is why deleting a price removes just that price line, deleting every stat hides the whole
counter row, and emptying `siteConfig.transformations` swaps the story cards for an invitation
rather than a hole in the layout.

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

## Replace the photographs

The site currently shows **licensed photography** (Pexels, free for commercial use, credited in
`IMAGE_CREDITS.md`) so the layout reads as a finished design. Swapping in the club's own shoot is
three steps:

1. Drop the new files into `FILES/photos/` using the **same file names** (`floor-wide.jpg`,
   `team-strength.jpg`, `transform-before.jpg`, …).
2. Run `npm run photos` (Python + Pillow + numpy). It trims, crops to the slot's ratio and writes an
   AVIF + WebP ladder into `src/assets/img/`, then regenerates `src/data/photos.ts` with the alt text,
   credit line and intrinsic size for each frame.
3. Nothing else. No component reads a file name directly — they all take a slug from `photos.ts`, and
   the `sizes`/`srcset` hints are already tuned per slot.

Three frames are **not** stock any more: the two people on the team page and the trainer's figures are
the club's own photographs (`FILES/TRAINER img.png` → `FILES/photos/team-badal.jpg`, and the owner's
cut-out). The rest is still licensed stock, which is why the footer still carries the line
`Photography: licensed stock.` — trim it to `Photography: RS Fit Club.` from
`src/components/layout/Footer.tsx` once the last of the stock is gone.

The cut-outs are the exception to the pipeline above: the owner and the trainer live in
`public/media/` with **stable, unhashed names**, because the LCP preload in `index.html` points at
exact URLs and the 3D parallax figure composites them straight onto the page. Rebuild both with
`npm run assets` (`FILES/OWNER bg REMOVED.png` → 480/800/1200/1600 and
`FILES/TRAINER IMAGE BG REMOVED.png` → 480/800/1200, AVIF + WebP, alpha preserved). The trainer's
ratio is printed by that script as `trainer_master` and mirrored in `src/data/media.ts`.

`IMAGE_CREDITS.md` lists every frame with its licence, and `src/data/photos.ts` carries the credit
line next to each slug so attribution travels with the file. Regenerate the document with
`npm run credits` after either script has run.

## Lead capture

The form is complete — validation (10-digit Indian mobile, leading 6–9), inline errors announced in
a live region, honeypot, double-submit guard, loading/success/error states, and a pre-filled
WhatsApp hand-off on success. `submitLead()` in `src/utils/leads.ts` posts JSON to one of two places:

1. **`VITE_LEAD_ENDPOINT`**, when set — Formspree, a Google Apps Script web app, your own
   Express + Mongo API, anything that accepts JSON and answers 2xx.

   ```bash
   # .env  (never committed)
   VITE_LEAD_ENDPOINT=https://formspree.io/f/xxxxxxx
   ```

2. **With nothing configured**, a relay that needs no account: FormSubmit forwards the POST straight
   to the club's inbox (`siteConfig.business.email`). The **first** submission sends an activation
   email to that address — one click and every later enquiry is delivered. Until that click, the
   relay refuses and the visitor is told to call instead, which is the honest failure.

Either way the visitor never sees a success panel for a lead that was not sent: with no endpoint and
no address to relay to, a production build fails loudly and points at the phone number.

`buildWhatsAppLink()` in `src/utils/whatsapp.ts` builds the `wa.me` deep links; `trackEvent()` in
`src/utils/analytics.ts` forwards to `gtag`/`fbq` when they are present and is a no-op otherwise.
Events fired: `cta_click`, `call_click`, `whatsapp_click`, `form_start`, `form_submit`, `form_error`.

## SEO & access

Unique `<title>`/description per route (targeting "gym in Bhubaneswar / Samantarapur / Mahavir
Bazar"), canonical, Open Graph + Twitter cards, `robots.txt`, `sitemap.xml` and JSON-LD
`HealthClub` (address, hours, telephone, rating — all generated from config, so nothing stale is
published).

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
- Set `VITE_LEAD_ENDPOINT` in the host's environment variables if you are using a provider, then
  rebuild. With none set, the form uses the FormSubmit relay described above.
- `dist/index.html` is the only HTML file; assets are content-hashed and safe to cache forever.
- Before the first deploy: replace the `rsfitclub.in` placeholder in `siteConfig.seo.siteUrl` with the
  real domain, and work through `CLIENT_CHECKLIST.md`.

## Facts, and where they came from

1. **Verified from the club's Google Business listing**: the name, area, city, the eight services,
   the phone `+91 76098 81233`, Monday–Saturday hours (5:30 am – 10 pm), the Maps listing link, the
   rating (4.8 from 109 ratings) and the six reviews quoted on the home page — verbatim, under first
   names with initials.
2. **Verified from the club's public page** (earlier): the mission paraphrase and
   `rsfitness@gmail.com`.
3. **Supplied by the client**: the opening date (April 2020, so the years counter is derived rather
   than typed), the trainer's name and photograph, and the split of the four roles between the owner
   and the trainer.
4. **Stand-ins, written to fit the club and easy to replace**: the owner's story and quote, plan
   names and prices, the weekly timetable, the counter stats, three member
   transformation stories, the street line and PIN, the two-hour callback window, and the Sunday
   hours (the listing prints "Open 24 hours" for Sunday, which is how Google renders a day whose
   hours were never set, so the site quotes the same window as the rest of the week instead).
4. **Licensed photography**: the gallery, team portraits and both transformation frames are Pexels
   stock, credited in `IMAGE_CREDITS.md`.
5. **Font glyph note**: our self-hosted subsets do not include the Indian rupee sign (U+20B9), so the
   `₹` in a price renders from the device's system font. It looks correct everywhere it was tested;
   if the club ever wants a fully bespoke currency mark, that is a one-off asset.
6. **Not verified in this environment**: real iOS Safari behaviour (it uses `100svh`, safe-area
   insets and `transform`-only parallax to be safe there) and real 4× CPU throttling numbers on a
   mid-range Android. Both should be checked on a physical device before launch.
