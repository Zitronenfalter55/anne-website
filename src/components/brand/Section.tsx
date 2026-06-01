import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "midnight" | "cream" | "soft";

const toneClasses: Record<Tone, string> = {
  midnight: "bg-atmosphere text-cream grain",
  cream: "bg-atmosphere-cream text-midnight grain",
  soft: "bg-atmosphere-soft text-cream grain",
};

export function Section({
  children,
  tone = "midnight",
  className,
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden px-6 md:px-10 py-24 md:py-32", toneClasses[tone], className)}>
      <div className="relative max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  tone = "midnight",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
}) {
  return (
    <section
      className={cn(
        "px-6 md:px-10 pt-40 pb-24 md:pt-48 md:pb-32",
        tone === "cream" ? "bg-cream text-midnight" : "bg-midnight text-cream"
      )}
    >
      <div className="max-w-4xl mx-auto">
        <p
          className={cn(
            "text-[10px] font-light uppercase tracking-[0.32em] mb-6",
            tone === "cream" ? "text-earth" : "text-champagne"
          )}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif font-light leading-[1.1] text-[clamp(2.75rem,6vw,5rem)] tracking-[-0.01em] mb-8">
          {title}
        </h1>
        {intro && (
          <p
            className={cn(
              "max-w-2xl text-lg md:text-xl font-light leading-relaxed",
              tone === "cream" ? "text-earth" : "text-offwhite/80"
            )}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
