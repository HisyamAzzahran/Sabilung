import clsx from "clsx";
import type { ReactNode } from "react";

export interface InfoBadgeProps {
  icon?: ReactNode;
  label: string;
  tone?: "success" | "danger" | "neutral";
}

const toneClass: Record<Required<InfoBadgeProps>["tone"], string> = {
  success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/20",
  danger: "bg-red-100 text-red-700 border-red-200 dark:bg-danger/10 dark:text-danger dark:border-danger/30",
  neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-white dark:border-white/10",
};

export const InfoBadge = ({ icon, label, tone = "neutral" }: InfoBadgeProps) => (
  <span className={clsx("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", toneClass[tone])}>
    {icon}
    {label}
  </span>
);
