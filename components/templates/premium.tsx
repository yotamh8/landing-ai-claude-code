// תבנית "יוקרתי": שנהב, שחור וזהב, כותרות סריף, קווים דקים, מרווחים נדיבים
import { frank } from "./fonts";
import { HeroImage } from "./hero-image";
import type { TemplateProps } from "./types";

const GOLD = "#b08d57";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium" style={{ color: GOLD }}>{children}</span>;
}

export function PremiumTemplate({ content: c, business: b, imageUrl }: TemplateProps) {
  const serif = frank.className;
  return (
    <div className="bg-[#faf7f2] text-[#1a1714]" style={{ fontFamily: "var(--font-heebo)" }}>
      <header className="border-b border-[#1a1714]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className={`${serif} text-2xl font-medium`}>{b.name}</span>
          <a href="#contact" className="pressable border border-[#1a1714] px-6 py-2.5 text-sm hover:bg-[#1a1714] hover:text-[#faf7f2]">
            {c.contact.ctaText}
          </a>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-32">
        <Label>{c.hero.eyebrow}</Label>
        <h1 className={`${serif} text-5xl font-light leading-tight sm:text-7xl`}>{c.hero.headline}</h1>
        <span aria-hidden="true" className="h-px w-16" style={{ background: GOLD }} />
        <p className="max-w-2xl text-lg leading-loose text-[#1a1714]/70">{c.hero.subheadline}</p>
        <a href="#contact" className="pressable bg-[#1a1714] px-10 py-4 text-sm text-[#faf7f2] hover:bg-[#2c2723]">
          {c.hero.ctaText}
        </a>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="border border-[#b08d57]/40 p-3">
          <HeroImage src={imageUrl} style="premium" />
        </div>
      </div>

      <section className="border-y border-[#1a1714]/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Label>{b.field ?? b.name}</Label>
            <h2 className={`${serif} text-4xl font-light sm:text-5xl`}>{c.about.heading}</h2>
          </div>
          <p className="whitespace-pre-line text-lg leading-loose text-[#1a1714]/75">{c.about.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className={`${serif} text-center text-4xl font-light`}>{c.services.heading}</h2>
        <div className="mt-16 grid gap-px bg-[#1a1714]/10 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.items.map((s, i) => (
            <article key={s.title} className="flex flex-col gap-4 bg-[#faf7f2] p-10">
              <span className={`${serif} text-2xl`} style={{ color: GOLD }}>{["I", "II", "III", "IV", "V", "VI"][i]}</span>
              <h3 className={`${serif} text-2xl font-medium`}>{s.title}</h3>
              <p className="leading-relaxed text-[#1a1714]/70">{s.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1714] text-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className={`${serif} text-center text-4xl font-light`}>{c.highlights.heading}</h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {c.highlights.items.map((h) => (
              <div key={h.title} className="flex flex-col items-center gap-4 text-center">
                <span aria-hidden="true" className="h-px w-10" style={{ background: GOLD }} />
                <h3 className={`${serif} text-2xl`}>{h.title}</h3>
                <p className="leading-relaxed text-[#faf7f2]/70">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className={`${serif} text-center text-4xl font-light`}>{c.faq.heading}</h2>
        <div className="mt-12 border-t border-[#1a1714]/15">
          {c.faq.items.map((f) => (
            <details key={f.question} className="group border-b border-[#1a1714]/15 py-6">
              <summary className={`${serif} flex cursor-pointer list-none items-center justify-between gap-4 text-xl`}>
                {f.question}
                <span aria-hidden="true" className="transition-transform duration-200 ease-(--ease-in-out) group-open:rotate-45" style={{ color: GOLD }}>+</span>
              </summary>
              <p className="mt-4 leading-loose text-[#1a1714]/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-[#1a1714]/10 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
          <Label>{b.city ?? b.name}</Label>
          <h2 className={`${serif} text-4xl font-light sm:text-5xl`}>{c.contact.heading}</h2>
          <p className="max-w-xl leading-loose text-[#1a1714]/70">{c.contact.body}</p>
          <span className="bg-[#1a1714] px-10 py-4 text-sm text-[#faf7f2]">{c.contact.ctaText}</span>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-[#1a1714]/50">
        {b.name}
        {b.city && ` · ${b.city}`}
      </footer>
    </div>
  );
}
