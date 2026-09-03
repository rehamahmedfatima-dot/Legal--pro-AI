import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/public/Header";
import { getLocale, dirFor } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  title: "LegalPro AI — Smart Legal Solutions. Trusted Professional Service.",
  description:
    "AI-powered legal case management platform: cases, clients, appointments, documents, and AI legal tools in one place."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body className="bg-bg-light font-sans text-navy antialiased dark:bg-bg-dark dark:text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
