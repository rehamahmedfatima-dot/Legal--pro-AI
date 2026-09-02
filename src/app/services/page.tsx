import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = { title: "Services — LegalPro AI" };

interface Service {
  title: string;
  description: string;
  benefits: string[];
  process: string[];
  duration: string;
}

const services: Service[] = [
  {
    title: "Civil Law",
    description:
      "Representation and advice across civil disputes, contracts, and personal claims.",
    benefits: ["Experienced litigation team", "Clear cost estimates", "Regular case updates"],
    process: ["Initial consultation", "Case assessment", "Filing & representation", "Resolution"],
    duration: "Varies by case complexity"
  },
  {
    title: "Criminal Law",
    description: "Defense and legal counsel for criminal proceedings at every stage.",
    benefits: ["Confidential consultation", "Court representation", "Rapid response"],
    process: ["Urgent consultation", "Evidence review", "Defense strategy", "Court hearings"],
    duration: "Depends on court schedule"
  },
  {
    title: "Commercial Law",
    description: "Advisory and dispute resolution for businesses of all sizes.",
    benefits: ["Contract review", "Risk mitigation", "Negotiation support"],
    process: ["Business review", "Legal drafting", "Negotiation", "Agreement finalization"],
    duration: "2–6 weeks typical"
  },
  {
    title: "Family Law",
    description: "Sensitive, professional handling of family and personal matters.",
    benefits: ["Confidential process", "Mediation options", "Clear guidance"],
    process: ["Private consultation", "Documentation", "Mediation/filing", "Resolution"],
    duration: "Varies by case"
  },
  {
    title: "Corporate Law",
    description: "Formation, governance, and compliance support for companies.",
    benefits: ["Company formation", "Governance advice", "Regulatory compliance"],
    process: ["Structure planning", "Documentation", "Filing", "Ongoing advisory"],
    duration: "1–4 weeks for formation"
  },
  {
    title: "Real Estate Law",
    description: "Property transactions, leases, and real estate dispute resolution.",
    benefits: ["Title verification", "Contract drafting", "Dispute resolution"],
    process: ["Property review", "Due diligence", "Contract drafting", "Closing"],
    duration: "2–4 weeks typical"
  }
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-navy dark:text-white md:text-4xl">
        Our Services
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-black/60 dark:text-white/60">
        Professional legal services across every practice area, backed by a
        modern case management platform.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <p className="text-sm text-black/70 dark:text-white/70">{s.description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                Benefits
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-black/60 dark:text-white/60">
                {s.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                Process
              </p>
              <ol className="mt-1 list-inside list-decimal text-sm text-black/60 dark:text-white/60">
                {s.process.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </div>

            <p className="mt-4 text-xs text-black/50 dark:text-white/50">
              Estimated duration: {s.duration}
            </p>

            <LinkButton href="/register" className="mt-4 w-full">
              Book a Consultation
            </LinkButton>
          </Card>
        ))}
      </div>
    </main>
  );
}
