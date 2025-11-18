import { Outlet } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";

export const PublicLayout = () => (
  <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,148,255,0.15),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(13,148,255,0.25),_transparent_60%)]" />
    <TopNav />
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      <Outlet />
    </main>
  </div>
);
