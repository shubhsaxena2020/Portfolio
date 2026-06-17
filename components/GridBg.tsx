/**
 * Faint design-tool baseline grid. Purely decorative — aria-hidden and
 * pointer-events:none so it never interferes with content or input.
 * Server component; no animation (doc 01).
 */
export default function GridBg({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid-bg pointer-events-none absolute inset-0 -z-10 ${className}`}
    />
  );
}
