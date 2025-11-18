import { useMemo, useState } from "react";
import { useComplaints, useComplaintStatusMutation } from "../../hooks/useCrimeResources";
import type { Complaint } from "../../types";

const badgeColor: Record<string, string> = {
  NEW: "bg-danger/30 text-danger",
  IN_PROGRESS: "bg-amber-200/30 text-amber-200",
  RESOLVED: "bg-emerald-400/20 text-emerald-200",
};

export const GovComplaintsPage = () => {
  const { data: complaints } = useComplaints();
  const [status, setStatus] = useState<string>("ALL");
  const { mutateAsync: updateStatus } = useComplaintStatusMutation();

  const filtered = useMemo(() => {
    if (!complaints) return [];
    if (status === "ALL") return complaints;
    return complaints.filter((item) => item.status === status);
  }, [complaints, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Aduan</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Inbox Reaktif</h3>
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-2xl border border-slate-200/70 bg-white px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
        >
          <option value="ALL">Semua Status</option>
          <option value="NEW">Baru</option>
          <option value="IN_PROGRESS">Dalam Proses</option>
          <option value="RESOLVED">Selesai</option>
        </select>
      </div>

      <div className="rounded-4xl border border-slate-200/70 bg-white shadow-xl dark:border-white/10 dark:bg-white/5">
        <div className="grid grid-cols-6 border-b border-slate-100 px-6 py-4 text-xs uppercase tracking-widest text-slate-500 dark:border-white/5 dark:text-slate-400 max-md:hidden">
          <span>Waktu</span>
          <span>Pelapor</span>
          <span>Kategori</span>
          <span>Wilayah</span>
          <span>Status</span>
          <span>Detail</span>
        </div>
        <div>
          {filtered.length > 0 ? (
            filtered.map((complaint) => (
              <article
                key={complaint.id}
                className="grid grid-cols-6 items-center border-b border-slate-100 px-6 py-4 text-sm text-slate-600 max-md:grid-cols-1 max-md:gap-2 dark:border-white/5 dark:text-slate-200"
              >
                <span>{new Date(complaint.createdAt).toLocaleString("id-ID")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{complaint.reporterName}</span>
                <span>{complaint.category}</span>
                <span>
                  {complaint.kecamatan}
                  <span className="block text-xs text-slate-400">{complaint.kelurahan}</span>
                </span>
                <select
                  value={complaint.status}
                  onChange={(e) => updateStatus({ id: complaint.id, status: e.target.value as Complaint["status"] })}
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeColor[complaint.status]} bg-transparent`}
                >
                  <option value="NEW">NEW</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
                <p className="text-slate-600 dark:text-slate-300">{complaint.description}</p>
              </article>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">Tidak ada aduan dengan filter tersebut.</div>
          )}
        </div>
      </div>
    </div>
  );
};
