import type {
  Complaint,
  ComplaintInput,
  CrimeRiskRecord,
  DashboardStat,
  MapZone,
  NotificationUpdate,
  RiskCategory,
  TrendPoint,
  UpdatePayload,
  UploadBatch,
} from "../types";
import { supabase } from "../lib/supabaseClient";

type CrimeRiskRow = {
  id: string;
  kecamatan: string;
  kelurahan: string;
  tahun: number;
  jumlah_jenis_aktif: number;
  kategori_risiko: RiskCategory;
  ada_pencurian: number;
  ada_penipuan: number;
  ada_penganiayaan: number;
  ada_pembakaran: number;
  ada_perkosaan: number;
  ada_narkoba: number;
  ada_perjudian: number;
  ada_pembunuhan: number;
  ada_perdagangan_manusia: number;
};

type UploadRow = {
  id: string;
  file_name: string;
  uploaded_at: string;
  row_count: number;
  error_count: number;
  status: UploadBatch["status"];
  notes?: string | null;
};

type ComplaintRow = {
  id: string;
  reporter_name: string;
  reporter_contact?: string | null;
  category: string;
  kecamatan: string;
  kelurahan: string;
  description: string;
  created_at: string;
  status: Complaint["status"];
};

type UpdateRow = {
  id: string;
  title: string;
  message: string;
  audience: "citizen" | "government" | "all";
  created_at: string;
};

const coordinateLookup: Record<string, [number, number]> = {
  Soreang: [-7.0333, 107.5183],
  Cilengkrang: [-6.8679, 107.7046],
  Ciparay: [-7.0388, 107.7155],
  Cisarua: [-6.8175, 107.5922],
  Rancaekek: [-6.9684, 107.7659],
  Banjaran: [-7.0466, 107.5825],
  Dayeuhkolot: [-6.9852, 107.6268],
  Pangalengan: [-7.1669, 107.5713],
};

const riskWeight: Record<RiskCategory, number> = {
  AMAN: 0,
  RENDAH: 1,
  SEDANG: 2,
  TINGGI: 3,
};

const mapRiskRecord = (row: CrimeRiskRow): CrimeRiskRecord => ({
  id: row.id,
  kecamatan: row.kecamatan,
  kelurahan: row.kelurahan,
  year: row.tahun,
  jumlahJenisAktif: row.jumlah_jenis_aktif,
  kategoriRisiko: row.kategori_risiko,
  adaPencurian: row.ada_pencurian,
  adaPenipuan: row.ada_penipuan,
  adaPenganiayaan: row.ada_penganiayaan,
  adaPembakaran: row.ada_pembakaran,
  adaPerkosaan: row.ada_perkosaan,
  adaNarkoba: row.ada_narkoba,
  adaPerjudian: row.ada_perjudian,
  adaPembunuhan: row.ada_pembunuhan,
  adaPerdaganganManusia: row.ada_perdagangan_manusia,
});

const mapUpload = (row: UploadRow): UploadBatch => ({
  id: row.id,
  fileName: row.file_name,
  uploadedAt: row.uploaded_at,
  status: row.status,
  rowCount: row.row_count,
  errorCount: row.error_count,
  notes: row.notes ?? undefined,
});

const mapComplaint = (row: ComplaintRow): Complaint => ({
  id: row.id,
  reporterName: row.reporter_name,
  reporterContact: row.reporter_contact ?? undefined,
  category: row.category,
  kecamatan: row.kecamatan,
  kelurahan: row.kelurahan,
  description: row.description,
  status: row.status,
  createdAt: row.created_at,
});

const mapUpdateNotice = (row: UpdateRow): NotificationUpdate => ({
  id: row.id,
  title: row.title,
  message: row.message,
  audience: row.audience,
  createdAt: row.created_at,
});

