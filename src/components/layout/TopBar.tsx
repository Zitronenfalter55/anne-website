import { Mail, Instagram, Linkedin } from "lucide-react";

const EMAIL = "hello@annewolter.com";
const INSTAGRAM_URL = "https://www.instagram.com/annewolter.voice/";
const LINKEDIN_URL = "https://www.linkedin.com/in/annewolter/";

export function TopBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-midnight/95 backdrop-blur-md border-b border-champagne/10 h-8 flex items-center">
      <div className="w-full flex items-center justify-between px-6 md:px-12 text-[11px] tracking-[0.14em] text-offwhite/80">
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 hover:text-champagne transition-colors"
          aria-label="Email"
        >
          <Mail size={12} className="text-champagne" />
          <span className="hidden sm:inline">{EMAIL}</span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-champagne transition-colors"
          >
            <Instagram size={14} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-champagne transition-colors"
          >
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
