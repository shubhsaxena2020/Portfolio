# 04_ROADMAP.md — 7-Day Sprint

## Goal
Live portfolio at shubhbuilds.com + the three real projects shown + one
client demo (SparkClean), ready before the Discord meetup in 7 days. Outcome
sought: a referred client, realistically $300–$1,000.

## Honest framing (read once)
Your strongest asset isn't cold DMs — it's a network of senior engineers who
already know your work and pass overflow clients around. The whole sprint
exists to make ONE thing true before the meetup: *when an overflow client
comes up, you're the obvious person to hand it to.* The portfolio is the
proof. Cortex + the 3D viewer shown to senior engineers is heavier proof than
any fake business site — lead with the real builds.

---

## PRE-FLIGHT (before opening Claude Code) — ~20 min
- [ ] Buy shubhbuilds.com (Namecheap, code NEWCOM679 ≈ ₹1,025/yr).
- [ ] Create public GitHub repo `portfolio` (no README/.gitignore — Claude
      Code generates the tree).
- [ ] Create Formspree account → copy the form endpoint URL.
- [ ] Connect Vercel to GitHub (vercel.com → Add New → Project → import).
- [ ] Put 00/01/02/03 docs into the project folder.
- [ ] (Parallel) In Gemini: edit the suit photo → solo crop, clean neutral
      background, professional headshot → save as profile.jpg.
- [ ] (Parallel) Screenshot getbreathify.store, the Cortex repo/app, and the
      furniture viewer for the Work section.

## DAY 1 — Build & ship the shell
- [ ] Paste 03_BUILD_PROMPT.md into Claude Code. Let it build + self-verify.
- [ ] Run `npm install`, `npm run build` (must be clean), `npm run dev`.
- [ ] Eyeball each section against doc 00. Fix obvious issues via Claude Code.
- [ ] Fill the easy TODO constants (Formspree endpoint, email, Discord).
- [ ] `git push` → Vercel auto-deploys → verify the *.vercel.app URL is live.
- [ ] Add shubhbuilds.com in Vercel → set Namecheap DNS → wait for propagation.
- END STATE: site live on vercel.app (custom domain may still be propagating).

## DAY 2 — Assets, polish, mobile
- [ ] Drop in profile.jpg + the three work screenshots; commit.
- [ ] Phone test every section at 360–414px. List issues → Claude Code fixes.
- [ ] Verify SIGNATURE moment (loader + hero assemble) and cursor feel right.
- [ ] Test contact form end-to-end (real Formspree submission lands).
- [ ] Run Lighthouse; if any score <90, give the report to Claude Code to fix.
- [ ] Confirm shubhbuilds.com resolves with HTTPS.
- END STATE: polished, mobile-clean, screenshot-worthy, custom domain live.

## DAY 3–4 — SparkClean demo (the "I do client sites too" proof)
- [ ] Build SparkClean (premium cleaning-company demo) — same stack, its own
      design (light + green, booking-first). Separate repo, deploy to a
      vercel.app subdomain (no domain purchase needed).
      Sections: hero + book CTA · services · why-us trust row · pricing tiers
      · 3 realistic testimonials (clearly a demo) · booking form.
- [ ] Add build_04 (SparkClean) to lib/projects.ts in the portfolio; commit.
- END STATE: SparkClean live; portfolio Work section now shows 4 builds.

## DAY 5 — Instagram (@shubh_builds), real work only
- [ ] Post 1: shubhbuilds.com screenshot — "Built my portfolio in a weekend.
      I direct AI to ship. Link in bio."
- [ ] Post 2: SparkClean screenshot — "Demo build: a cleaning-co site."
- [ ] Optional Post 3: Cortex or the 3D viewer — real engineering.
- [ ] No AI quote-posts. Only work. Bio → shubhbuilds.com.
- END STATE: 2–3 credible posts; the page looks like a builder's, not a meme
      account.

## DAY 6 — Outreach draft
- [ ] Draft the Discord message (template in 05_OUTREACH.md). Review tone.
- [ ] Prep a 60-second screen-share walkthrough for the meetup.
- END STATE: message + walkthrough ready.

## DAY 7 — Send & show
- [ ] Final desktop+mobile pass.
- [ ] Send the Discord message in the morning; reply to any response <1h.
- [ ] At the meetup: screen-share shubhbuilds.com, then SparkClean; ask
      directly if anyone has an overflow client you can take.
- END STATE: ≥1 real client conversation started.

---

## Success metrics
| Metric                     | Target        |
|----------------------------|---------------|
| Build compiles clean       | Day 1         |
| Portfolio live (vercel)    | Day 1         |
| Custom domain + HTTPS       | Day 2         |
| Lighthouse ≥ 90            | Day 2         |
| SparkClean demo live       | Day 4         |
| 2–3 IG posts (real work)   | Day 5         |
| Discord message sent       | Day 7 AM      |
| Client conversation        | Day 7         |
| First payment              | Day 10–15     |

## If it goes wrong
- Build won't compile → paste the exact error into Claude.ai, get a patch,
  apply in Claude Code. Don't guess.
- Vercel build fails → read the build log; share verbatim with Claude.
- DNS not resolving → wait up to 24h; verify at dnschecker.org.
- Network quiet → DM people individually, not just the group channel.
- No client in 7 days → the deadline pressure is real, but a fake-looking
  rushed site loses the network's trust permanently. A clean honest portfolio
  that lands a ₹5–15k first client is a better outcome than a flashy one that
  gets you written off. Protect the relationship; it's the actual asset.

## Reality note on the $1k-in-15-days target
A single $1k first client via a brand-new portfolio in 15 days is possible
ONLY because of the warm network — not guaranteed. Treat the debt timeline
and this plan as separate: build the best honest proof you can, ask the
network directly, and let the first real "yes" set the true pace. Don't make
financial commitments that assume the $1k lands on a fixed date.
