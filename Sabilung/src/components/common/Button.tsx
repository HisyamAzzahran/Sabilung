import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  loading?: boolean;
}

const baseClass =
  "relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-glow hover:-translate-y-0.5 hover:bg-brand-500 focus-visible:outline-brand-500",
  secondary:
    "border border-slate-200/80 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 focus-visible:outline-brand-200 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
  ghost:
    "text-brand-700 hover:bg-slate-900/5 hover:text-brand-900 focus-visible:outline-brand-200 dark:text-brand-200 dark:hover:bg-white/5 dark:hover:text-white",
};

export const Button = ({ variant = "primary", icon, loading, children, className, ...props }: ButtonProps) => (
  <button className={clsx(baseClass, variantClass[variant], className)} disabled={loading || props.disabled} {...props}>
    {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
    {!loading && icon}
    <span>{children}</span>
  </button>
);
