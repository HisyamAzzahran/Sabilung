# Menghubungkan Sabilung CrimeView ke Supabase

Ikuti langkah berikut untuk memindahkan mock API ke database Supabase gratis.

## 1. Buat proyek Supabase
1. Masuk ke [supabase.com](https://supabase.com) dan buat proyek baru (free tier).
2. Pilih region Asia Tenggara (Singapore) agar latency rendah.
3. Simpan password database yang diberikan.

## 2. Definisikan tabel
Buat tabel berikut via Table Editor.

### `crime_risks`
- `id uuid` (primary key, default `uuid_generate_v4()`)
- `kecamatan text`, `kelurahan text`, `tahun int4`, `jumlah_jenis_aktif int4`, `kategori_risiko text`
- Kolom indikator (`ada_pencurian` sampai `ada_perdagangan_manusia`) bertipe `int4`

### `citizen_complaints`
- `id uuid` PK, default `uuid_generate_v4()`
- `reporter_name text`, `reporter_contact text`, `category text`, `kecamatan text`, `kelurahan text`, `description text`
- `status text` default `NEW`, `created_at timestamptz` default `now()`

### `data_uploads`
- `id uuid` PK, `file_name text`, `uploaded_at timestamptz` default `now()`
- `row_count int4`, `error_count int4`, `status text` default `PENDING_REVIEW`, `notes text`

### `app_users`
- `email text` PK, `name text`, `role text` (`government/citizen/admin`), `password_hash text`
(Atau gunakan Supabase Auth bila ingin login bawaan.)

### `updates`
- `id uuid` PK default `uuid_generate_v4()`
- `title text`, `message text`, `audience text` (`citizen/government/all`)
- `created_at timestamptz` default `now()`

Seed data contoh memakai menu SQL Editor agar UI langsung menampilkan konten.

## 3. Install dependensi & env
```
npm install @supabase/supabase-js
```
Buat `.env`:
```
VITE_SUPABASE_URL=... // URL project
VITE_SUPABASE_ANON_KEY=... // anon/public key
```

## 4. Klien Supabase
`src/lib/supabaseClient.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
```

## 5. Modifikasi kode
- **`src/api/crimeApi.ts`** → ganti setiap fungsi fetch/mutate (`fetchCrimeRiskRecords`, `fetchMapZones`, `fetchUploads`, `submitComplaint`, `registerUploadBatch`, `updateUploadStatus`) agar memakai `supabase.from(...).select/insert/update`. Gunakan view atau RPC untuk agregasi jika dibutuhkan.
- **`src/api/authApi.ts`** → baca pengguna dari tabel `app_users`; validasi password bisa memakai bcrypt hash atau Supabase Auth Session.
- **`src/context/AuthContext.tsx`** → setelah login sukses, simpan token Supabase (jika menggunakan Supabase Auth) atau minimal identitas user dari tabel baru.
- **`src/hooks/useCrimeResources.ts`** → tidak berubah banyak; cukup pastikan query key memanggil API baru.

## 6. Policy keamanan
Aktifkan Row Level Security lalu buat policy sederhana:
- `citizen_complaints`: siapa pun boleh insert.
- `data_uploads`: hanya user role `government` boleh insert, role `admin` boleh update status.
- `crime_risks`: read-only untuk publik.

## 7. Testing
1. Jalankan `npm run dev`, login menggunakan data dari `app_users`.
2. Kirim laporan warga dan cek tabel `citizen_complaints`.
3. Upload file, lalu setujui dari halaman admin → status pada `data_uploads` harus berubah.

Setelah semua langkah di atas, aplikasi siap memakai database Supabase sungguhan tanpa perlu mock data.
