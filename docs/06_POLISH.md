# 06_POLISH.md — Polish Pass (v1 → premium)

> Read AFTER 00–03. This refines the shipped v1. Doc 00 still wins on
> philosophy: spend boldness in ONE place, keep the rest disciplined. Every
> item below is tagged **[T1]** (do it — this is what makes a site read as a
> 100-hour build) or **[T2]** (optional flair — build ONLY after all T1 in
> that section is smooth; if T2 makes it feel busy or toy-like, cut it).
>
> The single most important changes here are the COPY changes. They're not
> cosmetic — they fix a positioning leak that costs real clients. Do them
> first, they're free.

---

## A. COPY — positioning fix [T1, do first, highest priority]

Problem with v1 copy: it advertises *how* the work is made (AI), and it
*counts* output. Both hand the client a reason to discount Shubh — "if it's
AI I'll find someone cheaper," and "only 3 projects?". Fix: sell the
*outcome*, never the method or the count. The AI is Shubh's private leverage,
not the pitch.

### Hero
- Headline → **"I turn ambitious ideas into real-world products."**
  (highlight "real-world products" in the signal color.)
- Subline → drop the number + "self-taught". Replace with a capability/
  outcome line that implies range without counting:
  **"Design, build, ship. Websites and products that earn their keep."**
  (alt: "From first sketch to live product — built to perform.")
- Eyebrow: keep `OPERATOR · INDIA · UTC+5:30` OR soften to
  `INDEPENDENT BUILDER · INDIA` — Shubh's pick. No AI words.

### About
- Heading → **"Young, but already shipping."** (final — use exactly this)
- Rewrite both paragraphs. NO "AI as a build crew," NO "direct AI tools,"
  NO counting. New copy:
  > Para 1: "I'm Shubh — an independent developer from India. I take an idea
  > that only half-exists and turn it into something real, fast: designed,
  > built, and shipped to production. I care about the part clients actually
  > feel — speed, polish, and a result that works."
  > Para 2: "My range runs from storefronts to full products — e-commerce,
  > a local-first desktop app, a 3D product viewer. Whatever the brief, I
  > treat it like my own name is on it. Because it is."
- Stats: REPLACE the counting stat. Instead of "3 · Products shipped":
  - **"248h"** · `LAST BUILD` (or `HOURS / BUILD` — implies depth, not scarcity)
  - keep **"7"** · `DAY TURNAROUND`
  - keep **"24h"** · `REPLY TIME`
  > Rationale: hours-of-craft frames you as thorough; a project *count*
  > frames you as new. Same honesty, better framing.

### Footer microcopy
- Change "directed, not typed." → **"built with intent."** (kills the AI tell).

---

## B. GLOBAL — identity, color, cursor [T1]

### B1. Logo
- Replace `SB` monogram with full **"Shubh Saxena"** in the display face,
  tight tracking, signal-colored period or accent. Mobile: keep "Shubh
  Saxena" if it fits ≥360px; else "Shubh S." Never bare "SB".

### B2. Color rework — from "comfy" to "engineered"
v1 reads soft/beige. Push it to a sharper, more premium console palette.
Keep light-but-not-cream; deepen contrast; make the signal hotter.

```
--ink:      #0A0A0B   /* near-black, colder than before            */
--paper:    #ECEAE3   /* light, a touch cooler/greyer than v1       */
--surface:  #FFFFFF
--signal:   #2B4BFF   /* hotter electric blue, more voltage         */
--signal-2: #6C8BFF   /* lighter signal for glows/gradients         */
--grid:     #D2CFC6
--muted:    #5E636B
--ink-2:    #14161A   /* raised dark panels on dark sections        */
```
Apply: dark sections use --ink with a subtle --ink-2 panel; signal used only
on active/hover/key words/CTAs. Add a faint 1px top "scanline" sheen on dark
sections (very low opacity) for the engineered feel. Do NOT rainbow it —
discipline is the premium signal.

