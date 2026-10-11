# RS Fit Club — details to review

The site is finished and ready to publish. Nothing on it is missing, and no page or section is
waiting on content.

What the club has **not** sent yet has been written as a **stand-in that fits the club** — the real
services, the real opening hours, sensible rates for a floor in Samantarapur — so the site reads as
finished rather than half-built. Each item below is a single value in `src/data/siteConfig.ts` (or one
photo file) to overwrite when you have the real thing.

Already live and verified from the club's Google listing: the name, area, the eight services, the
mobile number, Monday–Saturday hours, the Maps link, the 4.8 / 109 rating and six member reviews,
quoted word-for-word (typos included — the section promises unedited reviews).

---

## 1. Confirm these (they are live, so a mistake is visible)

- [ ] **Mobile `+91 76098 81233`** — tap-to-call in the header, hero, footer, sticky bar and contact
      page.
- [ ] **WhatsApp on the same number.** Every WhatsApp button points at it. If WhatsApp runs on a
      different number, send that one; if you would rather have no WhatsApp buttons at all, say so
      and they disappear everywhere.
- [ ] **Sunday hours** are published as **5:30 am – 10:00 pm**, the same as the rest of the week.
      Your listing prints "Open 24 hours" for Sunday, which Google also shows for a day whose hours
      were never set, so we did not claim the gym never closes. If Sunday really is different, send
      the hours.
- [ ] **The six reviews** on the home page — published under first names with initials and linked to
      your Google listing. Tell us if you want any of them taken down.
- [ ] **`rsfitness@gmail.com`** — live and clickable, and the address the enquiry form relays to.
      Confirm it is the inbox someone actually reads.
- [ ] **Callback window of 2 hours** — quoted next to the form. Change it if the desk needs longer.

## 2. Address

- [ ] **Street line and PIN.** The site currently says `Mahavir Bazar Road`, PIN `751002`, area
      Samantarapur. Send the building name and the exact PIN and we will update the address, the
      footer, the map card and the structured data in one edit.
- [ ] **The embedded map** is built from the address above (no coordinates needed). Send coordinates
      only if you want the pin moved to a specific gate.

## 3. The owner — this section carries the most trust

All of it is written for him, in his voice, and reads well — but it is not his words yet.

- [ ] **Name.** One of your reviews calls him "Suraj Sir, the owner", so the site publishes
      **Suraj**. Confirm, or send the spelling you want.
- [ ] **His story** — three short paragraphs. Read them out loud and change anything that does not
      sound like him. Voice notes are fine; we will shape it without changing the facts.
- [ ] **The pull-quote** ("You are not paying for the iron…").
- [ ] **Credentials**: Certified Personal Trainer, nutrition & diet planning, first aid & CPR. Send
      the real certificates and qualifications and we will print exactly those.
- [ ] Confirmation that we may use the `OWNER_bg_REMOVED.png` cutout, plus a second pose if he has
      one.

## 4. The team

Four cards are live with names, specialities and credits (**Rakesh Sahoo, Bikash Panda, Sunita
Mohanty, Priya Das**) and four licensed portraits.

- [ ] **Real names and qualifications** for the strength coach, the floor coach, the nutritionist and
      the group-class instructor.
- [ ] **Their photos** — portrait, shot straight on, plain background, vertical if possible.
- [ ] If the team is smaller or bigger than four, that is fine: add or delete an entry and the grid
      follows.

## 5. Membership

Live: **Monthly ₹1,200** (was ₹1,500), **Quarterly ₹3,000** (was ₹3,600, flagged "Most chosen"),
**Annual ₹9,600** (was ₹12,000). Diet consults and personal training are marked as add-ons.

- [ ] **The real rates.** This is the most important list to correct — a member reading a rate here
      and hearing a different one at the desk is a real problem. Send the current prices and any
      offer that is running.
- [ ] **Plan names**, if you sell something other than Monthly / Quarterly / Annual.
- [ ] **What each plan includes**, and which items genuinely cost extra.
- [ ] **Joining fee, freeze or cancellation terms, accepted payment methods** — if you want them
      printed. Today the page says add-ons are charged separately and to ask at the desk.
- [ ] Should a different plan carry the **"Most chosen"** tag?

## 6. Timetable

Live: fourteen slots across the week (strength, weights, cardio, Zumba, aerobics, one-to-one and an
open floor session on Sunday), all inside the published 5:30 am – 10 pm.

- [ ] **The real weekly pattern** — which class on which day, at what time. Until then a member might
      arrive for a class that is not running, so this is worth sending early.
- [ ] Are Zumba and aerobics on the same day or separate days?
- [ ] Anything seasonal, paused or weather-dependent?

## 7. Numbers and transformations

Live: counters reading **400+ members**, **8 years**, **6 coaches & nutritionists**, **42 sessions a
week**, and three member stories (Rakesh, Sneha, Debasish) beside a before/after slider.

- [ ] **The four numbers**, so the counters tell the truth. Delete any you would rather not publish.
- [ ] **Three consented before/after pairs** with a first name, the goal, and how long it took — then
      the current sample pairs are replaced.
- [ ] Written consent from each member whose photo goes up. A WhatsApp "yes, put mine" is enough as
      long as we keep it.
- [ ] If you would rather not show before/afters at all, say so and the section is replaced.

## 8. Photography

The gallery, team cards, transformation slider and the floor shots are **licensed stock** (Pexels,
free for commercial use, every frame credited in `IMAGE_CREDITS.md`). The footer says so in small
print.

- [ ] **Gym floor, wide** — lights on, shot from the door at eye level.
- [ ] **Rack and plate tree** — cleared of bags and bottles.
- [ ] **One Zumba or aerobics class** mid-song, with consent from everyone in frame.
- [ ] **The cardio line** during an evening session.
- [ ] **A coach writing an exercise card** with a member, hands and paper in frame.
- [ ] **Two or three consented before/after pairs** — same corner, same lights.
- [ ] **A short vertical clip** of the floor at 7 pm, for social.

Send them at full resolution straight off the phone; the build script resizes and re-encodes them.
Drop them into `FILES/photos/` with the same file names and run `npm run photos`.

## 9. Admin

- [ ] **Instagram / Facebook / YouTube URLs** — paste them and the icons appear in the footer and the
      mobile menu. Right now no social icons show: a link to a front page is worse than no link.
- [ ] **Domain name.** The site ships with `https://rsfitclub.in` as the placeholder. Confirm the real
      domain, or register that one — nothing else needs changing.
- [ ] **The footer credit** currently reads "Website by Codebuff". Send the name you want printed, or
      say "no credit".

## 10. Things worth confirming

- [ ] That the eight services (Weight Training, Strength Training, Cardio, Zumba, Aerobics, Personal
      Training, Diet Planning, Exercise Card Planning) are complete and current.
- [ ] That "Samantarapur, Mahavir Bazar" is the right area description for search engines.
- [ ] That this is **RS FIT CLUB, Bhubaneswar** — not the similarly named businesses in other cities.
- [ ] Any claim you do **not** want on the site. We deliberately avoid weight-loss promises and
      medical outcomes, because they create liability for you.

## 11. Before the first publish

- [ ] Set the real domain in `siteConfig.seo.siteUrl`.
- [ ] Decide how enquiries should arrive: leave the form as it is (relayed to the club's inbox — the
      first enquiry triggers an activation email you must click), or give us a form endpoint such as
      Formspree and enquiries land in a dashboard instead.
- [ ] Send one test enquiry through the live site and confirm it arrived.
