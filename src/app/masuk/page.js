'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';
import LandingImage from '@/components/landing/LandingImage';
import { IconMailFill, IconLock, IconEye, IconEyeOff, IconArrow, IconPod, IconSprout } from '@/components/landing/Icons';
import './masuk.css';

export default function MasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lihat, setLihat] = useState(false);
  const [msg, setMsg] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Pesan sukses setelah daftar (dikirim lewat alamat /masuk?daftar=1)
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('daftar');
    if (d === '1') setInfo('Pendaftaran berhasil. Silakan masuk dengan email dan kata sandi tadi.');
    if (d === 'konfirmasi') setInfo('Pendaftaran berhasil. Cek email untuk konfirmasi, lalu masuk di sini.');
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setInfo('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      const m = (error.message || '').toLowerCase();
      if (m.includes('invalid login credentials')) {
        setMsg('Email atau kata sandi salah. Pastikan akun didaftarkan di proyek Supabase yang sama dengan aplikasi ini.');
      } else if (m.includes('email not confirmed')) {
        setMsg('Email belum dikonfirmasi. Konfirmasi lewat email, atau matikan "Confirm email" di pengaturan Supabase.');
      } else {
        setMsg('Gagal masuk: ' + error.message);
      }
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single();
    setLoading(false);
    if (!profile) {
      setMsg('Profil tidak ditemukan. Hubungi kepala koperasi.');
      return;
    }
    router.replace(profile.role === 'admin' ? '/admin' : '/petani');
  }

  return (
    <main className="lg-page">
      {/* ===== Sisi foto (kiri) ===== */}
      <div className="lg-photo" aria-hidden="true">
        <LandingImage file="login-foto.jpg" className="lg-photo-img" decor />
      </div>
      <div className="lg-shade" aria-hidden="true" />

      <Link href="/" className="lg-logo" aria-label="KakaoKita, kembali ke beranda">
        <span className="lg-logo-img">
          <LandingImage file="logo.png" alt="" fallback={<IconPod className="lg-logo-fallback" />} />
        </span>
        <span className="lg-logo-text">
          <strong>Kakao<span>Kita</span></strong>
          <small>Bersama Petani, Menuju Sejahtera</small>
        </span>
      </Link>

      <div className="lg-tagline">
        <IconSprout className="lg-tagline-icon" />
        <p>Dukung Petani Kakao,</p>
        <p className="gold">Bangun Masa Depan Bersama KakaoKita</p>
        <svg viewBox="0 0 320 30" className="lg-tagline-line" aria-hidden="true" preserveAspectRatio="none">
          <path d="M2 24C70 6 180 2 318 20" fill="none" stroke="#f2c94c" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
      <LandingImage file="login-daun-kiri.png" className="lg-leaf lg-leaf-bl" decor />

      {/* ===== Panel form (kanan) dengan tepi meliuk ===== */}
      <section className="lg-panel">
        {/* Tepi bergelombang antara foto dan panel. Ubah path ini bila ingin liukan berbeda. */}
        <svg className="lg-edge" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M100 0H46C18 110 82 215 55 335C28 455 96 545 60 665C30 775 76 885 34 1000H100Z" fill="#fcf5ea" />
        </svg>

        <LandingImage file="login-daun-kanan-atas.png" className="lg-leaf lg-leaf-tr" decor />
        <LandingImage file="login-daun-kanan-bawah.png" className="lg-leaf lg-leaf-br" decor />
        <svg className="lg-hills" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120V70C140 30 260 20 420 52S690 86 800 40V120Z" fill="#dfe6b8" />
          <path d="M0 120V92C160 62 300 58 460 82S700 104 800 78V120Z" fill="#b5c76f" />
        </svg>

        <div className="lg-content">
          <h1 className="lg-title">Masuk</h1>
          <p className="lg-sub">
            Selamat datang kembali di KakaoKita!{' '}<br />Silakan masuk untuk melanjutkan.
          </p>

          {!configured && <div className="lg-alert info">Supabase belum dikonfigurasi (.env.local kosong).</div>}
          {info && <div className="lg-alert success" role="status">{info}</div>}
          {msg && <div className="lg-alert error" role="alert">{msg}</div>}

          <form onSubmit={submit} className="lg-form" noValidate={false}>
            <label className="lg-field" htmlFor="email">
              <IconMailFill className="lg-ico" />
              <input
                id="email" type="email" required autoCapitalize="none" autoComplete="email"
                placeholder="Email Anda" value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="lg-field" htmlFor="password">
              <IconLock className="lg-ico" />
              <input
                id="password" type={lihat ? 'text' : 'password'} required autoComplete="current-password"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" className="lg-eye" onClick={() => setLihat((v) => !v)}
                aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={lihat}
              >
                {lihat ? <IconEye /> : <IconEyeOff />}
              </button>
            </label>

            <button type="submit" className="lg-submit" disabled={loading}>
              <span>{loading ? 'Memproses...' : 'Masuk'}</span>
              {!loading && <IconArrow />}
            </button>
          </form>

          <div className="lg-or"><span>Belum punya akun?</span></div>
          <Link href="/daftar" className="lg-daftar">Daftar Sekarang</Link>

          <Link href="/" className="lg-back"><IconArrow className="flip" /><span>Kembali ke Beranda</span></Link>
        </div>
      </section>
    </main>
  );
}
