import Link from 'next/link';
import './landing.css';
import LandingNavbar from '@/components/landing/LandingNavbar';
import InstallBanner from '@/components/landing/InstallBanner';
import LandingImage from '@/components/landing/LandingImage';
import HargaCard from '@/components/landing/HargaCard';
import {
  IconBars, IconPlay, IconArrow, IconUsers, IconMailFill, IconPhone, IconPin,
  IconCoins, IconSprout, IconGlobe, IconMail, IconLeaf,
} from '@/components/landing/Icons';

// ====== ISI YANG BISA DIUBAH DENGAN MUDAH ======
const KONTAK = {
  telepon: '+62895403830065',
  email: 'kakaokita@gmail.com',
  alamat: 'Jl. Pembangunan, Harapan Jaya, Kec. Sukarame, Kota Bandar Lampung, Lampung 35131',
};
// ===============================================

export default function Landing() {
  return (
    <div className="lp-page">
      {/* ================= HERO ================= */}
      <section className="lp-hero">
        <div className="lp-hero-bg" aria-hidden="true">
          <LandingImage file="hero-bg.jpg" className="lp-fill lp-hero-img" decor />
        </div>
        <LandingImage file="daun-kiri-atas.png" className="lp-deco lp-deco-a" decor />
        <LandingImage file="daun-kiri-tengah.png" className="lp-deco lp-deco-b" decor />

        <LandingNavbar />

        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <h1 className="lp-h1">
              Kakao<span>Kita</span>
            </h1>
            <p className="lp-tagline">
              Solusi Cerdas untuk <span>Petani Kakao</span>
            </p>
            <p className="lp-lead">
              Dapatkan informasi harga kakao terkini, fitur jual kolektif, dan estimasi keuntungan dengan mudah dan
              transparan.
            </p>
            <div className="lp-hero-actions">
              <Link href="/masuk" className="lp-btn dark"><IconBars /><span>Lihat Harga Kakao</span><IconArrow /></Link>
              <a href="#tentang" className="lp-btn outline"><IconPlay /><span>Pelajari Lebih Lanjut</span></a>
            </div>
          </div>

          <div className="lp-hero-pods lp-only-desktop" aria-hidden="true">
            <LandingImage file="hero-kakao.png" className="lp-contain" decor />
          </div>
          <div className="lp-hero-pods lp-only-mobile" aria-hidden="true">
            <LandingImage file="hero-kakao-mobile.png" className="lp-contain" decor />
          </div>
        </div>
      </section>

      {/* ================= KARTU RINGKAS ================= */}
      <section className="lp-stats" aria-label="Ringkasan">
        <HargaCard />

        <article className="lp-card lp-stat lp-stat-fitur" id="fitur">
          <LandingImage file="daun-fitur.png" className="lp-stat-leaf" decor />
          <span className="lp-circle"><IconUsers /></span>
          <div className="lp-stat-body">
            <h3>Fitur Unggulan</h3>
            <p className="lp-stat-sub">Untuk Petani &amp; Admin</p>
            <Link href="/daftar" className="lp-btn mini outline"><span>Lihat Fitur</span><IconArrow /></Link>
          </div>
        </article>

        <article className="lp-card lp-stat lp-stat-simulasi">
          <span className="lp-circle coin">
            <LandingImage file="ikon-koin.png" className="lp-contain" fallback={<IconCoins />} />
          </span>
          <div className="lp-stat-body">
            <h3>Simulasi Keuntungan</h3>
            <p className="lp-stat-sub">Hitung potensi hasil jual kolektif Anda!</p>
            <Link href="/masuk" className="lp-btn mini outline"><span>Coba Sekarang</span><IconArrow /></Link>
          </div>
          <LandingImage file="simulasi-grafik.png" className="lp-stat-art" decor />
        </article>
      </section>

      {/* ================= TENTANG / MENGAPA / KONTAK ================= */}
      <section className="lp-info">
        <article className="lp-card lp-about" id="tentang">
          <LandingImage file="daun-tentang.png" className="lp-about-leaf" decor />
          <div className="lp-about-copy">
            <span className="lp-tag">Tentang Kakao</span>
            <h2 className="lp-h2">Apa itu <span>Kakao</span>?</h2>
            <p>
              Kakao adalah tanaman perkebunan yang menghasilkan biji cokelat berkualitas tinggi. Di Indonesia, kakao
              menjadi salah satu komoditas unggulan yang memiliki nilai ekonomi besar dan berperan penting bagi
              kesejahteraan petani.
            </p>
            <a href="#mengapa" className="lp-btn dark"><span>Pelajari Lebih Lanjut</span><IconArrow /></a>
          </div>
          <div className="lp-about-photo">
            <LandingImage file="tentang-kakao.jpg" alt="Buah kakao di pohon" className="lp-fill" />
          </div>
        </article>

        <article className="lp-card lp-why" id="mengapa">
          <h2 className="lp-why-title">
            <IconSprout className="lp-why-sprout" />
            <span>Mengapa Kakao Penting?</span>
          </h2>
          <ul className="lp-why-list">
            <li>
              <span className="lp-why-icon">
                <LandingImage file="ikon-ekonomi.png" className="lp-contain" fallback={<IconCoins />} />
              </span>
              <div><h3>Nilai Ekonomi Tinggi</h3><p>Memberikan penghasilan yang stabil bagi petani.</p></div>
            </li>
            <li>
              <span className="lp-why-icon">
                <LandingImage file="ikon-ekosistem.png" className="lp-contain" fallback={<IconSprout />} />
              </span>
              <div><h3>Mendukung Ekosistem</h3><p>Menjaga kelestarian lingkungan.</p></div>
            </li>
            <li>
              <span className="lp-why-icon">
                <LandingImage file="ikon-strategis.png" className="lp-contain" fallback={<IconGlobe />} />
              </span>
              <div><h3>Komoditas Strategis</h3><p>Menjadi komoditas penting bagi Indonesia.</p></div>
            </li>
          </ul>
          <LandingImage file="daun-mengapa.png" className="lp-why-leaf" decor />
        </article>

        <article className="lp-contact" id="kontak">
          <LandingImage file="daun-kontak.png" className="lp-contact-leaf" decor />

          {/* Tampilan desktop */}
          <div className="lp-contact-desk">
            <div className="lp-contact-head"><IconMail /><h2>Kontak Kami</h2></div>
            <div className="lp-contact-body">
              <p>Kami siap membantu Anda. Hubungi kami melalui:</p>
              <ul>
                <li><IconPhone /><a href={`tel:${KONTAK.telepon}`}>{KONTAK.telepon}</a></li>
                <li><IconMailFill /><a href={`mailto:${KONTAK.email}`}>{KONTAK.email}</a></li>
                <li><IconPin /><span>{KONTAK.alamat}</span></li>
              </ul>
              <LandingImage file="kontak-headset.png" className="lp-contact-art" decor />
            </div>
          </div>

          {/* Tampilan ponsel */}
          <div className="lp-contact-mob">
            <div className="lp-contact-mob-copy">
              <span className="lp-tag">Kontak Kami</span>
              <h2 className="lp-h2">Hubungi <span>Kami</span></h2>
              <p>Kami siap membantu Anda. Hubungi kami melalui:</p>
              <ul>
                <li><IconPhone /><a href={`tel:${KONTAK.telepon}`}>{KONTAK.telepon}</a></li>
                <li><IconMailFill /><a href={`mailto:${KONTAK.email}`}>{KONTAK.email}</a></li>
                <li><IconPin /><span>{KONTAK.alamat}</span></li>
              </ul>
            </div>
            <div className="lp-contact-mob-art">
              <span className="lp-bubble">Kami siap melayani Anda!</span>
              <LandingImage file="kontak-cs.png" className="lp-contain" />
            </div>
          </div>
        </article>
      </section>

      {/* ================= KAKI HALAMAN ================= */}
      <footer className="lp-footer">
        <svg className="lp-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 80V46C180 6 330 6 520 30s330 46 560 24 250-38 360-14v40z" fill="#8A5330" />
          <path d="M0 80V62c200-30 380-26 560-8s360 20 520 0 250-18 360-4v30z" fill="#5A2E15" />
        </svg>
        <div className="lp-footer-fill" />
      </footer>

      <InstallBanner />
    </div>
  );
}
