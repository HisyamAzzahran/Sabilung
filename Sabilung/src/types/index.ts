export type RiskCategory = "AMAN" | "RENDAH" | "SEDANG" | "TINGGI";

export interface CrimeRiskRecord {
  id: string;
  kecamatan: string;
  kelurahan: string;
  year: number;
  jumlahJenisAktif: number;
  kategoriRisiko: RiskCategory;
  adaPencurian: number;
  adaPenipuan: number;
  adaPenganiayaan: number;
  adaPembakaran: number;
  adaPerkosaan: number;
  adaNarkoba: number;
  adaPerjudian: number;
  adaPembunuhan: number;
  adaPerdaganganManusia: number;
}

export interface Complaint {
  id: string;
  reporterName: string;
  reporterContact?: string;
  category: string;
  kecamatan: string;
  kelurahan: string;
  description: string;
  createdAt: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
}

export interface UploadBatch {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  rowCount: number;
  errorCount: number;
  notes?: string;
}

export interface User {
  email: string;
  role: "government" | "citizen" | "admin";
}

export type UserRole = User["role"];

export interface DirectoryUser extends User {
  name: string;
}

export interface RegistrationPayload {
  email: string;
  name: string;
  password: string;
}

export interface NewUserPayload extends RegistrationPayload {
  role: UserRole;
}

export interface ComplaintInput {
  reporterName: string;
  reporterContact?: string;
  category: string;
  kecamatan: string;
  kelurahan: string;
  description: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  trend: number;
  helperText: string;
}

export interface MapZone {
  kecamatan: string;
  kelurahanCount: number;
  kategoriRisiko: RiskCategory;
  dominantCase: string;
  trend: number;
  coordinates: [number, number];
}

export interface TrendPoint {
  label: string;
  value: number;
}

export type UpdateAudience = "citizen" | "government" | "all";

export interface NotificationUpdate {
  id: string;
  title: string;
  message: string;
  audience: UpdateAudience;
  createdAt: string;
}

export interface UpdatePayload {
  title: string;
  message: string;
  audience: UpdateAudience;
}
