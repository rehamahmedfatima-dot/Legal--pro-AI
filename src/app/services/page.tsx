import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const metadata = { title: "Services — LegalPro AI" };

interface ServiceContent {
  title: string;
  description: string;
  benefits: string[];
  process: string[];
  duration: string;
}

const servicesData: { ar: ServiceContent; en: ServiceContent }[] = [
  {
    en: {
      title: "Civil Law",
      description:
        "Representation and advice across civil disputes, contracts, and personal claims.",
      benefits: ["Experienced litigation team", "Clear cost estimates", "Regular case updates"],
      process: ["Initial consultation", "Case assessment", "Filing & representation", "Resolution"],
      duration: "Varies by case complexity"
    },
    ar: {
      title: "القانون المدني",
      description: "تمثيل واستشارات في النزاعات المدنية والعقود والمطالبات الشخصية.",
      benefits: ["فريق تقاضي ذو خبرة", "تقدير واضح للتكاليف", "تحديثات دورية عن القضية"],
      process: ["استشارة أولية", "تقييم القضية", "التقديم والتمثيل", "الحل النهائي"],
      duration: "تختلف حسب تعقيد القضية"
    }
  },
  {
    en: {
      title: "Criminal Law",
      description: "Defense and legal counsel for criminal proceedings at every stage.",
      benefits: ["Confidential consultation", "Court representation", "Rapid response"],
      process: ["Urgent consultation", "Evidence review", "Defense strategy", "Court hearings"],
      duration: "Depends on court schedule"
    },
    ar: {
      title: "القانون الجنائي",
      description: "دفاع واستشارة قانونية في الإجراءات الجنائية بجميع مراحلها.",
      benefits: ["استشارة سرية", "تمثيل أمام المحكمة", "استجابة سريعة"],
      process: ["استشارة عاجلة", "مراجعة الأدلة", "استراتيجية الدفاع", "جلسات المحكمة"],
      duration: "حسب جدول المحكمة"
    }
  },
  {
    en: {
      title: "Commercial Law",
      description: "Advisory and dispute resolution for businesses of all sizes.",
      benefits: ["Contract review", "Risk mitigation", "Negotiation support"],
      process: ["Business review", "Legal drafting", "Negotiation", "Agreement finalization"],
      duration: "2–6 weeks typical"
    },
    ar: {
      title: "القانون التجاري",
      description: "استشارات وحل نزاعات للشركات بجميع أحجامها.",
      benefits: ["مراجعة العقود", "تقليل المخاطر", "دعم التفاوض"],
      process: ["مراجعة الأعمال", "الصياغة القانونية", "التفاوض", "إنهاء الاتفاقية"],
      duration: "غالبًا من 2 إلى 6 أسابيع"
    }
  },
  {
    en: {
      title: "Family Law",
      description: "Sensitive, professional handling of family and personal matters.",
      benefits: ["Confidential process", "Mediation options", "Clear guidance"],
      process: ["Private consultation", "Documentation", "Mediation/filing", "Resolution"],
      duration: "Varies by case"
    },
    ar: {
      title: "قانون الأسرة",
      description: "تعامل احترافي وحساس مع المسائل الأسرية والشخصية.",
      benefits: ["إجراءات سرية", "خيارات الوساطة", "إرشاد واضح"],
      process: ["استشارة خاصة", "التوثيق", "الوساطة أو التقديم", "الحل النهائي"],
      duration: "تختلف حسب القضية"
    }
  },
  {
    en: {
      title: "Corporate Law",
      description: "Formation, governance, and compliance support for companies.",
      benefits: ["Company formation", "Governance advice", "Regulatory compliance"],
      process: ["Structure planning", "Documentation", "Filing", "Ongoing advisory"],
      duration: "1–4 weeks for formation"
    },
    ar: {
      title: "قانون الشركات",
      description: "دعم في تأسيس الشركات والحوكمة والامتثال التنظيمي.",
      benefits: ["تأسيس الشركات", "استشارات الحوكمة", "الامتثال التنظيمي"],
      process: ["تخطيط الهيكل", "التوثيق", "التقديم", "استشارات مستمرة"],
      duration: "من أسبوع إلى 4 أسابيع للتأسيس"
    }
  },
  {
    en: {
      title: "Real Estate Law",
      description: "Property transactions, leases, and real estate dispute resolution.",
      benefits: ["Title verification", "Contract drafting", "Dispute resolution"],
      process: ["Property review", "Due diligence", "Contract drafting", "Closing"],
      duration: "2–4 weeks typical"
    },
    ar: {
      title: "قانون العقارات",
      description: "معاملات عقارية وعقود إيجار وحل نزاعات عقارية.",
      benefits: ["التحقق من الملكية", "صياغة العقود", "حل النزاعات"],
      process: ["مراجعة العقار", "الفحص الدقيق", "صياغة العقد", "الإغلاق"],
      duration: "غالبًا من أسبوعين إلى 4 أسابيع"
    }
  }
];

export default function ServicesPage() {
  const locale = getLocale();
  const t = getDictionary(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-navy dark:text-white md:text-4xl">
        {t.services.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-black/60 dark:text-white/60">
        {t.services.subtitle}
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {servicesData.map((service) => {
          const s = service[locale];
          return (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/70 dark:text-white/70">{s.description}</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {t.services.benefits}
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-black/60 dark:text-white/60">
                  {s.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {t.services.process}
                </p>
                <ol className="mt-1 list-inside list-decimal text-sm text-black/60 dark:text-white/60">
                  {s.process.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </div>

              <p className="mt-4 text-xs text-black/50 dark:text-white/50">
                {t.services.duration}: {s.duration}
              </p>

              <LinkButton href="/register" className="mt-4 w-full">
                {t.services.bookConsultation}
              </LinkButton>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
