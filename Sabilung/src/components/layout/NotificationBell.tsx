import { Bell } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import type { NotificationUpdate, UserRole } from "../../types";

interface NotificationBellProps {
  updates?: NotificationUpdate[];
  role?: UserRole | null;
  extraCount?: number;
  title?: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const NotificationBell = ({ updates = [], role, extraCount = 0, title }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);

  const relevantUpdates = useMemo(() => {
    const audience = role ?? "citizen";
    return updates.filter((item) => item.audience === "all" || item.audience === audience);
  }, [updates, role]);

  const totalCount = relevantUpdates.length + (role === "government" ? extraCount : 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full border border-slate-200/80 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:scale-105 dark:border-white/20 dark:bg-white/10 dark:text-white"
      >
        <Bell className="h-4 w-4" />
        {totalCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-white">
            {totalCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 rounded-3xl border border-slate-200/80 bg-white/95 p-4 text-sm shadow-2xl dark:border-white/10 dark:bg-slate-900/95">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {title ?? (role === "government" ? "Panel Notifikasi" : "Kabar Terbaru")}
          </p>
          {role === "government" && (
            <div className="mb-3 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200">
              Aduan hari ini: <strong>{extraCount}</strong>
            </div>
          )}
          <div className={clsx("space-y-3", relevantUpdates.length === 0 && "text-slate-400") }>
            {relevantUpdates.length === 0 ? (
              <p>Tidak ada update terbaru.</p>
            ) : (
              relevantUpdates.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{item.message}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