### B3. Cursor — replace the laggy dots [T1]
Current trail is janky (discrete dots, visible lag). Rebuild as a smooth
two-part cursor:
- **Lead dot:** 6px solid --signal, follows pointer 1:1.
- **Ring:** ~26px hollow ring that trails with eased lerp (~0.15 factor per
  frame), scales up slightly on velocity, scales down + fills on hover over
  interactive elements (magnetic feel).
- No particle confetti. The smoothness IS the premium cue.
- requestAnimationFrame; pointer:fine only; killed on reduced-motion.
- Optional [T2]: a faint, short motion-blur smear on the ring at high
  velocity — subtle, not a comet.

---

## C. HERO — make the signature actually animate [T1]

v1 shipped the hero static (the GSAP assemble isn't firing visibly — likely
the loader→hero handoff or reduced-motion default-state path). Fix so the
build-assemble runs on every fresh load:
- Verify `usePrefersReducedMotion()` isn't defaulting to TRUE during SSR/
  first paint (a common bug: matchMedia undefined on server → treated as
  reduced). It must default to motion ON unless explicitly reduced.
- Sequence (per 01 Hero, refined):
  1. eyebrow fades in (0.3s)
  2. mono status types `> initializing …` → `> ready` (signal) (~1.0s)
  3. headline lines assemble: each line rises + un-blurs (translateY 24→0,
     blur 8px→0, 0.6s, stagger 0.12s)
  4. signal rule sweeps under headline (scaleX 0→1, 0.5s)
  5. subline + buttons fade up (0.4s)
- Buttons: magnetic hover (translate toward cursor ~6px max, spring back).
- [T2] Hero 3D: a single slow-rotating low-poly wireframe object (R3F),
  parallaxing subtly to cursor, behind the headline at low opacity. ONE
  object, muted, never competes with the type. Build only if C-T1 is smooth
  and Lighthouse stays ≥90. Use @react-three/fiber@9 + drei@10, dynamic
  import ssr:false. If it costs perf or attention → cut it.

---

## D. SERVICES — "Three ways to ship" [T1 + one T2]

### D1. Pricing (lower per Shubh)
- Standard: ~~$200~~ → **$100**
- Pro:      ~~$500~~ → **$300**
- Elite:    ~~$1,000~~ → **$700**

### D2. Feature copy fix
- Standard: replace "Up to 5 pages" → **"Complete website build"**.
  Don't cap/count pages anywhere; it shrinks perceived value.

### D3. Card animation upgrade [T1]
- On scroll-in: cards rise + fade with stagger (0.5s, 0.1s stagger), Pro
  arrives last and "locks" with a tiny scale overshoot (1→1.04→1).
- Hover tilt: keep but refine — max ±6° (not 8), add a soft signal glow that
  tracks the cursor position on the card (radial highlight follows mouse).
- Buttons: same magnetic hover as hero.

### D4. Section-title motion [T2 — the "ship" idea, disciplined]
Shubh asked for a mouse-following ship that sinks on scroll. Honest take: a
literal ship cartoon risks toy-feel. Premium version of the same intent:
- A small line-art paper-plane / chevron glyph in --signal sits by the
  "Three ways to ship." title. It drifts gently toward the cursor within a
  bounded zone around the title (eased, never leaves the heading area). On
  scroll away it eases back to origin and fades. Tasteful, on-theme (ship →
  shipping). If it reads gimmicky in practice → cut, keep the title clean.
- Do NOT do a literal sinking-boat animation; it fights the premium tone.

---

## E. WORK — "Real products. Shipped." [T1 + one T2]

### E1. Real assets [T1, blocking]
Replace "screenshot pending" placeholders with real visuals:
- Breathify → store screenshot or logo (public/work/breathify.png)
- Cortex → app/graph screenshot or logo (public/work/cortex.png)
- Furniture 3D Viewer → no logo exists; generate a clean monogram/wordmark
  tile ("F3D" or "Furniture3D") in the same visual language as a placeholder
  brandmark (public/work/furniture.png)
