// מצב "יוצר דף": מופיע כמה שניות בזמן שהמודל כותב
export function GeneratingNotice({ text }: { text: string }) {
  return (
    <div role="status" aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
