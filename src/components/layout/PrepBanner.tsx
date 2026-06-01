import { useLang } from "@/i18n/LanguageProvider";

export function PrepBanner() {
  const { lang } = useLang();
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-champagne text-midnight text-center px-5 py-2 text-[10px] font-normal uppercase tracking-[0.25em]">
      {lang === "en" ? "Launching Soon" : "Bald verfügbar"}
    </div>
  );
}
