import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Eyebrow({ children, className, tone = "champagne" }: { children: ReactNode; className?: string; tone?: "champagne" | "earth" | "sage" | "berry" }) {
  const colorMap = {
    champagne: "text-champagne",
    earth: "text-earth",
    sage: "text-sage",
    berry: "text-berry",
  } as const;
  return (
    <p
      className={cn(
        "text-[10px] font-light uppercase tracking-[0.32em] mb-5",
        colorMap[tone],
        className
      )}
    >
      {children}
    </p>
  );
}

export function Heading({
  children,
  className,
  as: Tag = "h2",
  light = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  light?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "font-serif font-light leading-[1.15] mb-8",
        Tag === "h1"
          ? "text-[clamp(2.75rem,5.5vw,4.5rem)] tracking-[-0.01em]"
          : "text-[clamp(2.125rem,4.5vw,3.375rem)]",
        light ? "text-midnight" : "text-cream",
        className
      )}
    >
      {children}
    </Tag>
  );
}
