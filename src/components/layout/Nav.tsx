import { useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { AtemringeLogo } from "@/components/brand/AtemringeLogo";

const links = [
  { to: "/", en: "Home", de: "Start" },
  { to: "/method", en: "Voice Alignment", de: "Voice Alignment" },
  { to: "/work-with-me", en: "Work With Anne", de: "Work With Anne" },
  { to: "/workshops", en: "Workshops", de: "Workshops" },
  { to: "/about", en: "About", de: "Über mich" },
  { to: "/#faq", en: "FAQ", de: "FAQ" },
  { to: "/breath-reset", en: "Breath Reset", de: "Breath Reset" },
];

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
  if (!to.includes("#")) return;
  const hash = to.split("#")[1];
  if (!hash) return;
  // only intercept when on home route
  if (window.location.pathname === "/" || window.location.pathname === "") {
    const el = document.getElementById(hash);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${hash}`);
    }
  }
}

export function Nav() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLegalPage = ["/impressum", "/datenschutz"].includes(location.pathname);

  return (
    <header className="fixed top-[32px] inset-x-0 z-50 bg-midnight/95 backdrop-blur-md border-b border-champagne/15">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 gap-8">
        <Link
          to="/"
          onClick={() => {
            if (window.location.pathname === "/") {
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3.5"
          aria-label="Home"
        >
          <AtemringeLogo className="text-champagne shrink-0" size={40} />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[24px] md:text-[30px] font-normal text-champagne tracking-[0.04em]">
              Anne Wolter
            </span>
            <span className="font-serif italic text-[11px] md:text-[13px] font-light text-champagne/70 tracking-[0.06em] mt-1.5">
              Creator of the Voice Alignment Method
            </span>
            <span className="font-serif text-[12px] md:text-[14px] font-normal text-champagne/80 tracking-[0.04em] mt-1">
              breath. voice. aligned.
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex gap-8 flex-1 justify-center">
          {links.map((l) => {
            const path = l.to.split("#")[0] || "/";
            const isActive =
              path === "/"
                ? location.pathname === "/" && !l.to.includes("#")
                : location.pathname === path;
            return (
              <a
                key={l.to}
                href={l.to}
                onClick={(e) => smoothScroll(e, l.to)}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : undefined}
                className={cn(
                  "nav-link relative text-[11px] uppercase tracking-[0.22em] transition-colors whitespace-nowrap pb-1 border-b",
                  isActive
                    ? "text-champagne font-normal border-champagne/70"
                    : "text-offwhite/85 font-light border-transparent hover:text-champagne"
                )}
              >
                {lang === "en" ? l.en : l.de}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-7">
          <div className="flex items-center text-[12px] md:text-[11px] uppercase tracking-[0.22em] text-offwhite/70">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={cn(
                "px-2 py-1 transition-colors",
                lang === "en" ? "text-champagne" : "hover:text-champagne/80"
              )}
            >
              EN
            </button>
            <span className="text-champagne/30">/</span>
            <button
              type="button"
              onClick={() => setLang("de")}
              aria-pressed={lang === "de"}
              className={cn(
                "px-2 py-1 transition-colors",
                lang === "de" ? "text-champagne" : "hover:text-champagne/80"
              )}
            >
              DE
            </button>
          </div>

          {!isLegalPage && (
            <a
              href="https://calendly.com/hello-annewolter/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex btn-gold text-center leading-tight"
              style={{ padding: "11px 18px", fontSize: "10.5px" }}
            >
              {lang === "en" ? (
                <>Book a Free<br />Discovery Call</>
              ) : (
                <>Kostenfreier<br />Discovery Call</>
              )}
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-cream"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-champagne/10 bg-midnight">
          <div className="flex flex-col px-6 py-7 gap-5">
            {links.map((l) => {
              const path = l.to.split("#")[0] || "/";
              const isActive =
                path === "/"
                  ? location.pathname === "/" && !l.to.includes("#")
                  : location.pathname === path;
              return (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={(e) => {
                    smoothScroll(e, l.to);
                    setOpen(false);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive ? "true" : undefined}
                  className={cn(
                    "nav-link text-[15px] uppercase tracking-[0.18em] py-1 transition-colors",
                    isActive
                      ? "text-champagne font-semibold"
                      : "text-offwhite font-medium hover:text-champagne"
                  )}
                >
                  {lang === "en" ? l.en : l.de}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
