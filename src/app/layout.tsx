import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalPro AI — Smart Legal Solutions. Trusted Professional Service.",
  description:
    "AI-powered legal case management platform: cases, clients, appointments, documents, and AI legal tools in one place."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bg-light font-sans text-navy antialiased dark:bg-bg-dark dark:text-white">
        {children}
      </body>
    </html>
  );
}
