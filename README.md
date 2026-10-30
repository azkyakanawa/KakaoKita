# KakaoKita

Platform koperasi kakao digital (PWA) untuk kelompok tani di Lampung.
Dibuat untuk LITERA Innovate 2026, subtema *Inovasi Digital untuk Produktivitas dan Pelayanan Publik*.

Dua peran:
- **Super Admin (kepala koperasi):** kelola anggota, harga, panen, data pembeli dan tarif kirim, Simulasi Jual, pengumuman.
- **Petani:** lihat harga dan grafik tren, riwayat panen sendiri, pengumuman.

Teknologi: Next.js 14 (App Router, JavaScript), React 18, Supabase (PostgreSQL + Auth + RLS).

## Prasyarat
- Node.js versi 18.17 atau lebih baru (cek: `node -v`)
- Akun Supabase gratis (https://supabase.com)

## Langkah menjalankan

1. **Pasang dependensi**
   ```
   npm install
   ```

2. **Buat proyek Supabase**, lalu buka *SQL Editor* dan jalankan isi file `supabase/schema.sql`.
   (Opsional untuk demo) jalankan juga `supabase/seed_demo.sql` untuk data contoh bertanda *Simulasi*.

3. **Matikan konfirmasi email** agar pendaftaran langsung bisa dipakai saat demo:
   Authentication, Sign In / Providers, Email, matikan opsi *Confirm email*.

4. **Isi kunci proyek.** Salin `.env.local.example` menjadi `.env.local`, lalu isi
   URL dan *anon public key* dari Supabase (Project Settings, API).
   Jangan pernah memakai *service_role key* di aplikasi ini.

5. **Jalankan**
   ```
   npm run dev
   ```
   Buka http://localhost:3000

6. **Buat akun.** Daftar dua akun lewat halaman *Daftar* (satu untuk admin, satu untuk petani).
   Semua akun baru otomatis berperan *petani*.

7. **Jadikan salah satu akun sebagai admin.** Di Supabase SQL Editor jalankan
   (ganti emailnya):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'email-admin@contoh.com');
   ```
   Keluar lalu masuk lagi. Akun tersebut kini masuk ke halaman admin.

## Menguji PWA (install)
Service worker hanya aktif pada versi production, dan install butuh HTTPS atau localhost:
```
npm run build
npm start
```
Buka http://localhost:3000 di Chrome. Tombol *Install Aplikasi* muncul di halaman awal.
Periksa di Chrome DevTools, tab *Application*, bagian *Manifest* dan *Service Workers*.

## Deploy ke Vercel (agar juri bisa membuka link)
1. Unggah proyek ke GitHub (file `.env.local` otomatis tidak ikut karena ada di `.gitignore`).
2. Di Vercel: *Add New Project*, pilih repositori tersebut.
3. Pada *Environment Variables*, isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. HTTPS otomatis, jadi PWA bisa di-install dari link Vercel.
5. Di Supabase, Authentication, URL Configuration, tambahkan alamat Vercel sebagai Site URL.

## Struktur folder
```
src/app/            halaman (beranda, masuk, daftar, admin/*, petani)
src/components/     RoleGuard, AppShell, InstallButton, PriceChart, PwaRegister
src/lib/            supabase.js, format.js, simulasi.js (rumus Simulasi Jual)
public/             manifest.webmanifest, sw.js, offline.html, icons/
supabase/           schema.sql, seed_demo.sql
```

## Keamanan
- Hak akses sebenarnya dijaga oleh *Row Level Security* di database (lihat `schema.sql`),
  bukan hanya oleh tampilan. Petani hanya dapat membaca panen miliknya dan tidak dapat
  membaca data pembeli atau tarif kirim.
- Peran admin tidak bisa diambil lewat pendaftaran; hanya lewat SQL oleh pengelola.

## Status fitur (untuk bagian progres proposal)
Sudah ada: landing page + tombol install, login dan pendaftaran, pengalihan berdasarkan peran,
data anggota (aktif/nonaktif), harga + grafik, catatan panen, data pembeli dan tarif kirim,
Simulasi Jual, pengumuman, manifest + service worker + halaman offline.

Belum ada (rencana lanjutan): penjualan kolektif dan bagi hasil otomatis, notifikasi,
data harga/ongkir otomatis, ketertelusuran batch, mode offline penuh.
Jangan mengklaim fitur yang belum ada di video demo atau presentasi.

## Daftar pustaka perangkat lunak (untuk Dokumen Teknis)
Periksa ulang lisensi di situs resmi masing-masing sebelum dikumpulkan.
| Komponen | Fungsi | Lisensi (verifikasi) |
|---|---|---|
| Next.js | Kerangka web | MIT |
| React / React DOM | Antarmuka | MIT |
| @supabase/supabase-js | Klien database dan login | MIT |
| Supabase (layanan) | Database, Auth | Layanan; lihat ketentuan Supabase |
Grafik harga dibuat sendiri dengan SVG (tanpa pustaka tambahan).

## Masalah umum
- *Halaman putih / "Supabase belum dikonfigurasi"*: `.env.local` belum diisi, atau server belum direstart setelah mengisinya.
- *Tidak bisa masuk setelah daftar*: konfirmasi email masih aktif (langkah 3), atau email belum dikonfirmasi.
- *Tombol Install tidak muncul*: pakai versi production (`npm run build && npm start`) dan HTTPS; Safari iPhone memakai Bagikan, lalu Tambah ke Layar Utama.
- *Admin tidak bisa menambah data*: peran belum diubah menjadi admin (langkah 7), atau belum keluar-masuk setelahnya.
