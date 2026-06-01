type Props = { className?: string; size?: number };

/** Atemringe — concentric breath rings logo mark */
export function AtemringeLogo({ className, size = 32 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="0.7" opacity="0.65" />
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}
