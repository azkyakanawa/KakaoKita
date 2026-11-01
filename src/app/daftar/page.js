'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';
import LandingImage from '@/components/landing/LandingImage';
import { IconUser, IconPhone, IconMailFill, IconLock, IconEye, IconEyeOff, IconArrow, IconPod, IconSprout } from '@/components/landing/Icons';
import '../masuk/masuk.css'; // gaya dasar dibagi dengan halaman Masuk
import './daftar.css';

export default function DaftarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: '', kontak: '', email: '', password: '' });
  const [lihat, setLihat] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    if (form.password.length < 6) {
      setMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: { data: { nama: form.nama.trim(), kontak: form.kontak.trim() } },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data.session) {
      await supabase.auth.signOut();
      router.replace('/masuk?daftar=1');
    } else {
      router.replace('/masuk?daftar=konfirmasi');
    }
  }

  return (
    <main className="lg-page lg-reg">
      {/* ===== Sisi foto (kiri) ===== */}
      <div className="lg-photo" aria-hidden="true">
        {/* Desktop: daftar-foto.jpg bila ada, jika belum otomatis login-foto.jpg */}
        <LandingImage
          file="daftar-foto.jpg" className="lg-photo-img lg-img-d" decor lazy
          fallback={<LandingImage file="login-foto.jpg" className="lg-photo-img" decor lazy />}
        />
        {/* Ponsel: versi potret login-foto-mobile.jpg (opsional), jika belum ada memakai login-foto.jpg */}
        <LandingImage
          file="login-foto-mobile.jpg" className="lg-photo-img lg-img-m" decor lazy
          fallback={<LandingImage file="login-foto.jpg" className="lg-photo-img" decor lazy />}
        />
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
          <h1 className="lg-title">Daftar</h1>
          <p className="lg-sub">
            Bergabunglah bersama KakaoKita!{' '}<br />untuk masa depan yang lebih baik!
          </p>

          {!configured && <div className="lg-alert info">Supabase belum dikonfigurasi (.env.local kosong).</div>}
          {msg && <div className="lg-alert error" role="alert">{msg}</div>}

          <form onSubmit={submit} className="lg-form">
            <label className="lg-field" htmlFor="nama">
              <IconUser className="lg-ico" />
              <input id="nama" required autoComplete="name" placeholder="Nama Lengkap" value={form.nama} onChange={set('nama')} />
            </label>

            <label className="lg-field" htmlFor="kontak">
              <IconPhone className="lg-ico" />
              <input id="kontak" type="tel" inputMode="tel" autoComplete="tel" placeholder="No. WA / WhatsApp" value={form.kontak} onChange={set('kontak')} />
            </label>

            <label className="lg-field" htmlFor="email">
              <IconMailFill className="lg-ico" />
              <input id="email" type="email" required autoCapitalize="none" autoComplete="email" placeholder="Email" value={form.email} onChange={set('email')} />
            </label>

            <label className="lg-field" htmlFor="password">
              <IconLock className="lg-ico" />
              <input
                id="password" type={lihat ? 'text' : 'password'} required autoComplete="new-password"
                placeholder="Kata Sandi" value={form.password} onChange={set('password')}
              />
              <button
                type="button" className="lg-eye" onClick={() => setLihat((v) => !v)}
                aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={lihat}
              >
                {lihat ? <IconEye /> : <IconEyeOff />}
              </button>
            </label>

            <button type="submit" className="lg-submit" disabled={loading}>
              <span>{loading ? 'Memproses...' : 'Daftar'}</span>
              {!loading && <IconArrow />}
            </button>
          </form>

          <div className="lg-or"><span>Sudah punya akun?</span></div>
          <Link href="/masuk" className="lg-login-link">Masuk</Link>
        </div>
      </section>
    </main>
  );
}
