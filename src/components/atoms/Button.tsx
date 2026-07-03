import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20",
  secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  danger:
    "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-[0.98]",
        variantClassName[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
