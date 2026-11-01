"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "generating" | "done" | "failed";

// אחרי שהטקסט נוצר, מבקשים את התמונה. בינתיים מוצגת תמונת ברירת מחדל
export function ImageStatus({ pageId, status }: { pageId: string; status: Status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(status === "generating");
  const started = useRef(false);

  async function generate() {
    setBusy(true);
    await fetch("/api/generate/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    }).catch(() => null);
    setBusy(false);
    router.refresh();
  }

  useEffect(() => {
    if (status === "pending" && !started.current) {
      started.current = true;
      void generate();
    }
    // אם הדף נפתח בזמן שתמונה כבר בהכנה, מרעננים עד שהיא מוכנה
    if (status === "generating") {
      const t = setInterval(() => router.refresh(), 4000);
      // אם זה נתקע, מנסים שוב. השרת משחרר תפיסה ישנה מ-70 שניות
      const retry = setTimeout(() => void generate(), 75_000);
      return () => {
        clearInterval(t);
        clearTimeout(retry);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "done") return null;

  if (busy || status === "pending" || status === "generating") {
    return (
      <span role="status" className="flex items-center gap-2 px-3 py-1.5 opacity-70">
        <span className="spinner" aria-hidden="true" style={{ width: 14, height: 14 }} />
        יוצרים תמונה…
      </span>
    );
  }

  return (
    <button type="button" onClick={generate} className="pressable rounded-lg px-3 py-1.5 hover:bg-[var(--muted)]">
      התמונה נכשלה · נסו שוב
    </button>
  );
}
