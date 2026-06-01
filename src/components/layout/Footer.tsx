import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageProvider";

const INSTAGRAM_URL = "https://www.instagram.com/annewolter.voice/";
const LINKEDIN_URL = "https://www.linkedin.com/in/annewolter/";

export function Footer() {
  const { lang } = useLang();
  const t = (en: string, de: string) => (lang === "en" ? en : de);

  const navLinks = [
    { to: "/method", en: "Voice Alignment", de: "Voice Alignment" },
    { to: "/work-with-me", en: "Work With Anne", de: "Work With Anne" },
    { to: "/about", en: "About", de: "Über mich" },
    { to: "/#faq", en: "FAQ", de: "FAQ" },
    { to: "/breath-reset", en: "Breath Reset", de: "Breath Reset" },
  ];

  return (
    <footer className="bg-midnight border-t border-champagne/10 px-6 md:px-12 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-14 md:gap-20">
          {/* Column 1 — Brand */}
          <div>
            <p className="font-serif text-[22px] text-champagne tracking-[0.04em] leading-none">
              Anne Wolter
            </p>
            <p className="font-serif italic text-[13px] font-light text-champagne/70 tracking-[0.06em] mt-1">
              Creator of the Voice Alignment Method
            </p>
            <p className="font-serif text-[13px] text-champagne/80 tracking-[0.04em] mt-1">
              breath. voice. aligned.
            </p>
            <p className="mt-8 font-serif italic text-[15px] font-light leading-[1.55] text-champagne/85 max-w-xs">
              {t(
                "A voice that stays with you under pressure.",
                "Eine Stimme, die unter Druck bei dir bleibt."
              )}
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-[12px] md:text-[10px] uppercase tracking-[0.28em] text-champagne/60 mb-6">
              {t("Explore", "Entdecken")}
            </p>
            <ul className="flex flex-col gap-4 md:gap-3.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[14px] md:text-[12px] uppercase tracking-[0.2em] text-offwhite/80 md:text-offwhite/70 hover:text-champagne transition-colors"
                  >
                    {t(l.en, l.de)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Connect */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-champagne/60 mb-6">
              {t("Connect", "Kontakt")}
            </p>
            <a
              href="https://calendly.com/hello-annewolter/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex btn-gold text-center leading-tight"
              style={{ padding: "11px 18px", fontSize: "10.5px" }}
            >
              {t("Book a Discovery Call", "Discovery Call buchen")}
            </a>

            <ul className="mt-8 flex flex-col gap-3.5">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.2em] text-offwhite/70 hover:text-champagne transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.2em] text-offwhite/70 hover:text-champagne transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>

            <a
              href="mailto:hello@annewolter.com"
              className="block mt-6 text-[12px] font-light text-offwhite/60 hover:text-champagne transition-colors"
            >
              hello@annewolter.com
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-champagne/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[11px] font-light text-offwhite/40 tracking-wide">
            © 2026 Anne Wolter
          </p>
          <div className="flex gap-7">
            <Link
              to="/datenschutz"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
              className="text-[10px] uppercase tracking-[0.22em] text-offwhite/45 hover:text-champagne transition-colors"
            >
              {t("Privacy Policy", "Datenschutz")}
            </Link>
            <Link
              to="/impressum"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
              className="text-[10px] uppercase tracking-[0.22em] text-offwhite/45 hover:text-champagne transition-colors"
            >
              {t("Imprint", "Impressum")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
