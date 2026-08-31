import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Cases Handled", value: "1,200+" },
  { label: "Success Rate", value: "94%" },
  { label: "Years of Experience", value: "15+" },
  { label: "Clients Served", value: "3,000+" }
];

const practiceAreas = [
  "Civil Law",
  "Criminal Law",
  "Commercial Law",
  "Family Law",
  "Corporate Law",
  "Real Estate Law"
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-navy dark:text-white md:text-6xl">
          Smart Legal Solutions. Trusted Professional Service.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-black/60 dark:text-white/60">
          LegalPro AI brings case management, client collaboration, and AI-powered
          legal tools into a single premium platform.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/register">
            <Button>Book a Consultation</Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="border border-black/10 dark:border-white/10">
              Our Services
            </Button>
          </Link>
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
          Practice Areas
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {practiceAreas.map((area) => (
            <Card key={area}>
              <CardHeader>
                <CardTitle>{area}</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                Professional consultation and representation.
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
