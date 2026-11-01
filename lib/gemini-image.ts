import "server-only";
import type { Style } from "./brief";

// מודל התמונות של Gemini. אפשר להחליף עם GEMINI_IMAGE_MODEL ב-Vercel
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const WAITS = [0, 2000, 4000];
const DEADLINE_MS = 55_000;

const LOOK: Record<Style, string> = {
  calm: "Soft natural daylight, airy, muted sage and warm sand tones, calm and inviting, shallow depth of field.",
  bold: "High contrast, vivid and energetic, dramatic lighting, dynamic composition, punchy saturated colors.",
  premium: "Elegant and refined, warm low-key lighting, rich textures, subtle gold accents, editorial luxury photography.",
};

export class ImageGenerationError extends Error {}

export async function generateHeroImage(
  imagePrompt: string,
  style: Style,
): Promise<{ bytes: Buffer; mimeType: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ImageGenerationError("GEMINI_API_KEY is not configured");

  const prompt = `${imagePrompt}\n\nStyle: ${LOOK[style]} Wide landscape photograph for a website hero banner. No text, no letters, no logos, no watermarks.`;
  const started = Date.now();
  let lastError = "no attempt";

  for (const wait of WAITS) {
    if (wait) await new Promise((r) => setTimeout(r, wait));
    const remaining = DEADLINE_MS - (Date.now() - started);
    if (remaining < 8_000) break;

    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ["IMAGE"],
              imageConfig: { aspectRatio: "16:9" },
            },
          }),
          signal: AbortSignal.timeout(remaining),
        },
      );
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      continue;
    }

    if (!res.ok) {
      lastError = `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`;
      if (RETRYABLE.has(res.status)) continue;
      throw new ImageGenerationError(lastError);
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
    };
    const image = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
    if (image?.data) {
      return { bytes: Buffer.from(image.data, "base64"), mimeType: image.mimeType || "image/png" };
    }
    lastError = "response contained no image";
  }

  throw new ImageGenerationError(`image generation failed, last: ${lastError}`);
}
