# Sabilung CrimeView

CrimeView adalah dashboard monitoring risiko kriminal Kabupaten Bandung berbasis React + Vite + TypeScript. Aplikasi ini menampilkan peta risiko publik interaktif (Leaflet), kanal aduan warga 24/7, upload batch CSV/Excel dengan validasi otomatis, serta panel admin untuk approval data.

## Teknologi

- Vite + React 19 + TypeScript
- React Router v7 dengan protected route berbasis peran
- Context API untuk state autentikasi (mock user disimpan di `localStorage`)
- @tanstack/react-query untuk komunikasi async dengan mock API yang mensimulasikan koneksi basis data
- Tailwind CSS + dua mode tema (light/dark) ala reactbits.dev + animasi anime.js
- React Leaflet + GeoJSON untuk visualisasi kategori risiko pada peta Kabupaten Bandung

## Struktur folder

```
src/
  api/           # Mock API & store yang mudah dipindah ke Supabase
  components/    # Komponen UI (map, chart, cards, nav, theme toggle)
  context/       # AuthContext + ThemeContext
  hooks/         # React Query hooks
  layouts/       # Public & dashboard layout
  pages/         # Halaman publik / pemerintah / warga / admin
  routes/        # Deklarasi route + protected route
  types/         # TypeScript interface & enum
  utils/         # Parser upload CSV/Excel
```

## Menjalankan proyek

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:5173`.

### Build production

```bash
npm run build
npm run preview
```

## Kredensial mock

- Pemerintah: `pemda@bandungkab.go.id` / `admin123`
- Warga: `warga@example.com` / `warga123`
- Admin: `admin@jaga-lembur.id` / `approve123`

## Fitur penting

- Hero landing page beranimasi anime.js, menampilkan heatmap risiko Leaflet + CTA.
- Mode terang/gelap via tombol toggle (Context API) + scrollbar tersembunyi.
- Panel pemerintah:
  - Dashboard analytics (`/gov/dashboard`)
  - Upload riil CSV/Excel (`/gov/uploads`) dengan parser `xlsx`, resume baris/error, link download template `public/templates/jaga-crime-template.xlsx`.
  - Inbox aduan warga (`/gov/complaints`) dengan editor status dan notifikasi lonceng.
  - Form broadcast update untuk warga (ditampilkan di lonceng).
- Panel warga (`/citizen/report`) + halaman registrasi mandiri (`/register`) dan pembaca notifikasi.
- Panel admin (`/admin/approvals`) untuk menyetujui/menolak file unggahan serta menambah akses akun.
- Sistem notifikasi lintas peran (bell) terhubung Supabase.
- Backend Supabase siap pakai (`docs/SUPABASE_SETUP.md`).

## Integrasi database

Instruksi detail menghubungkan project ke Supabase tersedia di [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

### Memuat ulang data risiko

Gunakan CSV hasil data mining (`data_processed/kab_bandung_kelurahan_risk_2021.csv`) untuk mengisi tabel `crime_risks`:

```bash
node scripts/seedCrimeData.mjs
```

Script tersebut akan menghapus isi tabel lalu mengimpor semua baris secara otomatis memakai kredensial bawaan.
