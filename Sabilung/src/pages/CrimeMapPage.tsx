import { DangerMap } from "../components/map/DangerMap";
import { RiskLegend } from "../components/map/RiskLegend";
import { InteractiveRiskMap } from "../components/map/InteractiveRiskMap";
import { useMapZones, useRiskRecords } from "../hooks/useCrimeResources";
import { CaseExplorer } from "../components/analytics/CaseExplorer";
import { BlurFade } from "../components/common/BlurFade";
import { StaticRiskMap } from "../components/map/StaticRiskMap";

export const CrimeMapPage = () => {
  const { data: zones, isLoading } = useMapZones();
  const { data: records, isLoading: recordsLoading } = useRiskRecords();

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Publik</p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Peta Risiko Kriminal Kabupaten Bandung</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Layer ini merangkum konsolidasi data kepolisian, laporan kelurahan, dan pengaduan warga yang disusun otomatis oleh CrimeView.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <RiskLegend />
            <p className="text-xs text-slate-500 dark:text-slate-400">{records?.length ?? 0} rekaman analisis aktif</p>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Klik zona atau marker untuk melihat kategori risiko, dominan kasus, serta tren kenaikan/penurunan.
          </p>
        </div>
        <BlurFade loading={isLoading}>
          {isLoading || !zones ? (
            <div className="flex items-center justify-center rounded-4xl border border-slate-200/70 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
              Memuat peta interaktif...
            </div>
          ) : (
            <InteractiveRiskMap zones={zones} />
          )}
        </BlurFade>
      </div>

      <BlurFade loading={isLoading}>{zones && <DangerMap zones={zones} />}</BlurFade>

      {zones && (
        <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detail Zona</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm text-slate-600 dark:text-slate-200">
              <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-2">Kecamatan</th>
                  <th>Kelurahan</th>
                  <th>Dominan</th>
                  <th>Status</th>
                  <th>Perubahan</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.kecamatan} className="border-t border-slate-100 dark:border-white/5">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{zone.kecamatan}</td>
                    <td>{zone.kelurahanCount}</td>
                    <td>{zone.dominantCase}</td>
                    <td>{zone.kategoriRisiko}</td>
                    <td className={zone.trend >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-danger"}>
                      {zone.trend >= 0 ? `Naik ${zone.trend}%` : `Turun ${Math.abs(zone.trend)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BlurFade loading={recordsLoading}>
        <StaticRiskMap records={records} title="" />
      </BlurFade>

      <CaseExplorer
        records={records}
        title="Eksplorasi kasus menyeluruh"
        description="Gunakan tombol kategori untuk menampilkan semua laporan per kecamatan."
      />
    </div>
  );
};
