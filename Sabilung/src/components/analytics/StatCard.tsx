import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string;
  helperText: string;
  trend: number;
  icon: LucideIcon;
}

export const StatCard = ({ label, value, helperText, trend, icon: Icon }: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-slate-100 px-5 py-6 shadow-lg dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,118,255,0.25),_transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{helperText}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className={clsx("text-sm font-semibold", trend >= 0 ? "text-danger" : "text-emerald-500 dark:text-emerald-300")}>
          {trend >= 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
        </span>
        <span className="mt-4 rounded-2xl bg-slate-900/5 p-3 text-brand-600 dark:bg-white/10 dark:text-brand-200">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  </div>
);
