import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CommonProps = {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-normal uppercase tracking-[0.2em] rounded-[10px] transition-colors duration-300 whitespace-normal text-center";

function resolve(props: CommonProps & ComponentPropsWithoutRef<"a">) {
  const { to, href, children, className, ...rest } = props;
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

export function BtnFill({ className, ...props }: CommonProps & ComponentPropsWithoutRef<"a">) {
  return resolve({
    ...props,
    className: cn("btn-gold whitespace-normal text-center leading-tight", className),
  });
}

export function BtnOutline({ className, ...props }: CommonProps & ComponentPropsWithoutRef<"a">) {
  return resolve({
    ...props,
    className: cn(
      baseClasses,
      "bg-transparent border border-champagne/40 text-offwhite/75 hover:border-champagne hover:text-champagne",
      className
    ),
  });
}

export function BtnDark({ className, ...props }: CommonProps & ComponentPropsWithoutRef<"a">) {
  return resolve({
    ...props,
    className: cn(
      baseClasses,
      "bg-midnight text-cream border border-midnight hover:bg-midnight-soft",
      className
    ),
  });
}
