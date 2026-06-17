# 00_DESIGN_DIRECTION.md — The Thesis

> Read this first. Every other doc derives from it. If a later instruction
> contradicts this file, this file wins.

## The one decision everything hangs on

Most "AI developer" portfolios hide the AI and pretend a person hand-typed
every line. Yours does the opposite. **The thesis of this site is: Shubh is
an operator who directs AI to ship real products faster than traditional
teams.** That is literally true — Breathify, Cortex, the Furniture viewer,
Hermes briefs. The site is honest about the method and makes it the flex.

If a visitor (especially a 40–60yo software engineer in the Discord network)
lands on this and thinks "templated AI portfolio," we failed. They should
think "this kid runs a build pipeline."

## Why not the obvious version

The generic AI portfolio right now is one of three looks: cream background +
serif display + terracotta accent; near-black + one acid accent; or a
newspaper/broadsheet grid. We are deliberately NOT doing any of those as a
default. We earn our look from the subject: a **build console / control
surface**. Think the calm, precise feeling of a good developer tool (Linear,
Vercel dashboard, a terminal) — not a creative-agency splash page.

## Visual concept: "The Build Surface"

The page reads like an operator's console rendered with taste. Not a literal
fake terminal (that's a cliché too) — but the *grammar* of one:

- Monospaced labels and metadata, like a status line.
- A fine baseline grid that's faintly visible, like a design tool canvas.
- Content that appears as if being "executed" — built, deployed, shipped.
- A live, quiet status indicator ("● available · IST") like a real dashboard.
- Real numbers from real projects, not invented vanity stats.

The boldness is spent in ONE place: the hero "build" moment (see SIGNATURE).
Everything else stays disciplined and quiet.

## Palette — "Console" (4 core + 2 utility)

```
--ink:      #0B0D10   /* near-black base for text & dark sections      */
--paper:    #F2F0EB   /* warm light, but NOT the cream cliché — greyer */
--surface:  #FFFFFF   /* cards / raised panels                          */
--signal:   #3D5AFE   /* electric indigo-blue — the single bright voice */
--grid:     #D8D6CF   /* faint canvas grid lines on paper               */
--muted:    #6B7178   /* metadata, captions, monospace labels           */
```

Rule: `--signal` appears sparingly — active states, the live dot, one or two
key words, the primary CTA. If it's everywhere, it's worth nothing.
Dark sections invert: --ink background, --paper text, --signal unchanged.

## Type — three roles, deliberately not the usual pairing

```
Display  → "Space Grotesk"   weight 500–700. Technical, slightly mechanical,
                              not a fashion serif. Carries headings.
Body     → "Inter"           weight 400–500. Neutral, legible workhorse.
Mono     → "JetBrains Mono"  weight 400–500. Status lines, labels, metadata,
                              project specs, the "operator" voice.
```

All three load via `next/font/google` (zero layout shift). The mono face is
not decoration — it's the device that signals "this is a working surface,"
so use it for every label/eyebrow/spec, never for body prose.

## SIGNATURE — the one thing this page is remembered by

**The hero "build log" execution.** On load, after the counter, the hero
headline doesn't just fade in — it *assembles* like a build finishing:

1. A mono status line types out at top:
   `> initializing shubh.build …` then `> ready` (turns --signal).
2. The headline lines snap into place one at a time, each preceded for a
   split second by a mono ghost of itself (like a value resolving).
3. A single thin --signal line sweeps left→right under the headline = "done."

This is the moment. It's earned (it IS a build pipeline), it's not a generic
gradient, and it ties directly to the thesis. Everything else is calm so this
lands. Reduced-motion users get the final state instantly, no animation.

## The cursor (your requested neon-dust, but disciplined)

Default cursor hidden on desktop (pointer devices only). A small --signal dot
follows the pointer; behind it, a short particle trail in --signal/--muted
that lengthens and brightens with velocity, fades in ~450ms. It reads as
"signal moving across a console," not party confetti. Hidden entirely on
touch + when prefers-reduced-motion is set. Never blocks clicks
(pointer-events: none).

## Copy voice

Operator's log, not marketing fluff. Short, declarative, specific. Numbers
over adjectives. No "passionate," no "I build first impressions," no
"crafting digital experiences." Examples of the register:

- Eyebrow:  `OPERATOR · INDIA · UTC+5:30`
- Headline: "I direct AI to ship real products."
- Subline:  "17. Self-taught. Three shipped builds and counting."

Every label should sound like it came off a status line.

## Quality floor (non-negotiable, don't announce it)

Responsive to 360px wide. Visible keyboard focus rings (use --signal).
prefers-reduced-motion fully respected (kills loader animation, cursor trail,
scroll reveals → show final states). Color contrast AA. Lighthouse ≥ 90.
Semantic HTML (header/main/section/footer, real h1→h3 order).

## What to consciously AVOID (so we don't drift to default)

- ❌ Cream (#F4F1EA-ish) + big serif + terracotta.
- ❌ Numbered 01/02/03 markers on the service cards (order carries no
     real meaning there → don't fake a sequence). Use named tiers instead.
- ❌ Generic "gradient mesh" hero background.
- ❌ Invented stats ("500+ happy clients"). Use only true numbers.
- ❌ Stock photos of laptops/offices.
- ❌ Three.js on the portfolio itself — save real 3D for the Elite *demo*,
     keep the portfolio fast and sharp. The portfolio sells the operator,
     not a tech demo.