const computeDominantCase = (record: CrimeRiskRecord) => {
  const caseMap: Record<string, number> = {
    Pencurian: record.adaPencurian,
    Penipuan: record.adaPenipuan,
    Penganiayaan: record.adaPenganiayaan,
    Pembakaran: record.adaPembakaran,
    Perkosaan: record.adaPerkosaan,
    Narkoba: record.adaNarkoba,
    Perjudian: record.adaPerjudian,
    Pembunuhan: record.adaPembunuhan,
    "Perdagangan Manusia": record.adaPerdaganganManusia,
  };
  const sorted = Object.entries(caseMap).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
};

export const fetchCrimeRiskRecords = async (): Promise<CrimeRiskRecord[]> => {
  const { data, error } = await supabase.from("crime_risks").select("*").order("kecamatan");
  if (error) {
    throw new Error(error.message || "Gagal memuat data risiko");
  }
  const rows = (data ?? []) as CrimeRiskRow[];
  return rows.map(mapRiskRecord);
};

export const fetchRiskSummary = async (): Promise<DashboardStat[]> => {
  const records = await fetchCrimeRiskRecords();
  const totalJenis = records.reduce((acc, curr) => acc + curr.jumlahJenisAktif, 0);
  const highRisk = records.filter((item) => item.kategoriRisiko === "TINGGI").length;
  const narcoticCases = records.reduce((acc, curr) => acc + curr.adaNarkoba, 0);

  const { count: complaintsCount, error: complaintsError } = await supabase
    .from("citizen_complaints")
    .select("*", { count: "exact", head: true });

  if (complaintsError) {
    throw new Error(complaintsError.message || "Gagal menghitung aduan");
  }

  return [
    {
      label: "Total Indikator Aktif",
      value: totalJenis.toLocaleString("id-ID"),
      trend: 8.4,
      helperText: "Naik dibanding triwulan lalu",
    },
    {
      label: "Zona Risiko Tinggi",
      value: `${highRisk} kec.`,
      trend: 4.1,
      helperText: "Prioritas patroli",
    },
    {
      label: "Laporan Warga 24/7",
      value: (complaintsCount ?? 0).toString(),
      trend: 12.6,
      helperText: "Masuk 30 hari terakhir",
    },
    {
      label: "Kasus Narkoba",
      value: narcoticCases.toString(),
      trend: -3.8,
      helperText: "Berbasis laporan aktif",
    },
  ];
};

export const fetchRiskTrend = async (): Promise<TrendPoint[]> => {
  const { data, error } = await supabase.from("crime_risks").select("tahun, jumlah_jenis_aktif");
  if (error) {
    throw new Error(error.message || "Gagal memuat tren risiko");
  }
  if (!data || data.length === 0) {
    return [];
  }
  const rows = data as Array<Pick<CrimeRiskRow, "tahun" | "jumlah_jenis_aktif">>;
  const grouped = rows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.tahun);
    acc[key] = (acc[key] ?? 0) + row.jumlah_jenis_aktif;
    return acc;
  }, {});
  return Object.entries(grouped)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([label, value]) => ({ label, value }));
};

export const fetchMapZones = async (): Promise<MapZone[]> => {
  const records = await fetchCrimeRiskRecords();
  const grouped = records.reduce<Record<string, CrimeRiskRecord[]>>((acc, curr) => {
    acc[curr.kecamatan] = acc[curr.kecamatan] ? [...acc[curr.kecamatan], curr] : [curr];
    return acc;
  }, {});

  return Object.values(grouped).map((zoneRecords) => {
    const totalWeight =
      zoneRecords.reduce((acc, record) => acc + riskWeight[record.kategoriRisiko], 0) / zoneRecords.length;
    const kategoriRisiko = (Object.keys(riskWeight) as RiskCategory[]).reduce((closest, current) => {
      const diff = Math.abs(riskWeight[current] - totalWeight);
      const prevDiff = Math.abs(riskWeight[closest] - totalWeight);
      return diff < prevDiff ? current : closest;
    }, "SEDANG" as RiskCategory);

    const totalCases = zoneRecords.reduce((acc, curr) => acc + curr.jumlahJenisAktif, 0);
    const dominantCase = computeDominantCase(
      zoneRecords.slice().sort((a, b) => b.jumlahJenisAktif - a.jumlahJenisAktif)[0]
    );
    const kec = zoneRecords[0].kecamatan;

    return {
      kecamatan: kec,
      kelurahanCount: zoneRecords.length,
      kategoriRisiko,
      dominantCase,
      trend: Number(((totalCases % 9) - 3).toFixed(1)),
      coordinates: coordinateLookup[kec] ?? [-6.95, 107.6],
    };
  });
};

