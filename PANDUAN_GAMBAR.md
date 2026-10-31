# Panduan menambah gambar landing page KakaoKita

Semua gambar diletakkan di satu folder:

    public/images/landing/

Cukup simpan file dengan **nama persis** seperti tabel di bawah, lalu muat ulang halaman
(`npm run dev`). Tidak perlu mengubah kode. Gambar yang belum ada tidak merusak tampilan:
- mode dev: muncul kotak putus-putus berisi nama file yang harus kamu isi,
- gambar hiasan (daun): tidak tampil sampai file ditambahkan,
- ikon (koin, tunas, bumi, logo): tampil ikon cadangan sampai file ditambahkan.

## Daftar file

| Nama file | Dipakai untuk | Ukuran saran | Catatan |
|---|---|---|---|
| `logo.png` | Logo di navbar (bulat oranye) | 300x300 | PNG transparan |
| `hero-bg.jpg` | Latar pemandangan kebun di bagian atas | 2000x900 | JPG. Sisi kiri otomatis diputihkan agar teks terbaca |
| `hero-kakao.png` | Buah dan biji kakao di kanan atas (desktop) | 1400x800 | PNG transparan, rata kanan |
| `hero-kakao-mobile.png` | Buah kakao + karung (tampilan ponsel) | 900x700 | PNG transparan |
| `tentang-kakao.jpg` | Foto buah kakao di bagian "Apa itu Kakao?" | 800x900 | Desktop tampil persegi panjang, ponsel tampil lingkaran. Taruh objek di tengah |
| `ikon-koin.png` | Ikon koin di kartu "Simulasi Keuntungan" | 200x200 | PNG transparan |
| `simulasi-grafik.png` | Koin + panah naik di kanan kartu Simulasi | 500x350 | PNG transparan |
| `ikon-ekonomi.png` | Ikon "Nilai Ekonomi Tinggi" | 200x200 | PNG transparan |
| `ikon-ekosistem.png` | Ikon "Mendukung Ekosistem" | 200x200 | PNG transparan |
| `ikon-strategis.png` | Ikon "Komoditas Strategis" | 200x200 | PNG transparan |
| `kontak-headset.png` | Headset di kartu Kontak (desktop) | 400x400 | PNG transparan |
| `kontak-cs.png` | Ilustrasi petugas + laptop (ponsel) | 700x800 | PNG transparan |
| `daun-kiri-atas.png` | Daun hiasan kiri atas hero | 400x600 | PNG transparan |
| `daun-kiri-tengah.png` | Daun hiasan kiri tengah hero | 400x600 | PNG transparan |
| `daun-fitur.png` | Daun samar di kartu "Fitur Unggulan" | 400x400 | PNG transparan |
| `daun-tentang.png` | Daun di pojok kiri bawah kartu Tentang | 300x300 | PNG transparan |
| `daun-mengapa.png` | Daun di kartu "Mengapa Kakao Penting?" (ponsel) | 200x300 | PNG transparan |
| `daun-kontak.png` | Daun di pojok kanan atas kartu Kontak | 300x400 | PNG transparan |

Tips: kompres gambar (misalnya squoosh.app) supaya halaman ringan di sinyal lemah.
Nama file huruf kecil semua; ekstensi harus sama persis (`.png` atau `.jpg`).

## Mengganti ekstensi (mis. dari .jpg ke .webp)
Ubah nama file di `src/app/page.js`, contoh: `file="hero-bg.jpg"` menjadi `file="hero-bg.webp"`.

## Mengubah teks dan data
- Kontak (telepon, email, alamat): konstanta `KONTAK` di bagian atas `src/app/page.js`.
- Kartu "Harga Kakao Hari Ini" otomatis memakai harga **lokal, kering** terbaru yang diinput admin
  di menu Harga. Persen naik/turun dihitung dari harga pada tanggal sebelumnya.
  Wajib menjalankan `supabase/landing_harga.sql` sekali di Supabase SQL Editor.
