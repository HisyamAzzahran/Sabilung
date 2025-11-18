import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://axugejhyqjwwjygxsdgp.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWdlamh5cWp3d2p5Z3hzZGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDI3MTQsImV4cCI6MjA3OTAxODcxNH0.-rounS_L5EbHxTmQfqRDs3aaeC0ygcU2Yj0FMj2JIIM";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? FALLBACK_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const csvPath = new URL("../../data_processed/kab_bandung_kelurahan_risk_2021.csv", import.meta.url);
const csv = readFileSync(csvPath, "utf-8");
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

const mapped = records.map((row) => {
  const normalize = (value) => (value === "" || value === undefined ? 0 : Number(value));
  const tahun = Number(row.tahun) || 2021;
  return {
    id: randomUUID(),
    kecamatan: String(row.bps_nama_kecamatan || "").trim(),
    kelurahan: String(row.bps_nama_desa_kelurahan || "").trim(),
    tahun,
    jumlah_jenis_aktif: normalize(row.jumlah_jenis_aktif),
    kategori_risiko: row.kategori_risiko || "SEDANG",
    ada_pencurian: normalize(row.ada_pencurian),
    ada_penipuan: normalize(row.ada_penipuan),
    ada_penganiayaan: normalize(row.ada_penganiayaan),
    ada_pembakaran: normalize(row.ada_pembakaran),
    ada_perkosaan: normalize(row.ada_perkosaan),
    ada_narkoba: normalize(row.ada_pengedar_penyalahgunaan_narkoba),
    ada_perjudian: normalize(row.ada_perjudian),
    ada_pembunuhan: normalize(row.ada_pembunuhan),
    ada_perdagangan_manusia: normalize(row.ada_perdagangan_manusia),
  };
});

console.log(`Preparing to upsert ${mapped.length} rows...`);

const deleteRes = await supabase.from("crime_risks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
if (deleteRes.error) {
  console.error("Failed to wipe table", deleteRes.error);
  process.exit(1);
}

const chunkSize = 500;
for (let i = 0; i < mapped.length; i += chunkSize) {
  const chunk = mapped.slice(i, i + chunkSize);
  const { error } = await supabase.from("crime_risks").upsert(chunk, { onConflict: "id" });
  if (error) {
    console.error("Insert error", error);
    process.exit(1);
  }
  console.log(`Inserted ${i + chunk.length}/${mapped.length}`);
}

console.log("Completed seeding crime_risks from CSV");
