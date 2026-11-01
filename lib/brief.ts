// נתוני הטופס של העסק. משותף לטופס היצירה, לדף חדש ול-/api/generate.

export const STYLES = ["calm", "bold", "premium"] as const;
export type Style = (typeof STYLES)[number];

export const STYLE_LABELS: Record<Style, { name: string; hint: string }> = {
  calm: { name: "רגוע", hint: "רך, מאוורר ומזמין" },
  bold: { name: "אנרגטי", hint: "נועז, חזק ומלא תנופה" },
  premium: { name: "יוקרתי", hint: "אלגנטי, מוקפד ובלעדי" },
};

export type Brief = {
  name: string;
  field: string;
  city: string;
  description: string;
  audience: string;
  style: Style;
};

const LIMITS: Record<Exclude<keyof Brief, "style">, [number, number, string]> = {
  name: [2, 80, "שם העסק"],
  field: [2, 80, "תחום העסק"],
  city: [2, 60, "העיר"],
  description: [10, 500, "התיאור"],
  audience: [2, 200, "קהל היעד"],
};

export function parseBrief(input: unknown): { brief: Brief } | { error: string } {
  if (!input || typeof input !== "object") return { error: "נתונים חסרים." };
  const raw = input as Record<string, unknown>;
  const out: Partial<Brief> = {};

  for (const [key, [min, max, label]] of Object.entries(LIMITS)) {
    const value = typeof raw[key] === "string" ? (raw[key] as string).trim().replace(/\s+/g, " ") : "";
    if (value.length < min || value.length > max) {
      return { error: `${label} צריך להכיל בין ${min} ל-${max} תווים.` };
    }
    out[key as keyof typeof LIMITS] = value;
  }

  if (!STYLES.includes(raw.style as Style)) return { error: "צריך לבחור סגנון." };
  out.style = raw.style as Style;

  return { brief: out as Brief };
}

export function briefFromFormData(fd: FormData): Record<string, unknown> {
  return Object.fromEntries(
    ["name", "field", "city", "description", "audience", "style"].map((k) => [k, fd.get(k)]),
  );
}
