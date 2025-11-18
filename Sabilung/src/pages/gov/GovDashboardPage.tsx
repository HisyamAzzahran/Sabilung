import { Activity, Database, RadioTower, ShieldEllipsis } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  useComplaints,
  useMapZones,
  useRiskSummary,
  useRiskTrend,
  useCreateUpdateNotice,
  useRiskRecords,
} from "../../hooks/useCrimeResources";
import { StatCard } from "../../components/analytics/StatCard";
import { RiskTrendChart } from "../../components/analytics/RiskTrendChart";
import { DangerMap } from "../../components/map/DangerMap";
import { GlassCard } from "../../components/common/GlassCard";
import { CaseExplorer } from "../../components/analytics/CaseExplorer";
import { BlurFade } from "../../components/common/BlurFade";

const iconStack = [ShieldEllipsis, Database, RadioTower, Activity];

export const GovDashboardPage = () => {
  const { data: stats } = useRiskSummary();
  const { data: trend } = useRiskTrend();
  const { data: mapZones, isLoading: zonesLoading } = useMapZones();
  const { data: complaints } = useComplaints();
  const { data: riskRecords, isLoading: riskLoading } = useRiskRecords();
  const { mutateAsync: createUpdate, isPending: publishing } = useCreateUpdateNotice();
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [broadcastForm, setBroadcastForm] = useState({ title: "", message: "", audience: "citizen" as "citizen" | "government" | "all" });

  const handleBroadcast = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createUpdate(broadcastForm);
    setBroadcastForm({ title: "", message: "", audience: "citizen" });
    setUpdateMessage("Broadcast terkirim ke lonceng notifikasi.");
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats?.map((stat, index) => (
          <StatCard key={stat.label} {...stat} icon={iconStack[index % iconStack.length]} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BlurFade loading={!trend?.length}>
          {trend && trend.length > 0 && <RiskTrendChart data={trend} />}
        </BlurFade>
        <BlurFade loading={zonesLoading}>{mapZones && <DangerMap zones={mapZones.slice(0, 8)} />}</BlurFade>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Quick Response" description="Aduan terbaru warga">
          <div className="space-y-4">
            {complaints?.slice(0, 4).map((complaint) => (
              <div key={complaint.id} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                  <span>{complaint.category}</span>
                  <span>{new Date(complaint.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{complaint.kecamatan}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{complaint.description}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {complaint.reporterName} • {complaint.status}
                </p>
              </div>
            )) || <p className="text-slate-400">Belum ada aduan</p>}
          </div>
        </GlassCard>
        <GlassCard title="Prioritas Operasi" description="Zona kedua paling aktif">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {mapZones?.slice(0, 5).map((zone) => (
              <div
                key={zone.kecamatan}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <div>
                  <p className="text-slate-900 dark:text-white">{zone.kecamatan}</p>
                  <p className="text-xs text-slate-400">{zone.kategoriRisiko}</p>
                </div>
                <p className={zone.trend >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-danger"}>
                  {zone.trend >= 0 ? `Naik ${zone.trend}%` : `Turun ${Math.abs(zone.trend)}%`}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Broadcast Notifikasi" description="Bagikan update terbaru ke warga atau internal pemerintah">
          <form onSubmit={handleBroadcast} className="space-y-3">
            <label className="block text-xs text-slate-500 dark:text-slate-300">
              Judul
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </label>
            <label className="block text-xs text-slate-500 dark:text-slate-300">
              Pesan singkat
              <textarea
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                rows={3}
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm((prev) => ({ ...prev, message: e.target.value }))}
                required
              />
            </label>
            <label className="block text-xs text-slate-500 dark:text-slate-300">
              Target
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                value={broadcastForm.audience}
                onChange={(e) =>
                  setBroadcastForm((prev) => ({ ...prev, audience: e.target.value as "citizen" | "government" | "all" }))
                }
              >
                <option value="citizen">Warga</option>
                <option value="government">Internal Pemerintah</option>
                <option value="all">Semua</option>
              </select>
            </label>
            {updateMessage && <p className="text-xs text-emerald-600 dark:text-emerald-300">{updateMessage}</p>}
            <button
              type="submit"
              disabled={publishing}
              className="w-full rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {publishing ? "Mengirim..." : "Publikasikan"}
            </button>
          </form>
        </GlassCard>
        <BlurFade loading={riskLoading}>
          <CaseExplorer
            records={riskRecords}
            title="Seluruh laporan terperinci"
            description="Gunakan insight ini saat menentukan prioritas patroli atau operasi gabungan."
          />
        </BlurFade>
      </section>
    </div>
  );
};
