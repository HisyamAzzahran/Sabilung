import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/common/Button";
import { useCitizenRegistration } from "../hooks/useCrimeResources";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { mutateAsync, isPending, isSuccess } = useCitizenRegistration();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await mutateAsync(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-4xl border border-slate-200/70 bg-white px-8 py-10 shadow-2xl dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Daftar</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Warga Sabilung</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Buat akun untuk mengakses kanal aduan 24/7 dan menerima notifikasi update dari pemerintah.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Nama Lengkap
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        {isSuccess && (
          <p className="text-sm text-emerald-600 dark:text-emerald-300">
            Registrasi terkirim! Cek email Anda untuk konfirmasi sebelum masuk.
          </p>
        )}
        <Button type="submit" loading={isPending} className="w-full justify-center">
          Buat Akun
        </Button>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Sudah punya akun? <Link to="/login" className="text-brand-600 dark:text-brand-200">Masuk</Link>
        </p>
      </form>
    </div>
  );
};
