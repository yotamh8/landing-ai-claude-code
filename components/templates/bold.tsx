// תבנית "אנרגטי": שחור וליים, כותרות ענקיות, מספור, גבולות עבים
import { rubik } from "./fonts";
import type { TemplateProps } from "./types";

const LIME = "#d4ff3a";

export function BoldTemplate({ content: c, business: b }: TemplateProps) {
  return (
    <div className={`${rubik.className} bg-[#0d0d0d] text-white`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-black">{b.name}</span>
        <a href="#contact" className="pressable bg-[#d4ff3a] px-5 py-2.5 text-sm font-bold text-black hover:bg-white">
          {c.contact.ctaText} ←
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-20">
        <p className="inline-block -rotate-1 bg-[#d4ff3a] px-3 py-1 text-sm font-bold text-black">{c.hero.eyebrow}</p>
        <h1 className="mt-6 text-5xl font-black leading-[0.95] sm:text-8xl">{c.hero.headline}</h1>
        <div className="mt-10 flex flex-col gap-8 border-t-4 border-white pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-xl leading-relaxed text-white/80">{c.hero.subheadline}</p>
          <a href="#contact" className="pressable shrink-0 bg-white px-8 py-4 text-lg font-black text-black hover:bg-[#d4ff3a]">
            {c.hero.ctaText}
          </a>
        </div>
      </section>

      <section className="bg-[#d4ff3a] text-black">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-4xl font-black sm:text-5xl">{c.about.heading}</h2>
          <p className="whitespace-pre-line text-xl leading-relaxed">{c.about.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-4xl font-black sm:text-6xl">{c.services.heading}</h2>
        <div className="mt-12 grid border-t-2 border-white/20 sm:grid-cols-2">
          {c.services.items.map((s, i) => (
            <article key={s.title} className="flex gap-6 border-b-2 border-white/20 py-8 sm:odd:pe-8 sm:even:ps-8">
              <span className="text-4xl font-black" style={{ color: LIME }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-white">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-3">
          {c.highlights.items.map((h) => (
            <div key={h.title} className="border-white/20 p-8 sm:border-s-2 sm:first:border-s-0">
              <h3 className="text-2xl font-black" style={{ color: LIME }}>{h.title}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-4xl font-black sm:text-5xl">{c.faq.heading}</h2>
        <div className="mt-10">
          {c.faq.items.map((f) => (
            <details key={f.question} className="group border-b-2 border-white/20 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold">
                {f.question}
                <span aria-hidden="true" className="text-2xl transition-transform duration-200 ease-(--ease-in-out) group-open:rotate-45" style={{ color: LIME }}>+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-white/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-white text-black">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-5xl font-black leading-none sm:text-7xl">{c.contact.heading}</h2>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-black/70">{c.contact.body}</p>
          </div>
          <span className="shrink-0 bg-black px-8 py-4 text-lg font-black text-[#d4ff3a]">{c.contact.ctaText}</span>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl justify-between px-6 py-8 text-sm text-white/60">
        <span className="font-bold text-white">{b.name}</span>
        <span>{[b.field, b.city].filter(Boolean).join(" · ")}</span>
      </footer>
    </div>
  );
}
