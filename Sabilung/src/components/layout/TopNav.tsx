import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";
import { ThemeToggle } from "../common/ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useComplaints, useUpdates } from "../../hooks/useCrimeResources";

const baseLinks = [
  { label: "Beranda", to: "/" },
  { label: "Peta Risiko", to: "/map" },
];

const roleLinks = {
  government: [
    { label: "Dashboard", to: "/gov/dashboard" },
    { label: "Uploads", to: "/gov/uploads" },
    { label: "Aduan", to: "/gov/complaints" },
  ],
  citizen: [{ label: "Lapor 24/7", to: "/citizen/report" }],
  admin: [{ label: "Approval", to: "/admin/approvals" }],
};

export const TopNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: updates } = useUpdates();
  const { data: complaints } = useComplaints();
  const todayCount =
    user?.role === "government"
      ? (complaints ?? []).filter(
          (complaint) => new Date(complaint.createdAt).toDateString() === new Date().toDateString()
        ).length
      : 0;

  const links = [...baseLinks, ...(user ? roleLinks[user.role] || [] : [])];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="rounded-2xl bg-brand-500/15 px-2 py-1 text-xs uppercase tracking-widest text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
            Sabilung
          </span>
          CrimeView
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors dark:text-slate-300",
                location.pathname === link.to
                  ? "bg-slate-900/5 text-brand-600 dark:bg-white/10 dark:text-white"
                  : "hover:bg-slate-900/5 hover:text-brand-600 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <NotificationBell
            updates={updates ?? []}
            role={user?.role}
            extraCount={todayCount}
            title={user?.role === "government" ? "Aduan & Update" : undefined}
          />
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-xs text-slate-500 dark:text-slate-400 md:block">
                {user.role === "government" ? "Pemerintah" : user.role === "citizen" ? "Warga" : "Admin"}
              </span>
              <Button variant="ghost" onClick={() => logout()}>
                Keluar
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Masuk</Button>
          )}
        </div>
      </div>
    </header>
  );
};
