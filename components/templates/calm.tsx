// תבנית "רגוע": חול ומרווה, הרבה אוויר, פינות רכות, טיפוגרפיה קלה
import { HeroImage } from "./hero-image";
import type { TemplateProps } from "./types";

export function CalmTemplate({ content: c, business: b, imageUrl }: TemplateProps) {
  return (
    <div className="bg-[#f6f2ec] text-[#2f3a34]" style={{ fontFamily: "var(--font-heebo)" }}>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-medium">{b.name}</span>
        <a href="#contact" className="pressable rounded-full bg-[#7c9a86] px-5 py-2 text-sm text-white hover:bg-[#6b8875]">
          {c.contact.ctaText}
        </a>
      </header>

      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-[480px] w-[480px] rounded-full bg-[#dfe8df] blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm text-[#5d7a66]">{c.hero.eyebrow}</span>
          <h1 className="text-4xl font-light sm:text-6xl">{c.hero.headline}</h1>
          <p className="max-w-xl text-lg leading-relaxed opacity-80">{c.hero.subheadline}</p>
          <a href="#contact" className="pressable mt-2 rounded-full bg-[#2f3a34] px-8 py-3.5 text-white hover:bg-[#3e4c44]">
            {c.hero.ctaText}
          </a>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-20">
          <HeroImage src={imageUrl} style="calm" className="rounded-[2.5rem] shadow-xl shadow-[#2f3a34]/10" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-light">{c.about.heading}</h2>
        <p className="mt-6 whitespace-pre-line text-lg leading-loose opacity-80">{c.about.body}</p>
      </section>

      <section className="bg-white/60 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-light">{c.services.heading}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.services.items.map((s) => (
              <article key={s.title} className="rounded-3xl bg-[#f6f2ec] p-8">
                <span aria-hidden="true" className="mb-5 block h-10 w-10 rounded-full bg-[#dfe8df]" />
                <h3 className="text-xl font-medium">{s.title}</h3>
                <p className="mt-3 leading-relaxed opacity-75">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-light">{c.highlights.heading}</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {c.highlights.items.map((h) => (
            <div key={h.title} className="text-center">
              <h3 className="text-lg font-medium text-[#5d7a66]">{h.title}</h3>
              <p className="mt-2 leading-relaxed opacity-75">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-light">{c.faq.heading}</h2>
        <div className="mt-10 flex flex-col gap-3">
          {c.faq.items.map((f) => (
            <details key={f.question} className="group rounded-2xl bg-white/70 px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.question}
                <span aria-hidden="true" className="text-[#7c9a86] transition-transform duration-200 ease-(--ease-in-out) group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed opacity-75">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="px-6 pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[2.5rem] bg-[#dfe8df] px-8 py-16 text-center">
          <h2 className="text-3xl font-light">{c.contact.heading}</h2>
          <p className="max-w-lg leading-relaxed opacity-80">{c.contact.body}</p>
          <span className="rounded-full bg-[#2f3a34] px-8 py-3.5 text-white">{c.contact.ctaText}</span>
        </div>
      </section>

      <footer className="pb-10 text-center text-sm opacity-60">
        {b.name}
        {b.city && ` · ${b.city}`}
      </footer>
    </div>
  );
}
