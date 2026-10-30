import Link from 'next/link';
import InstallButton from '@/components/InstallButton';

export default function Landing() {
  return (
    <>
      <section className="hero">
        <h1>KakaoKita</h1>
        <p>
          Koperasi kakao digital untuk kelompok tani di Lampung. Pantau harga, catat panen, dan
          hitung untung menjual bersama, semuanya dalam satu aplikasi.
        </p>
        <div className="actions">
          <Link href="/masuk" className="btn">Masuk</Link>
          <Link href="/daftar" className="btn secondary">Daftar Petani</Link>
          <InstallButton />
        </div>
      </section>

      <div className="container">
        <section className="section">
          <h2>Masalah yang dijawab</h2>
          <div className="grid cols-3">
            <div className="card"><h3>Harga tidak jelas</h3><p>Petani sulit membandingkan harga dan menentukan waktu jual.</p></div>
            <div className="card"><h3>Catatan manual</h3><p>Data anggota dan hasil panen sering dicatat di buku, rawan salah.</p></div>
            <div className="card"><h3>Jual sendiri-sendiri</h3><p>Posisi tawar lemah. Penjualan bersama perlu dasar hitungan yang jelas.</p></div>
          </div>
        </section>

        <section className="section">
          <h2>Fitur utama</h2>
          <div className="grid cols-2">
            <div className="card">
              <h3>Untuk petani</h3>
              <ul>
                <li>Lihat harga kakao terbaru dan grafik tren</li>
                <li>Lihat riwayat dan total hasil panen sendiri</li>
                <li>Baca pengumuman koperasi</li>
              </ul>
            </div>
            <div className="card">
              <h3>Untuk kepala koperasi</h3>
              <ul>
                <li>Kelola data anggota, harga, dan panen</li>
                <li>Simpan data pembeli dan tarif kirim</li>
                <li><b>Simulasi Jual</b>: hitung harga bersih per kg dan bandingkan dengan harga lokal</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Cara memasang di ponsel</h2>
          <div className="card">
            <p><b>Android (Chrome):</b> tekan tombol &quot;Install Aplikasi&quot; di atas, atau menu titik tiga lalu &quot;Instal aplikasi&quot;.</p>
            <p><b>iPhone (Safari):</b> tekan tombol Bagikan, lalu &quot;Tambah ke Layar Utama&quot;.</p>
            <p className="muted">Tidak perlu toko aplikasi. Setelah terpasang, aplikasi terbuka seperti aplikasi biasa.</p>
          </div>
        </section>
      </div>

      <footer className="footer">
        KakaoKita - LITERA Innovate 2026. Data pada versi prototipe adalah data simulasi.
      </footer>
    </>
  );
}
