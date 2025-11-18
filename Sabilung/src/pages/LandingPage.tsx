import { Link } from "react-router-dom";
import { OrbitParticles } from "../components/animations/OrbitParticles";
import { useRiskSummary, useMapZones, useUpdates, useRiskRecords } from "../hooks/useCrimeResources";
import { DangerMap } from "../components/map/DangerMap";
import { InfoBadge } from "../components/common/InfoBadge";
import { InteractiveRiskMap } from "../components/map/InteractiveRiskMap";
import { CaseExplorer } from "../components/analytics/CaseExplorer";
import { BlurFade } from "../components/common/BlurFade";
import { StaticRiskMap } from "../components/map/StaticRiskMap";

export const LandingPage = () => {
  const { data: stats, isLoading: statsLoading } = useRiskSummary();
  const { data: mapZones, isLoading: zonesLoading } = useMapZones();
  const { data: updates, isLoading: updatesLoading } = useUpdates();
  const { data: riskRecords, isLoading: recordsLoading } = useRiskRecords();

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-white px-8 py-16 shadow-2xl dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <OrbitParticles />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Kabupaten Bandung</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-900 dark:text-white lg:text-5xl">
              Sabilung CrimeView
              <span className="block text-lg font-normal text-slate-500 dark:text-slate-300">
                Dashboard risiko kriminalitas & kanal aduan terpadu
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              Pantau zona rawan, unggah batch data resmi, dan tangani aduan warga secara real-time dengan gaya elegan ala reactbits.dev dan animasi anime.js.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/map"
                className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Lihat Peta Risiko
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:border-white/20 dark:text-white"
              >
                Masuk Sistem
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-xs">
              <InfoBadge label="Integrasi data kepolisian" />
              <InfoBadge label="Terinspirasi reactbits.dev" />
              <InfoBadge label="Animasi oleh animejs" />
            </div>
            <BlurFade loading={statsLoading} className="mt-8 grid gap-4 sm:grid-cols-2">
              {stats?.slice(0, 2).map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-500 dark:text-slate-300">{stat.label}</p>
                    <span className={stat.trend >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-danger"}>
                      {stat.trend >= 0 ? `+${stat.trend}%` : `${stat.trend}%`}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.helperText}</p>
                </div>
              )) || <p className="text-slate-500">Memuat ringkasan...</p>}
            </BlurFade>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">Heatmap Risiko Kabupaten Bandung</p>
            <BlurFade loading={zonesLoading}>
              {mapZones ? (
                <InteractiveRiskMap zones={mapZones} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-4xl border border-slate-200/70 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                  Memuat peta interaktif...
                </div>
              )}
            </BlurFade>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Pantauan Publik</p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Zona Risiko 24/7</h2>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">
            Semua warga dapat mengakses kondisi risiko kriminal Kabupaten Bandung. Data diperbarui dari unggahan resmi, persetujuan admin, dan laporan warga.
          </p>
        </div>
        <BlurFade loading={zonesLoading}>
          {mapZones ? (
            <DangerMap zones={mapZones.slice(0, 6)} />
          ) : (
            <div className="rounded-3xl border border-slate-200/70 bg-slate-100 p-6 text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
              Memuat kartu zona...
            </div>
          )}
        </BlurFade>
      </section>

      <StaticRiskMap records={riskRecords} title="Choropleth Hasil Analisis" />

      <BlurFade loading={recordsLoading}>
        <CaseExplorer
          records={riskRecords}
          title="Kasus lengkap lintas kecamatan"
          description="Gunakan tombol kategori untuk mengeksplorasi seluruh laporan tanpa batas hanya dengan satu klik."
          limit={6}
        />
      </BlurFade>

      <section className="space-y-4 rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Update Pemda</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifikasi terbaru</h3>
        </div>
        <BlurFade loading={updatesLoading} className="grid gap-4 md:grid-cols-3">
          {updates?.filter((item) => item.audience === "citizen" || item.audience === "all").slice(0, 3).map((update) => (
            <div key={update.id} className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{update.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">{update.message}</p>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-slate-400">{new Date(update.createdAt).toLocaleString("id-ID")}</p>
            </div>
          )) || <p className="text-slate-500 dark:text-slate-300">Belum ada pesan terbaru.</p>}
        </BlurFade>
      </section>
    </div>
  );
};
