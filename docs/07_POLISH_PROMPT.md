# 07_POLISH_PROMPT.md — Paste Into Claude Code

> Make sure 06_POLISH.md is in the docs/ folder first. Then paste everything
> between the === lines.

===

Read docs/06_POLISH.md fully before changing anything. It refines the v1 site
you already built. Doc 00_DESIGN_DIRECTION.md still governs philosophy:
spend boldness in ONE place, keep everything else disciplined, never drift to
the generic AI look.

Items in 06_POLISH.md are tagged [T1] (required — the craft that makes this
read as a 100-hour build) and [T2] (optional flair). In THIS pass, implement
ALL [T1] items only. Do NOT build any [T2] item yet (no panda, no paper-plane,
no hero 3D, no closing exit-intent beat) — I'll greenlight those one at a time
after T1 is verified.

Work in this order (from 06's BUILD ORDER):
1. Section A — all COPY changes (hero headline + subline + eyebrow, about
   heading + both paragraphs, stats relabel, footer microcopy). Use the exact
   replacement copy in doc 06. Remove every reference to AI/automation and
   every project-count from user-visible text.
2. B1 logo (full "Shubh Saxena", never "SB"), B2 color rework (use the new
   token values in 06 — update globals.css @theme as the single source),
   B3 cursor rebuild (smooth lead-dot + eased trailing ring + magnetic hover;
   delete the old laggy-dots implementation).
3. C-T1 — fix the hero so the build-assemble animation actually fires on a
   fresh load. Specifically check that usePrefersReducedMotion() does NOT
   default to true during SSR/first paint (must default motion-ON unless the
   user explicitly prefers reduced). Implement the refined hero sequence in 06.
4. D1 pricing ($100/$300/$700), D2 feature copy ("Complete website build",
   no page counts anywhere), D3 card motion upgrade (refined tilt + cursor-
   tracking glow + staggered scroll-in with Pro lock-in overshoot).
5. E1 — replace ALL "screenshot pending" grey boxes with designed brand tiles
   (gradient + wordmark in the site's visual language) so nothing looks
   unfinished; wire them to read from public/work/* if the real image exists,
   else render the designed tile. E2 work-section motion upgrade (alternating
   reveals, image parallax, chip stagger, hover zoom + corner bracket). Avoid
   literal "jiggle".
6. F1 — fill the contact section with the left-column "what happens next"
   3-step mono list and tighten spacing.

Then VERIFY before reporting (fix anything that fails):
- `npm run build` compiles clean, zero type errors.
- `npm run dev` serves 200; do a visual pass note.
- Reduced-motion path: with prefers-reduced-motion, all content shows in final
  state, no cursor, no timelines, no R3F.
- 360px width: nav collapses, headline clamps, cards stack, no overflow.
- Re-read 00's "What to consciously AVOID" + 06 section H — confirm no drift.

REPORT BACK:
1. Exact diff summary per file (what changed).
2. Any [T1] item you couldn't fully implement + why.
3. The list of real assets still needed from me (image paths + dimensions).
4. Confirmation the hero animation now fires (and what the bug was, if any).
5. `git add -A && git commit` with message "polish pass: T1 (copy, color,
   cursor, hero, services, work, contact)" — then the push command.

Do NOT ask me questions mid-pass. Make reasonable calls, note them at the end.
Do NOT touch any [T2] item. One pass, verify, report.

===