export const fetchUploads = async (): Promise<UploadBatch[]> => {
  const { data, error } = await supabase.from("data_uploads").select("*").order("uploaded_at", {
    ascending: false,
  });
  if (error) {
    throw new Error(error.message || "Gagal memuat unggahan");
  }
  const rows = (data ?? []) as UploadRow[];
  return rows.map(mapUpload);
};

export const fetchComplaints = async (): Promise<Complaint[]> => {
  const { data, error } = await supabase.from("citizen_complaints").select("*").order("created_at", {
    ascending: false,
  });
  if (error) {
    throw new Error(error.message || "Gagal memuat aduan");
  }
  const rows = (data ?? []) as ComplaintRow[];
  return rows.map(mapComplaint);
};

export const submitComplaint = async (payload: ComplaintInput): Promise<Complaint> => {
  const { data, error } = await supabase
    .from("citizen_complaints")
    .insert({
      reporter_name: payload.reporterName,
      reporter_contact: payload.reporterContact ?? null,
      category: payload.category,
      kecamatan: payload.kecamatan,
      kelurahan: payload.kelurahan,
      description: payload.description,
      status: "NEW",
    })
    .select("*")
    .single();

  const inserted = data as ComplaintRow | null;
  if (error || !inserted) {
    throw new Error(error?.message || "Gagal mengirim aduan");
  }
  return mapComplaint(inserted);
};

export const registerUploadBatch = async (
  fileName: string,
  rowCount: number,
  errorCount: number,
  notes?: string
) => {
  const { data, error } = await supabase
    .from("data_uploads")
    .insert({
      file_name: fileName,
      row_count: rowCount,
      error_count: errorCount,
      status: "PENDING_REVIEW",
      notes: notes ?? null,
    })
    .select("*")
    .single();

  const inserted = data as UploadRow | null;
  if (error || !inserted) {
    throw new Error(error?.message || "Gagal menyimpan upload");
  }
  return mapUpload(inserted);
};

export const updateUploadStatus = async (id: string, status: UploadBatch["status"], notes?: string) => {
  const { data, error } = await supabase
    .from("data_uploads")
    .update({
      status,
      notes: notes ?? null,
    })
    .eq("id", id)
    .select("*")
    .single();

  const updated = data as UploadRow | null;
  if (error || !updated) {
    throw new Error(error?.message || "Gagal memperbarui status upload");
  }
  return mapUpload(updated);
};

export const fetchUpdates = async (): Promise<NotificationUpdate[]> => {
  const { data, error } = await supabase.from("updates").select("*").order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message || "Gagal memuat update");
  }
  const rows = (data ?? []) as UpdateRow[];
  return rows.map(mapUpdateNotice);
};

export const createUpdateNotice = async (payload: UpdatePayload): Promise<NotificationUpdate> => {
  const { data, error } = await supabase
    .from("updates")
    .insert({
      title: payload.title,
      message: payload.message,
      audience: payload.audience,
    })
    .select("*")
    .single();

  const inserted = data as UpdateRow | null;
  if (error || !inserted) {
    throw new Error(error?.message || "Gagal membuat update");
  }
  return mapUpdateNotice(inserted);
};

export const updateComplaintStatus = async (id: string, status: Complaint["status"]) => {
  const { data, error } = await supabase
    .from("citizen_complaints")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  const updated = data as ComplaintRow | null;
  if (error || !updated) {
    throw new Error(error?.message || "Gagal memperbarui aduan");
  }
  return mapComplaint(updated);
};
