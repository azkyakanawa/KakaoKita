# Panduan lengkap: membuat dan memasang foto KakaoKita

Semua foto disimpan di satu folder: `public/images/landing/`
Nama file harus PERSIS sama (huruf kecil semua, ekstensi `.jpg` atau `.png` sesuai tabel).
Jalankan `npm run cek-gambar` kapan saja untuk melihat file mana yang sudah ada dan belum.

## 1. Urutan kerja (disarankan)

Kerjakan 6 gambar WAJIB dulu. Daun, ikon 3D, dan ilustrasi lain boleh menyusul
karena aplikasi sudah punya ikon cadangan dan tidak error bila filenya belum ada.

| Prioritas | File | Dipakai di |
|---|---|---|
| WAJIB | `logo.png` | semua halaman |
| WAJIB | `hero-bg.jpg` | landing, latar atas |
| WAJIB | `hero-kakao.png` | landing, buah kakao (desktop) |
| WAJIB | `hero-kakao-mobile.png` | landing, buah kakao + karung (ponsel) |
| WAJIB | `tentang-kakao.jpg` | landing, "Apa itu Kakao?" |
| WAJIB | `login-foto.jpg` | halaman Masuk dan Daftar |
| Opsional | `daftar-foto.jpg` | foto beda khusus Daftar |
| Opsional | `kontak-cs.png`, `kontak-headset.png` | kartu Kontak |
| Opsional | `ikon-koin.png`, `simulasi-grafik.png` | kartu Simulasi |
| Opsional | `ikon-ekonomi.png`, `ikon-ekosistem.png`, `ikon-strategis.png` | kartu "Mengapa Kakao Penting?" |
| Opsional | `daun-*.png`, `login-daun-*.png` (9 file) | hiasan daun |

Foto lahan petani TIDAK dimasukkan di folder ini. Admin mengunggahnya lewat
Admin > Anggota > pilih petani > Tambah lahan.

## 2. Dari mana mendapatkan fotonya

**Pilihan A: buat dengan AI (cepat, mirip mockup)**
Mockup Anda tampaknya dibuat dengan generator gambar AI. Gunakan alat yang sama
(Gemini, ChatGPT, dll.) dengan prompt di bagian 4. Untuk PNG transparan, buat gambar
dengan latar polos lalu hapus latarnya (bagian 3).

**Pilihan B: foto nyata (paling meyakinkan untuk juri dan petani)**
- Foto sendiri di kebun kakao anggota (dengan izin mereka). Ambil horizontal, cahaya pagi,
  objek di tengah. Paling cocok untuk `login-foto.jpg`, `tentang-kakao.jpg`, `hero-bg.jpg`.
- Foto stok gratis yang boleh dipakai komersial: unsplash.com dan pexels.com
  (cari "cocoa pods", "cacao farmer", "cocoa plantation"). Cek lisensi di halaman fotonya.

**Jangan** mengambil gambar acak dari hasil pencarian Google. Hak ciptanya bisa bermasalah.

## 3. Mengolah gambar (gratis, tanpa instal)

1. **Hapus latar (untuk PNG transparan):** buka remove.bg atau canva.com (fitur Background Remover),
   unggah gambar, unduh sebagai PNG.
2. **Ubah ukuran:** buka squoosh.app, unggah gambar, atur Resize sesuai ukuran di tabel,
   lalu pilih format (MozJPEG untuk `.jpg`, OxiPNG untuk `.png`).
3. **Target berat:** foto besar (`.jpg`) di bawah 500 KB, PNG kecil di bawah 150 KB.
   Gambar yang terlalu berat membuat halaman lambat di sinyal desa.
4. **Ganti nama** file sesuai tabel (periksa huruf kecil dan ekstensi).

## 4. Prompt AI siap pakai

Tempel ke generator gambar. Tambahkan "no text, no watermark" bila hasilnya bertulisan.

**logo.png** (lalu hapus latar)
> Flat vector logo icon: an orange-golden cacao pod with a dark brown center line and two small green leaves on top, inside a soft orange circle. Clean, simple, centered, plain white background, no text.

**hero-bg.jpg**
> Wide landscape photo of a lush cocoa plantation in Indonesia on a bright misty morning, rolling green hills in the background, soft warm sunlight, shallow depth of field, calm and hopeful mood, empty space on the left side, 16:9, no people, no text.

**hero-kakao.png** (lalu hapus latar)
> Realistic product photo of three ripe cacao pods (orange, yellow and red) with one pod cut open showing cocoa beans and white pulp, a few cocoa beans and two fresh green leaves, plain white background, soft studio light, sharp detail, horizontal composition, no text.

**hero-kakao-mobile.png** (lalu hapus latar)
> Realistic photo of two ripe cacao pods, one opened to show beans, next to a burlap sack full of dried cocoa beans, a few green leaves, plain white background, soft light, horizontal composition, no text.

