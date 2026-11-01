// Mengecek gambar landing/masuk/daftar yang sudah dan belum ada di public/images/landing.
// Jalankan: npm run cek-gambar
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'images', 'landing');

// [nama file, keterangan, wajib?, ukuran saran]
const DAFTAR = [
  ['logo.png', 'Logo (navbar, masuk, daftar, dashboard)', true, '300x300 PNG transparan'],
  ['hero-bg.jpg', 'Latar kebun di bagian atas landing', true, '2000x900 JPG'],
  ['hero-kakao.png', 'Buah kakao tambahan di hero (boleh dilewati, hero-bg sudah memuat buah)', false, '1400x800 PNG transparan'],
  ['hero-kakao-mobile.png', 'Buah kakao + karung di ponsel (boleh dilewati)', false, '900x700 PNG transparan'],
  ['tentang-kakao.jpg', 'Foto "Apa itu Kakao?"', true, '800x900 JPG'],
  ['login-foto.jpg', 'Foto petani untuk halaman Masuk dan Daftar', true, '1600x1600 JPG'],
  ['daftar-foto.jpg', 'Foto khusus halaman Daftar (boleh dilewati)', false, '1600x1600 JPG'],
  ['kontak-cs.png', 'Ilustrasi petugas (kartu Kontak di ponsel)', false, '700x800 PNG transparan'],
  ['kontak-headset.png', 'Headset (kartu Kontak di desktop)', false, '400x400 PNG transparan'],
  ['ikon-koin.png', 'Ikon koin (kartu Simulasi)', false, '200x200 PNG transparan'],
  ['simulasi-grafik.png', 'Koin + panah naik (kartu Simulasi)', false, '500x350 PNG transparan'],
  ['ikon-ekonomi.png', 'Ikon Nilai Ekonomi Tinggi', false, '200x200 PNG transparan'],
  ['ikon-ekosistem.png', 'Ikon Mendukung Ekosistem', false, '200x200 PNG transparan'],
  ['ikon-strategis.png', 'Ikon Komoditas Strategis', false, '200x200 PNG transparan'],
  ['daun-kiri-atas.png', 'Daun hiasan hero kiri atas', false, '400x600 PNG transparan'],
  ['daun-kiri-tengah.png', 'Daun hiasan hero kiri tengah', false, '400x600 PNG transparan'],
  ['daun-fitur.png', 'Daun samar di kartu Fitur', false, '400x400 PNG transparan'],
  ['daun-tentang.png', 'Daun di kartu Tentang', false, '300x300 PNG transparan'],
  ['daun-mengapa.png', 'Daun di kartu Mengapa Kakao Penting', false, '200x300 PNG transparan'],
  ['daun-kontak.png', 'Daun di kartu Kontak', false, '300x400 PNG transparan'],
  ['login-daun-kiri.png', 'Daun kiri bawah (Masuk/Daftar)', false, '600x500 PNG transparan'],
  ['login-daun-kanan-atas.png', 'Daun kanan atas (Masuk/Daftar)', false, '500x500 PNG transparan'],
  ['login-daun-kanan-bawah.png', 'Daun kanan bawah (Masuk/Daftar)', false, '400x400 PNG transparan'],
];

let ada = 0, wajibKurang = 0, opsiKurang = 0;
const kb = (f) => Math.round(fs.statSync(path.join(DIR, f)).size / 1024);

console.log('\nCek gambar KakaoKita (folder public/images/landing)\n');
for (const [f, ket, wajib, ukuran] of DAFTAR) {
  const p = path.join(DIR, f);
  if (fs.existsSync(p)) {
    ada++;
    const ukur = kb(f);
    const berat = ukur > 700 ? '  <-- besar, kompres dulu (squoosh.app)' : '';
    console.log(`  [ADA]    ${f}  (${ukur} KB)${berat}`);
  } else if (wajib) {
    wajibKurang++;
    console.log(`  [WAJIB]  ${f}  <- ${ket} (${ukuran})`);
  } else {
    opsiKurang++;
    console.log(`  [opsi]   ${f}  <- ${ket} (${ukuran})`);
  }
}

// peringatan untuk file yang namanya tidak dikenal (biasanya salah ketik)
const dikenal = new Set(DAFTAR.map((d) => d[0]));
const asing = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => !dikenal.has(f) && !f.startsWith('.')) : [];
if (asing.length) {
  console.log('\nFile yang namanya tidak dikenali aplikasi (cek ejaan / huruf besar-kecil):');
  asing.forEach((f) => console.log('  ?', f));
}

console.log(`\nRingkasan: ${ada} ada, ${wajibKurang} wajib belum ada, ${opsiKurang} opsional belum ada.`);
console.log(wajibKurang === 0 ? 'Semua gambar wajib sudah lengkap.\n' : 'Lengkapi gambar WAJIB dulu, sisanya boleh menyusul.\n');
