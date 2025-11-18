import { Link, useSearchParams } from "react-router-dom";

export const EmailConfirmedPage = () => {
  const [params] = useSearchParams();
  const email = params.get("email");

  return (
    <div className="mx-auto max-w-2xl rounded-4xl border border-slate-200/70 bg-white px-8 py-16 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Sabilung CrimeView</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Email berhasil diverifikasi</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        {email ? `Alamat ${email} sudah aktif.` : "Akun Anda sudah aktif."} Silakan kembali ke halaman login untuk masuk ke dashboard.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          to="/login"
          className="inline-flex rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          Kembali ke halaman login
        </Link>
        <Link to="/" className="text-sm font-semibold text-brand-600 dark:text-brand-200">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};