**tentang-kakao.jpg**
> Realistic close-up photo of a cluster of ripe orange, yellow and red cacao pods hanging on a tree trunk, green leaves, blurred green background, golden morning light, vertical portrait composition 8:9, no text.

**login-foto.jpg**
> Realistic photo of a smiling Indonesian cocoa farmer wearing a woven bamboo hat and work gloves, reaching up to pick a ripe cacao pod from a tree, lush green plantation in the background, warm natural sunlight, friendly and proud mood. Subject in the left half of the frame, square 1:1 composition, no text.

**kontak-cs.png** (lalu hapus latar)
> Friendly flat illustration of a young Indonesian woman customer service agent with a headset, brown apron with a small cacao logo, smiling and typing on a laptop, soft colors, plain white background, no text.

**kontak-headset.png** (lalu hapus latar)
> Realistic dark brown headset with microphone and a few small green leaves beside it, plain white background, soft shadow, no text.

**ikon-koin.png**, **ikon-ekonomi.png** (lalu hapus latar)
> 3D glossy icon of a stack of golden coins, soft shadow, cute and clean style, plain white background, no text.

**ikon-ekosistem.png** (lalu hapus latar)
> 3D glossy icon of a small green sprout with two leaves growing from brown soil, cute and clean style, plain white background, no text.

**ikon-strategis.png** (lalu hapus latar)
> 3D glossy icon of a teal globe with simple continents and thin latitude lines, cute and clean style, plain white background, no text.

**simulasi-grafik.png** (lalu hapus latar)
> 3D glossy icon of golden coin stacks of increasing height with a green upward arrow rising above them, plain white background, no text.

**Daun hiasan** (`daun-*.png`, `login-daun-*.png`; lalu hapus latar)
> Realistic fresh green tropical leaves on a thin branch, bright and glossy, soft light, plain white background, no text. (Buat 3 versi: cabang menghadap kiri, menghadap kanan, dan kelompok daun kecil.)

Kemiripan dengan mockup tidak perlu persis. Yang penting suasana hangat, hijau, dan cokelat.

## 5. Memasang ke aplikasi

1. Letakkan semua file yang sudah dirapikan di `public/images/landing/` (di dalam folder proyek).
2. Buka terminal di folder proyek, jalankan: `npm run cek-gambar`
   - Baris `[WAJIB]` berarti file wajib belum ada atau salah nama.
   - Baris `<-- besar` berarti file perlu dikompres lagi.
   - Bagian "nama tidak dikenali" berarti ada salah ketik.
3. Jalankan `npm run dev`, lalu buka dan periksa tiga halaman ini
   (tekan Ctrl+Shift+R setiap kali mengganti gambar):
   - http://localhost:3000 (landing)
   - http://localhost:3000/masuk
   - http://localhost:3000/daftar
4. Cek juga tampilan ponsel: tekan F12, klik ikon ponsel, pilih ukuran 390 px.
5. Atur posisi foto bila wajah atau objek terpotong:
   - `login-foto.jpg`: ubah `object-position` pada `.lg-photo-img` di `src/app/masuk/masuk.css`
     (mis. `30% center`).
   - `hero-bg.jpg`: ubah `.lp-fill` di `src/app/landing.css` (tambahkan `object-position`).
6. Kirim ke GitHub:
   - `git add .`
   - `git commit -m "feat: tambah foto landing, masuk, dan daftar"`
   - `git push`
7. Tunggu Vercel selesai (status Ready di tab Deployments), lalu buka situs live
   dan periksa ulang tiga halaman tadi.

## 6. Masalah umum

- **Gambar tidak muncul:** nama file tidak sama persis (huruf besar, spasi, atau `.jpeg` vs `.jpg`).
  Jalankan `npm run cek-gambar`.
- **Gambar lama masih tampil:** tekan Ctrl+Shift+R. Di HP, tutup lalu buka lagi aplikasinya.
- **Bagian PNG berlatar putih:** latar belum dihapus. Ulangi langkah remove.bg.
- **Di Vercel gambar tidak ada tapi di komputer ada:** file belum ikut di-commit.
  Cek dengan `git status`, lalu `git add .` dan commit ulang.

## Catatan tambahan
- `hero-kakao.png` dan `hero-kakao-mobile.png` sekarang OPSIONAL karena `hero-bg.jpg` sudah memuat buah kakao.
- `login-foto-mobile.jpg` (opsional): versi potret foto petani khusus ponsel (mis. 1000x2000).
  Jika tidak ada, ponsel memakai `login-foto.jpg`. Foto potret dengan petani agak kecil di bagian bawah
  akan paling mirip mockup ponsel.
