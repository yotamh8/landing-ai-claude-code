import "server-only";
import type { Brief } from "./brief";
import { PAGE_CONTENT_SCHEMA, parsePageContent, type PageContent } from "./page-content";

// המפתח נקרא רק בשרת. הקובץ מסומן server-only, כך שהוא לא ייכנס לבאנדל של הדפדפן.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const TONE: Record<Brief["style"], string> = {
  calm: "רגוע, חם ומרגיע. משפטים רכים וזורמים, בלי סימני קריאה מיותרים.",
  bold: "אנרגטי ונועז. משפטים קצרים וחדים, פעלים חזקים, הרבה תנופה.",
  premium: "יוקרתי ואלגנטי. ניסוח מאופק, מדויק ומוקפד, תחושת בלעדיות בלי הגזמה.",
};

function buildPrompt(b: Brief) {
  return `אתה קופירייטר ישראלי מומחה לדפי נחיתה לעסקים קטנים.
כתוב תוכן לדף נחיתה בעברית תקנית וטבעית, לפי פרטי העסק הבאים:

שם העסק: ${b.name}
תחום: ${b.field}
עיר: ${b.city}
תיאור: ${b.description}
קהל יעד: ${b.audience}
טון: ${TONE[b.style]}

כללים:
- כל הטקסט בעברית, פונה ישירות לקהל היעד.
- אל תמציא עובדות שלא מופיעות למעלה: לא מחירים, לא שנות ניסיון, לא פרסים, לא המלצות של לקוחות, לא טלפונים ולא כתובות.
- כותרת ה-hero קצרה וחזקה (עד 8 מילים). ctaText עד 3 מילים.
- services: בין 3 ל-6 שירותים שמתאימים לתחום ולתיאור.
- highlights: בדיוק 3 סיבות לבחור בעסק.
- faq: בין 3 ל-5 שאלות נפוצות עם תשובות כלליות וזהירות.
- metaDescription עד 155 תווים.
החזר JSON בלבד לפי הסכמה.`;
}

export class GenerationError extends Error {}

export async function generatePageContent(brief: Brief): Promise<PageContent> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GenerationError("GEMINI_API_KEY is not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(brief) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: PAGE_CONTENT_SCHEMA,
          temperature: 0.8,
        },
      }),
      signal: AbortSignal.timeout(50_000),
    },
  );

  if (!res.ok) {
    throw new GenerationError(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new GenerationError("Gemini returned non-JSON output");
  }

  const content = parsePageContent(json);
  if (!content) throw new GenerationError("Gemini JSON did not match the page schema");
  return content;
}
