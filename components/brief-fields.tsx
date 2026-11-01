"use client";

import { STYLES, STYLE_LABELS, type Style } from "@/lib/brief";

export type BriefDefaults = Partial<{
  name: string;
  field: string;
  city: string;
  description: string;
  audience: string;
  style: Style;
}>;

const input =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 focus:border-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10";

// תצוגה מקדימה זעירה של כל תבנית, כדי שהבחירה תהיה ויזואלית
const SWATCH: Record<Style, { bg: string; fg: string; accent: string; font: string }> = {
  calm: { bg: "#f4efe7", fg: "#2f3a34", accent: "#7c9a86", font: "font-light" },
  bold: { bg: "#0d0d0d", fg: "#ffffff", accent: "#d4ff3a", font: "font-black" },
  premium: { bg: "#faf7f2", fg: "#1a1714", accent: "#b08d57", font: "font-serif" },
};

export function BriefFields({ defaults = {} }: { defaults?: BriefDefaults }) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="שם העסק">
        <input name="name" required minLength={2} maxLength={80} defaultValue={defaults.name}
          placeholder="למשל: המאפייה של רותי" className={input} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="תחום">
          <input name="field" required minLength={2} maxLength={80} defaultValue={defaults.field}
            placeholder="מאפייה ובית קפה" className={input} />
        </Field>
        <Field label="עיר">
          <input name="city" required minLength={2} maxLength={60} defaultValue={defaults.city}
            placeholder="חיפה" className={input} />
        </Field>
      </div>

      <Field label="תיאור קצר" hint="מה מיוחד בעסק? 10–500 תווים">
        <textarea name="description" required minLength={10} maxLength={500} rows={3}
          defaultValue={defaults.description}
          placeholder="מאפייה שכונתית עם לחמי מחמצת, מאפים טריים כל בוקר וקפה טוב."
          className={`${input} resize-y`} />
      </Field>

      <Field label="קהל יעד">
        <input name="audience" required minLength={2} maxLength={200} defaultValue={defaults.audience}
          placeholder="משפחות צעירות ותושבי השכונה" className={input} />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-medium">סגנון</legend>
        <div className="grid grid-cols-3 gap-3">
          {STYLES.map((s) => (
            <label key={s} className="pressable group relative cursor-pointer">
              <input type="radio" name="style" value={s} required defaultChecked={defaults.style === s}
                className="peer sr-only" />
              <span className="flex flex-col overflow-hidden rounded-xl border-2 border-[var(--border)] transition-[border-color] duration-150 peer-checked:border-[var(--foreground)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--foreground)]/30">
                <span className="flex h-16 flex-col justify-center gap-1.5 px-3"
                  style={{ background: SWATCH[s].bg, color: SWATCH[s].fg }} aria-hidden="true">
                  <span className={`text-sm leading-none ${SWATCH[s].font}`}>Aa אב</span>
                  <span className="h-1.5 w-8 rounded-full" style={{ background: SWATCH[s].accent }} />
                </span>
                <span className="bg-[var(--surface)] px-3 py-2">
                  <span className="block text-sm font-medium">{STYLE_LABELS[s].name}</span>
                  <span className="block text-xs opacity-60">{STYLE_LABELS[s].hint}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-medium">{label}</span>
        {hint && <span className="text-xs opacity-60">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
