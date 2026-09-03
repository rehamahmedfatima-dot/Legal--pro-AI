"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/locale";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <button
        onClick={() => switchTo("ar")}
        className={locale === "ar" ? "text-gold" : "text-black/40 hover:text-navy dark:text-white/40 dark:hover:text-white"}
        aria-label="العربية"
      >
        AR
      </button>
      <span className="text-black/20 dark:text-white/20">/</span>
      <button
        onClick={() => switchTo("en")}
        className={locale === "en" ? "text-gold" : "text-black/40 hover:text-navy dark:text-white/40 dark:hover:text-white"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
