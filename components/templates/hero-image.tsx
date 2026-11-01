import type { Style } from "@/lib/brief";

// תמונת ה-hero: התמונה שנוצרה, או תמונת ברירת מחדל בצבעי התבנית
export function HeroImage({ src, style, className }: { src: string | null; style: Style; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src ?? `/images/default-${style}.svg`}
      alt=""
      width={1600}
      height={900}
      className={`aspect-video w-full object-cover ${className ?? ""}`}
    />
  );
}
