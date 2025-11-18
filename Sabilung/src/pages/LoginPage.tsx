import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "government") {
        navigate("/gov/dashboard");
      } else if (user.role === "citizen") {
        navigate("/citizen/report");
      } else {
        navigate("/admin/approvals");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal masuk, coba lagi");
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-4xl border border-slate-200/70 bg-white px-8 py-10 shadow-2xl dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Masuk</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Sabilung Console</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Mock credentials:
        <span className="block text-xs text-slate-500 dark:text-slate-300">
          Pemda: pemda@bandungkab.go.id / admin123 • Warga: warga@example.com / warga123 • Admin: admin@jaga-lembur.id / approve123
        </span>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-slate-600 dark:text-slate-300">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600 dark:text-slate-300">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={loading} className="w-full justify-center">
          Masuk sekarang
        </Button>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Belum punya akun? <Link to="/register" className="text-brand-600 dark:text-brand-200">Daftar warga</Link>
        </p>
      </form>
    </div>
  );
};
