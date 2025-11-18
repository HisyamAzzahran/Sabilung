import clsx from "clsx";
import type { ReactNode } from "react";

interface GlassCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Simple glassmorphism card inspired by reactbits.dev component collection.
 */
export const GlassCard = ({ title, description, action, children, className }: GlassCardProps) => (
  <div
    className={clsx(
      "rounded-3xl border border-slate-200/70 bg-white/70 px-6 py-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5",
      className
    )}
  >
    {(title || action) && (
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {title && <p className="font-semibold text-slate-900 dark:text-white">{title}</p>}
          {description && <p className="text-xs text-slate-500 dark:text-slate-300">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);
