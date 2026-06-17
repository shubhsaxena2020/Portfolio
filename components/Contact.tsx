"use client";

/**
 * Console-style contact (doc 01/02). Dark section (--ink bg, --paper text).
 * Form POSTs to Formspree — real labels, inline validation, aria-live status,
 * disabled state while sending. Fill-later values are clearly-marked TODOs.
 */
import { useState } from "react";

// ── Fill these before deploy ───────────────────────────────────────────────
const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-id-here"; // TODO: real Formspree endpoint
const CONTACT_EMAIL = "shubh@example.com"; // TODO: real contact email (error fallback)
const DISCORD_LINK = "#"; // TODO: real Discord invite / handle URL
// ────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "ok" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = (data: FormData) => {
    const next: { [k: string]: string } = {};
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    if (!name) next.name = "Name is required.";
    if (!email) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email.";
    if (!message) next.message = "Tell me what you want built.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Bad response");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-[10px] border bg-[color-mix(in_srgb,var(--color-paper)_6%,var(--color-ink-2))] px-4 py-3 text-sm text-paper outline-none placeholder:text-[color-mix(in_srgb,var(--color-paper)_45%,transparent)] focus:border-signal";

  const STEPS = [
    { n: "01", t: "you send the brief" },
    { n: "02", t: "I reply within 24h with a direction" },
    { n: "03", t: "we ship" },
  ];

  return (
    <section
      id="contact"
      className="dark-section bg-ink py-24 text-paper sm:py-32"
    >
      <div className="container">
        <h2
          className="font-display font-bold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Start a build.
        </h2>
        <p className="mt-3 font-mono text-sm text-[color-mix(in_srgb,var(--color-paper)_70%,transparent)]">
          Open for freelance. Reply within 24h · IST.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_minmax(0,520px)] md:gap-12">
          {/* Left column: what-happens-next + links */}
          <div className="order-2 md:order-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-paper)_55%,transparent)]">
              WHAT HAPPENS NEXT
            </p>
            <ol className="mt-5 flex flex-col gap-4">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-baseline gap-4 font-mono text-sm">
                  <span className="text-signal">{s.n}</span>
                  <span className="text-[color-mix(in_srgb,var(--color-paper)_85%,transparent)]">
                    {s.t}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-paper)_55%,transparent)]">
              ELSEWHERE
            </p>
            <ul className="mt-5 flex flex-col gap-3 font-mono text-sm">
              <li>
                <a
                  href="https://instagram.com/shubh_builds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  Instagram · @shubh_builds
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shubhsaxena2020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  GitHub · shubhsaxena2020
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Form card */}
          <form
            noValidate
            onSubmit={onSubmit}
            className="order-1 rounded-[14px] border border-[color-mix(in_srgb,var(--color-paper)_12%,transparent)] bg-ink-2 p-6 text-paper sm:p-8 md:order-2"
          >
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="font-mono text-xs uppercase tracking-wider text-[color-mix(in_srgb,var(--color-paper)_65%,transparent)]"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : undefined}
                  className={`mt-2 ${fieldClass} ${
                    errors.name
                      ? "border-signal"
                      : "border-[color-mix(in_srgb,var(--color-paper)_18%,transparent)]"
                  }`}
                />
                {errors.name && (
                  <p id="name-err" className="mt-1.5 font-mono text-xs text-signal-2">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-mono text-xs uppercase tracking-wider text-[color-mix(in_srgb,var(--color-paper)_65%,transparent)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-err" : undefined}
                  className={`mt-2 ${fieldClass} ${
                    errors.email
                      ? "border-signal"
                      : "border-[color-mix(in_srgb,var(--color-paper)_18%,transparent)]"
                  }`}
                />
                {errors.email && (
                  <p id="email-err" className="mt-1.5 font-mono text-xs text-signal-2">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="font-mono text-xs uppercase tracking-wider text-[color-mix(in_srgb,var(--color-paper)_65%,transparent)]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-err" : undefined}
                  className={`mt-2 resize-y ${fieldClass} ${
                    errors.message
                      ? "border-signal"
                      : "border-[color-mix(in_srgb,var(--color-paper)_18%,transparent)]"
                  }`}
                />
                {errors.message && (
                  <p
                    id="message-err"
                    className="mt-1.5 font-mono text-xs text-signal-2"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-[10px] bg-signal px-6 py-3 font-mono text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send request"}
              </button>

              {/* aria-live status region */}
              <p aria-live="polite" className="min-h-5 font-mono text-xs">
                {status === "ok" && (
                  <span className="text-signal-2">
                    Request received. I&apos;ll reply within 24h.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-[color-mix(in_srgb,var(--color-paper)_70%,transparent)]">
                    Didn&apos;t send — email me at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-signal-2 underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>

        <footer className="mt-20 border-t border-[color-mix(in_srgb,var(--color-paper)_12%,transparent)] pt-8 font-mono text-xs text-[color-mix(in_srgb,var(--color-paper)_55%,transparent)]">
          © 2026 Shubh Saxena · built with intent.
        </footer>
      </div>
    </section>
  );
}
