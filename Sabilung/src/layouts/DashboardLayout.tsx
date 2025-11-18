import type { ReactNode } from "react";
import { TopNav } from "../components/layout/TopNav";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const DashboardLayout = ({ title, subtitle, children }: DashboardLayoutProps) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.12),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.15),_transparent_60%)]" />
    <TopNav />
    <section className="relative mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Sabilung CrimeView</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-300">{subtitle}</p>}
      </header>
      {children}
    </section>
  </div>
);
