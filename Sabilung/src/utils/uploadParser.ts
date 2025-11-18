import * as XLSX from "xlsx";

const requiredColumns = [
  "kecamatan",
  "kelurahan",
  "tahun",
  "jumlah_jenis_aktif",
  "kategori_risiko",
];

export interface UploadStats {
  rowCount: number;
  errorCount: number;
  warnings: string[];
}

const parseCsv = (text: string) => {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());
  return lines
    .map((line) => {
      if (!line.trim()) return null;
      const values = line.split(",");
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index]?.trim() ?? "";
        return acc;
      }, {});
    })
    .filter(Boolean) as Record<string, string>[];
};

export const analyzeUploadFile = async (file: File): Promise<UploadStats> => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  let rows: Record<string, unknown>[] = [];

  if (extension === "csv") {
    const text = await file.text();
    rows = parseCsv(text);
  } else {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const firstSheet = sheetName ? workbook.Sheets[sheetName] : undefined;
    if (!firstSheet) {
      return { rowCount: 0, errorCount: 0, warnings: ["Sheet tidak ditemukan pada file."] };
    }
    rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" }) as Record<string, unknown>[];
  }

  const rowCount = rows.length;
  let errorCount = 0;
  rows.forEach((row) => {
    const normalized = Object.keys(row).reduce<Record<string, unknown>>((acc, key) => {
      acc[key.toLowerCase()] = row[key];
      return acc;
    }, {});
    const missing = requiredColumns.some((column) => !normalized[column]);
    if (missing) {
      errorCount += 1;
    }
  });

  const warnings: string[] = [];
  if (errorCount > 0) {
    warnings.push(`${errorCount} baris perlu dicek ulang karena kolom wajib kosong.`);
  }
  if (rowCount === 0) {
    warnings.push("Data kosong, pastikan template diisi dengan benar.");
  }

  return { rowCount, errorCount, warnings };
};
