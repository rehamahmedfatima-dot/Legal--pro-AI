import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

const practiceAreaKeys = [
  { ar: "القانون المدني", en: "Civil Law" },
  { ar: "القانون الجنائي", en: "Criminal Law" },
  { ar: "القانون التجاري", en: "Commercial Law" },
  { ar: "قانون الأسرة", en: "Family Law" },
  { ar: "قانون الشركات", en: "Corporate Law" },
  { ar: "قانون العقارات", en: "Real Estate Law" }
];

export default function HomePage() {
  const locale = getLocale();
  const t = getDictionary(locale);

  const stats = [
    { label: t.home.statCasesHandled, value: "1,200+" },
    { label: t.home.statSuccessRate, value: "94%" },
    { label: t.home.statYearsExperience, value: "15+" },
    { label: t.home.statClientsServed, value: "3,000+" }
  ];

  return (
    <main>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-navy dark:text-white md:text-6xl">
          {t.home.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-black/60 dark:text-white/60">
          {t.home.subtitle}
        </p>
        <div className="mt-8 flex gap-4">
          <LinkButton href="/register">{t.home.bookConsultation}</LinkButton>
          <LinkButton href="/services" variant="ghost" className="border border-black/10 dark:border-white/10">
            {t.home.ourServices}
          </LinkButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 pb-24 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-3xl font-bold text-gold">{s.value}</p>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{s.label}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-center text-3xl font-semibold text-navy dark:text-white">
          {t.home.practiceAreasTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {practiceAreaKeys.map((area) => (
            <Card key={area.en}>
              <CardHeader>
                <CardTitle>{locale === "ar" ? area.ar : area.en}</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                {t.home.practiceAreaDescription}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
