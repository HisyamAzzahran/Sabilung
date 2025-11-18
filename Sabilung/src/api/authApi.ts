import type { DirectoryUser, NewUserPayload, RegistrationPayload, User, UserRole } from "../types";
import { supabase } from "../lib/supabaseClient";

interface AppUserRow {
  email: string;
  name: string;
  role: UserRole;
  password_hash?: string | null;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const authenticateUser = async (email: string, password: string): Promise<User> => {
  const normalized = normalizeEmail(email);
  const { error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error) {
    throw new Error(error.message || "Email atau password tidak valid.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("app_users")
    .select("email, role")
    .eq("email", normalized)
    .maybeSingle<AppUserRow>();

  await supabase.auth.signOut();

  if (profileError) {
    throw new Error(profileError.message || "Profil tidak ditemukan");
  }
  if (!profile) {
    throw new Error("Profil tidak ditemukan");
  }

  return { email: profile.email, role: profile.role };
};

export const fetchDirectoryUsers = async (): Promise<DirectoryUser[]> => {
  const { data, error } = await supabase.from("app_users").select("email, name, role");
  if (error) {
    throw new Error(error.message || "Gagal memuat direktori akun");
  }
  return (data ?? []).map((row) => ({
    email: row.email,
    role: row.role,
    name: row.name,
  }));
};

const insertUser = async ({ email, name, role, password }: { email: string; name: string; role: UserRole; password: string }) => {
  const { data, error } = await supabase
    .from("app_users")
    .insert({ email: normalizeEmail(email), name, role, password_hash: password })
    .select("email, role")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Gagal menyimpan data pengguna");
  }
  return { email: data.email, role: data.role as UserRole };
};

export const registerCitizen = async (payload: RegistrationPayload) => {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/confirm-email` : undefined;
  const { error } = await supabase.auth.signUp({
    email: normalizeEmail(payload.email),
    password: payload.password,
    options: {
      data: { name: payload.name, role: "citizen" },
      emailRedirectTo: redirectTo,
    },
  });
  if (error) {
    throw new Error(error.message || "Gagal melakukan registrasi");
  }
  return insertUser({ ...payload, role: "citizen" });
};

export const createUserAccess = async (payload: NewUserPayload) => {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/confirm-email` : undefined;
  const { error } = await supabase.auth.signUp({
    email: normalizeEmail(payload.email),
    password: payload.password,
    options: {
      data: { name: payload.name, role: payload.role },
      emailRedirectTo: redirectTo,
    },
  });
  if (error) {
    throw new Error(error.message || "Gagal menambahkan akses baru");
  }
  return insertUser(payload);
};
