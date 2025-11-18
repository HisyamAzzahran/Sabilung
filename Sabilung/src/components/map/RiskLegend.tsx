import type { RiskCategory } from "../../types";

const mapping: Record<RiskCategory, { label: string; color: string }> = {
  AMAN: { label: "AMAN", color: "bg-emerald-400/60" },
  RENDAH: { label: "RENDAH", color: "bg-sky-400/60" },
  SEDANG: { label: "SEDANG", color: "bg-amber-400/60" },
  TINGGI: { label: "TINGGI", color: "bg-danger/70" },
};

export const RiskLegend = () => (
  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
    {Object.entries(mapping).map(([key, value]) => (
      <span key={key} className="inline-flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${value.color}`} />
        {value.label}
      </span>
    ))}
  </div>
);
