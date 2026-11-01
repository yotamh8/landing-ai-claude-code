// הסכמה הקבועה של תוכן דף נחיתה. Gemini חייב להחזיר JSON בדיוק בצורה הזו.

export type Item = { title: string; description: string };
export type Faq = { question: string; answer: string };

export type PageContent = {
  title: string;
  metaDescription: string;
  hero: { eyebrow: string; headline: string; subheadline: string; ctaText: string };
  about: { heading: string; body: string };
  services: { heading: string; items: Item[] };
  highlights: { heading: string; items: Item[] };
  faq: { heading: string; items: Faq[] };
  contact: { heading: string; body: string; ctaText: string };
  // תיאור באנגלית לתמונת ה-hero. נשלח למודל התמונות של Gemini
  image_prompt?: string;
};

// סכמה בפורמט של Gemini (OpenAPI subset)
const STR = { type: "STRING" } as const;
const obj = (props: Record<string, unknown>) => ({
  type: "OBJECT",
  properties: props,
  required: Object.keys(props),
  propertyOrdering: Object.keys(props),
});
const list = (item: unknown, min: number, max: number) => ({
  type: "ARRAY",
  items: item,
  minItems: min,
  maxItems: max,
});
const itemSchema = obj({ title: STR, description: STR });

export const PAGE_CONTENT_SCHEMA = obj({
  title: STR,
  metaDescription: STR,
  hero: obj({ eyebrow: STR, headline: STR, subheadline: STR, ctaText: STR }),
  about: obj({ heading: STR, body: STR }),
  services: obj({ heading: STR, items: list(itemSchema, 3, 6) }),
  highlights: obj({ heading: STR, items: list(itemSchema, 3, 3) }),
  faq: obj({ heading: STR, items: list(obj({ question: STR, answer: STR }), 3, 5) }),
  contact: obj({ heading: STR, body: STR, ctaText: STR }),
  image_prompt: STR,
});

// אימות בצד השרת: לא סומכים על המודל, גם עם schema
function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 && s.length <= max ? s : null;
}

function items<T>(v: unknown, min: number, max: number, map: (x: unknown) => T | null): T[] | null {
  if (!Array.isArray(v) || v.length < min) return null;
  const out = v.slice(0, max).map(map);
  return out.every((x) => x !== null) ? (out as T[]) : null;
}

const asItem = (x: unknown): Item | null => {
  const o = x as Record<string, unknown> | null;
  const title = str(o?.title, 120);
  const description = str(o?.description, 600);
  return title && description ? { title, description } : null;
};

const asFaq = (x: unknown): Faq | null => {
  const o = x as Record<string, unknown> | null;
  const question = str(o?.question, 200);
  const answer = str(o?.answer, 800);
  return question && answer ? { question, answer } : null;
};

export function parsePageContent(input: unknown): PageContent | null {
  const c = input as Record<string, Record<string, unknown>> | null;
  if (!c || typeof c !== "object") return null;

  const content: PageContent = {
    title: str(c.title, 120)!,
    metaDescription: str(c.metaDescription, 300)!,
    hero: {
      eyebrow: str(c.hero?.eyebrow, 80)!,
      headline: str(c.hero?.headline, 140)!,
      subheadline: str(c.hero?.subheadline, 400)!,
      ctaText: str(c.hero?.ctaText, 40)!,
    },
    about: { heading: str(c.about?.heading, 120)!, body: str(c.about?.body, 1500)! },
    services: { heading: str(c.services?.heading, 120)!, items: items(c.services?.items, 3, 6, asItem)! },
    highlights: {
      heading: str(c.highlights?.heading, 120)!,
      items: items(c.highlights?.items, 3, 3, asItem)!,
    },
    faq: { heading: str(c.faq?.heading, 120)!, items: items(c.faq?.items, 3, 5, asFaq)! },
    contact: {
      heading: str(c.contact?.heading, 120)!,
      body: str(c.contact?.body, 600)!,
      ctaText: str(c.contact?.ctaText, 40)!,
    },
  };

  // אופציונלי, כדי שדפים ישנים בלי image_prompt עדיין ייטענו
  const imagePrompt = str(c.image_prompt, 1000);
  if (imagePrompt) content.image_prompt = imagePrompt;

  const valid = (o: unknown): boolean =>
    o !== null && (typeof o !== "object" || Object.values(o as object).every(valid));
  return valid(content) ? content : null;
}
