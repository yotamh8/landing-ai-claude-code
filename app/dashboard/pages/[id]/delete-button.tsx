"use client";

import { deletePage } from "./actions";

export function DeletePageButton({ id }: { id: string }) {
  return (
    <form
      action={deletePage.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("למחוק את הדף? אי אפשר לבטל את הפעולה.")) e.preventDefault();
      }}
    >
      <button type="submit" className="pressable rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
        מחיקה
      </button>
    </form>
  );
}