- Until real screenshots exist, render a designed brand tile (gradient +
  wordmark) NOT the grey "pending" box — a pending box reads unfinished.

### E2. Motion upgrade [T1]
- Cards reveal alternating from left/right with eased slide + fade.
- Image panel: subtle parallax — image shifts a few px opposite scroll
  direction within its frame (premium depth cue).
- Tech chips: stagger-in after the card lands (0.05s each). A *very subtle*
  position settle is fine; avoid literal "jiggle" (reads playful/cheap).
- Hover on a card: image zooms ~1.03, signal corner-bracket draws in.

### E3. Mascot [T2 — the panda, contained]
Shubh wants a sleeping-panda mascot popping from random sides. Honest
guidance: a mascot can add charm IF it's quiet, consistent, and off to the
side — and it can wreck credibility with the senior-engineer audience if it's
loud or central. If building it:
- One small line-art / single-color panda, lives only in the Work section
  margins. Appears once, gently (slides in, yawns, curls up, dozes — a slow
  2–3s loop then idles). NOT random-popping from everywhere (that's
  distracting and reads buggy). Pointer-events none, aria-hidden, respects
  reduced-motion (static or absent).
- Decision rule: show it to one person in the Discord network first. If the
  reaction isn't "nice touch," remove it. The portfolio's job is trust;
  whimsy is a bonus, never a risk to trust.

---

## F. CONTACT + new closing section [T1 + T2]

### F1. Fill the empty contact space [T1]
v1 contact is sparse. Add a left-column "what happens next" 3-step mono list
to balance the form:
```
01 · you send the brief
02 · I reply within 24h with a direction
03 · we ship
```
(This is a real sequence → numbering is honest here, unlike on service cards.)
Tighten vertical spacing so the form + steps fill the section.

### F2. Closing / footer moment [T2]
Shubh wants an "leaving without choosing → sad face" beat. Premium version:
- A final slim footer band after Contact: big mono line
  **"Still scrolling? Let's just build something."** with the signal CTA.
- On exit-intent (cursor leaves viewport top on desktop) OR ~12s idle at
  bottom: the period in the headline could do a tiny "blink/look" — keep it
  to a 1-glyph micro-animation, NOT a literal sad-face cartoon. Subtle.
- reduced-motion / mobile: static.

---

## G. MOTION SYSTEM — keep it coherent [T1]
- One easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Scroll reveals: opacity 0→1, y 24→0, 0.6s, play once, trigger 80% in view.
- Nothing animates for longer than ~0.8s except idle ambient loops.
- EVERYTHING gated by reduced-motion → final states, no R3F mount, no cursor.
- Perf budget is a hard gate: if any addition drops Lighthouse perf <90 on
  desktop, it's cut or deferred. Speed reads more premium than effects.

---

## H. 3D reality note (read before asking for "more 3D")
"More 3D everywhere" is the fastest route to slow + amateur. The brief
references (Hubtown, Climanova, Dash) are ~95% 2D motion + typography + smooth
scroll, with at most one restrained 3D/video moment. Our 3D budget:
- ONE optional hero object (D-T2 / C-T2), low-poly, muted, perf-checked.
- The "3D / WebGL" selling point is delivered in the ELITE *client demos*,
  not stress-tested on the portfolio itself.
This is the same call the reference sites made. Trust the restraint.

---

## BUILD ORDER (paste-to-Claude-Code sequence)
1. **All of A (copy)** — fastest, highest impact, zero risk.
2. **B1 logo + B2 color + B3 cursor** — global feel.
3. **C-T1 hero animation fix** — the signature must actually fire.
4. **D1 pricing + D2 copy + D3 card motion.**
5. **E1 real assets + E2 work motion.**
6. **F1 contact fill.**
7. Re-test: `npm run build` clean, `npm run dev` visual pass, Lighthouse ≥90,
   360px mobile pass, reduced-motion pass.
8. ONLY THEN consider T2 items (D4 plane, E3 panda, C-T2 hero 3D, F2 closing),
   one at a time, keeping each only if it adds without cheapening.
