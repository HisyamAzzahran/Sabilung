import clsx from "clsx";
import type { MapZone } from "../../types";

const badgeClass: Record<MapZone["kategoriRisiko"], string> = {
  AMAN: "bg-emerald-50 text-emerald-700 border-emerald-100",
  RENDAH: "bg-sky-50 text-sky-600 border-sky-100",
  SEDANG: "bg-amber-50 text-amber-600 border-amber-100",
  TINGGI: "bg-rose-50 text-rose-600 border-rose-100",
};

const categoryLabel: Record<MapZone["kategoriRisiko"], string> = {
  AMAN: "Aman",
  RENDAH: "Risiko Rendah",
  SEDANG: "Risiko Sedang",
  TINGGI: "Risiko Tinggi",
};

export const DangerMap = ({ zones }: { zones: MapZone[] }) => (
  <div className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-white px-6 py-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,118,255,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(26,118,255,0.25),_transparent_55%)]" />
    <div className="relative grid gap-4 lg:grid-cols-2">
      {zones.map((zone) => {
        const isUp = zone.trend >= 0;
        return (
          <div
            key={zone.kecamatan}
            className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-md transition hover:-translate-y-0.5 dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent"
          >
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{zone.kecamatan}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400">{zone.kelurahanCount} kelurahan</p>
              </div>
              <span className={clsx("rounded-full border px-3 py-1 text-xs font-semibold", badgeClass[zone.kategoriRisiko])}>
                {categoryLabel[zone.kategoriRisiko]}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Dominan</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{zone.dominantCase}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Tren {zone.trend >= 0 ? "Kenaikan" : "Penurunan"}</p>
              </div>
              <div className="text-right">
                <p className={clsx("text-sm font-semibold", isUp ? "text-danger" : "text-emerald-500")}>
                  {isUp ? `Naik ${zone.trend}%` : `Turun ${Math.abs(zone.trend)}%`}
                </p>
                <p className="text-xs text-slate-400">dibanding minggu lalu</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
