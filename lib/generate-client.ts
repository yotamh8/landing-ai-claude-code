// קריאה ל-/api/generate מהדפדפן. רק נתוני הטופס עוברים; המפתח נשאר בשרת.
export async function requestGeneration(brief: Record<string, unknown>) {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
    if (!res.ok || !data.id) return { error: data.error ?? "יצירת הדף נכשלה. נסו שוב." };
    return { id: data.id };
  } catch {
    return { error: "אין חיבור לשרת. בדקו את החיבור ונסו שוב." };
  }
}
