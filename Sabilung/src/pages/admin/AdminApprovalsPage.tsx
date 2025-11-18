import { useState } from "react";
import type { FormEvent } from "react";
import { useDirectoryUsers, useUploadModeration, useUploads, useAdminCreateUser } from "../../hooks/useCrimeResources";
import { Button } from "../../components/common/Button";
import type { UserRole } from "../../types";

export const AdminApprovalsPage = () => {
  const { data: uploads } = useUploads();
  const { data: users } = useDirectoryUsers();
  const { mutateAsync, isPending } = useUploadModeration();
  const { mutateAsync: addUser, isPending: isAdding } = useAdminCreateUser();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<{ name: string; email: string; password: string; role: UserRole }>({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });

  const pendingUploads = uploads?.filter((upload) => upload.status === "PENDING_REVIEW") ?? [];

  const handleDecision = async (id: string, status: "APPROVED" | "REJECTED") => {
    await mutateAsync({ id, status, notes: notes[id] });
    setFeedback(`Upload ${id} ${status === "APPROVED" ? "disetujui" : "ditolak"}.`);
  };

  const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addUser(userForm);
    setUserMessage("Akses baru berhasil ditambahkan.");
    setUserForm({ name: "", email: "", password: "", role: "citizen" });
  };

  return (
    <div className="space-y-10">
      <section className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Approval Administrator</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Validasi Upload Pemerintah</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Review setiap batch sebelum data digunakan untuk pemodelan risiko.</p>
          </div>
        </div>
        {feedback && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">{feedback}</p>}
        <div className="mt-6 space-y-4">
          {pendingUploads.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-300">Belum ada upload yang menunggu persetujuan.</p>}
          {pendingUploads.map((upload) => (
            <div key={upload.id} className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{upload.fileName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(upload.uploadedAt).toLocaleString("id-ID")}</p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300">
                  <p>{upload.rowCount.toLocaleString("id-ID")} baris</p>
                  <p>{upload.errorCount} error potensial</p>
                </div>
              </div>
              <textarea
                placeholder="Catatan keputusan (opsional)"
                className="mt-3 w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                rows={2}
                value={notes[upload.id] ?? ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [upload.id]: e.target.value }))}
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => handleDecision(upload.id, "REJECTED")} loading={isPending}>
                  Tolak
                </Button>
                <Button onClick={() => handleDecision(upload.id, "APPROVED")} loading={isPending}>
                  Setujui
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200/70 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Direktori Akun</p>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Pengguna Terdaftar</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm text-slate-600 dark:text-slate-200">
            <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.email} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Tambah Akses Baru</p>
          <form onSubmit={handleAddUser} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Nama
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                value={userForm.name}
                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                value={userForm.email}
                onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Password Sementara
              <input
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                value={userForm.password}
                onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </label>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Peran
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                value={userForm.role}
                onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
              >
                <option value="citizen">Citizen</option>
                <option value="government">Government</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="md:col-span-2 flex items-center justify-between">
              {userMessage && <p className="text-xs text-emerald-600 dark:text-emerald-300">{userMessage}</p>}
              <Button type="submit" loading={isAdding}>
                Tambah Akses
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
