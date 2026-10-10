# Design rationale (short version)

**Type.** One display face, **Unbounded** — a wide, cut-corner geometric that echoes the angular
lettering in the RS FIT CLUB wordmark without copying it. One body face, **Manrope**, for legibility
on mid-range Android screens. Two families, self-hosted, no render-blocking Google link. Widths were
measured rather than guessed: "TRANSFORMATIONS" is ~12.7em wide in Unbounded, and that single number
sets the mobile menu size.

**Colour.** The reference was black-and-orange; the client's logo is hot pink on black (sampled
`#fc0273`). Orange beside magenta fights, so the accent is the logo's own pink, used sparingly —
CTAs, one keyword per headline, hairlines, hover. Silver/white carries everything else. Every value
is a custom property in `tokens.css`, so switching to orange is a one-line change.

**Signature elements.** Chamfered corners (never `border-radius`), hairline rules, section numerals,
registration marks, a light grain, and one big diagonal slash lifted from the logo's R. Motion is
layered hero parallax, word-by-word masked headline reveals, a scroll-velocity marquee, and a
drag/keyboard before-after slider — all transform/opacity, all disabled under `prefers-reduced-motion`.

**The honest rule.** Nothing is invented. Unconfirmed values render as `[TOKENS]`, and statistics,
reviews and prices stay hidden until they are real.
