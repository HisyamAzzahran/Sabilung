import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRegisterUpload, useUploads } from "../../hooks/useCrimeResources";
import { Button } from "../../components/common/Button";
import { analyzeUploadFile } from "../../utils/uploadParser";

const statusColor: Record<string, string> = {
  PENDING_REVIEW: "text-amber-600 dark:text-amber-300",
  APPROVED: "text-emerald-600 dark:text-emerald-300",
  REJECTED: "text-danger",
};

export const GovUploadsPage = () => {
  const { data: uploads } = useUploads();
  const { mutateAsync, isPending } = useRegisterUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{ rowCount: number; errorCount: number; warnings: string[] } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
    setAnalysis(null);
    setError(null);
    setMessage(null);
    if (file) {
      try {
        const summary = await analyzeUploadFile(file);
        setAnalysis(summary);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !analysis) {
      setError("Pilih file CSV/Excel terlebih dahulu dan pastikan dianalisis.");
      return;
    }
    await mutateAsync({ fileName: selectedFile.name, rowCount: analysis.rowCount, errorCount: analysis.errorCount, notes });
    setMessage("File berhasil dikirim dan menunggu persetujuan admin.");
    setSelectedFile(null);
    setAnalysis(null);
    setNotes("");
    (event.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Upload Batch</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Catatan unggahan terbaru</h3>
          </div>
          <a
            href="/templates/jaga-crime-template.xlsx"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-600 dark:border-white/20 dark:text-white"
            download
          >
            Unduh Template Excel
          </a>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm text-slate-600 dark:text-slate-200">
            <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-2">File</th>
                <th>Diupload</th>
                <th>Baris</th>
                <th>Error</th>
                <th>Status</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {uploads?.map((upload) => (
                <tr key={upload.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{upload.fileName}</td>
                  <td>{new Date(upload.uploadedAt).toLocaleString("id-ID")}</td>
                  <td>{upload.rowCount.toLocaleString("id-ID")}</td>
                  <td>{upload.errorCount}</td>
                  <td className={statusColor[upload.status]}>{upload.status}</td>
                  <td className="text-slate-500 dark:text-slate-400">{upload.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upload File CSV / Excel</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Gunakan template yang disediakan, sistem akan menghitung jumlah baris & error otomatis.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Pilih File
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold hover:border-brand-200 dark:border-white/20 dark:bg-slate-900/70 dark:text-white"
            />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Catatan Internal
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional"
              className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/20 dark:bg-slate-900/70 dark:text-white"
            />
          </label>
        </div>
        {analysis && (
          <div className="mt-4 rounded-3xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">Ringkasan File</p>
            <p>Baris terdeteksi: {analysis.rowCount.toLocaleString("id-ID")}</p>
            <p>Error potensial: {analysis.errorCount}</p>
            {analysis.warnings.map((warn) => (
              <p key={warn} className="text-amber-500">{warn}</p>
            ))}
          </div>
        )}
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        {message && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">{message}</p>}
        <div className="mt-6 flex justify-end">
          <Button type="submit" loading={isPending} disabled={!selectedFile}>
            Kirim untuk validasi
          </Button>
        </div>
      </form>
    </div>
  );
};
