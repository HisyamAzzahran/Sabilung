import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../components/common/Button";
import { useComplaintMutation, useComplaints, useRiskRecords } from "../../hooks/useCrimeResources";
import { CaseExplorer } from "../../components/analytics/CaseExplorer";
import { BlurFade } from "../../components/common/BlurFade";

const categories = ["Pencurian", "Narkoba", "Kekerasan", "Penipuan", "Perjudian"];
const kecamatanOptions = ["Soreang", "Ciparay", "Rancaekek", "Banjaran", "Dayeuhkolot", "Pangalengan"];

export const CitizenReportPage = () => {
  const [form, setForm] = useState({
    reporterName: "",
    reporterContact: "",
    category: categories[0],
    kecamatan: kecamatanOptions[0],
    kelurahan: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutateAsync, isPending } = useComplaintMutation();
  const { data: complaints, isLoading: complaintsLoading } = useComplaints();
  const { data: riskRecords, isLoading: riskLoading } = useRiskRecords();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync(form);
    setSuccessMessage("Terima kasih, laporan berhasil dikirim dan diterima petugas 24/7.");
    setForm((prev) => ({ ...prev, description: "" }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Form warga</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Layanan Aduan 24/7</h3>
        </div>
        <label className="text-sm text-slate-600 dark:text-slate-300">
          Nama Pelapor
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            value={form.reporterName}
            onChange={(e) => setForm((prev) => ({ ...prev, reporterName: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-600 dark:text-slate-300">
          Kontak
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            value={form.reporterContact}
            onChange={(e) => setForm((prev) => ({ ...prev, reporterContact: e.target.value }))}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Kategori
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Kecamatan
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              value={form.kecamatan}
              onChange={(e) => setForm((prev) => ({ ...prev, kecamatan: e.target.value }))}
            >
              {kecamatanOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="text-sm text-slate-600 dark:text-slate-300">
          Kelurahan/Desa
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            value={form.kelurahan}
            onChange={(e) => setForm((prev) => ({ ...prev, kelurahan: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-600 dark:text-slate-300">
          Ceritakan kronologi
          <textarea
            className="mt-1 w-full rounded-3xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            rows={5}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </label>
        {successMessage && <p className="text-sm text-emerald-600 dark:text-emerald-300">{successMessage}</p>}
        <Button type="submit" loading={isPending} className="w-full justify-center">
          Kirim Sekarang
        </Button>
      </form>

      <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Timeline Respons</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Aduan terbaru akan masuk otomatis ke dashboard pemerintah.</p>
        <div className="mt-6 space-y-4">
          <BlurFade loading={complaintsLoading}>
            {complaints?.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{complaint.kecamatan}</span>
                  <span>{new Date(complaint.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-slate-900 dark:text-white">{complaint.category}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{complaint.description}</p>
              </div>
            )) || <p className="text-slate-500 dark:text-slate-400">Belum ada data</p>}
          </BlurFade>
        </div>
      </div>

      <BlurFade loading={riskLoading} className="lg:col-span-2">
        <CaseExplorer
          records={riskRecords}
          title="Total kasus per kecamatan"
          description="Pantau seluruh laporan resmi agar warga dapat memantau lingkungan secara mandiri."
          limit={8}
        />
      </BlurFade>
    </div>
  );
};
