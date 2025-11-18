import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex flex-col items-center gap-4 py-20 text-center">
    <p className="rounded-full border border-slate-200 px-4 py-2 text-xs uppercase tracking-[0.4em] text-slate-400 dark:border-white/10">
      404
    </p>
    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Halaman tidak ditemukan</h1>
    <p className="max-w-2xl text-slate-500 dark:text-slate-300">Tautan yang Anda cari belum tersedia pada rilis publik Sabilung CrimeView.</p>
    <Link to="/" className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow">
      Kembali ke beranda
    </Link>
  </div>
);
