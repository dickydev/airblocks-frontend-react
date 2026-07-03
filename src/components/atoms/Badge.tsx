type BadgeProps = {
  children: string;
  variant?: "success" | "warning" | "neutral";
};

const variantClassName = {
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  warning: "border-yellow-400/20 bg-yellow-400/10 text-yellow-200",
  neutral: "border-white/10 bg-white/10 text-slate-300",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        variantClassName[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
