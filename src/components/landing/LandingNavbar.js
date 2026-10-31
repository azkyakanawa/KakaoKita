'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, configured } from '@/lib/supabase';
import LandingImage from './LandingImage';
import { IconHome, IconLeaf, IconGrid, IconMail, IconUser, IconPod } from './Icons';

export default function LandingNavbar() {
  // Tombol "Dashboard" mengarah ke dashboard sesuai peran jika sudah login, jika belum ke halaman masuk.
  const [dash, setDash] = useState('/masuk');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session || !alive) return;
      const { data: p } = await supabase.from('profiles').select('role').eq('id', s.session.user.id).single();
      if (!alive) return;
      setLoggedIn(true);
      setDash(p?.role === 'admin' ? '/admin' : '/petani');
    })();
    return () => { alive = false; };
  }, []);

  return (
    <header className="lp-nav" id="beranda">
      <Link href="/" className="lp-brand" aria-label="KakaoKita, beranda">
        <span className="lp-brand-logo">
          <LandingImage
            file="logo.png"
            alt=""
            fallback={<IconPod className="lp-brand-fallback" />}
          />
        </span>
        <span className="lp-brand-text">
          <strong>KakaoKita</strong>
          <small>Bersama Petani, Menuju Sejahtera</small>
        </span>
      </Link>

      <nav className="lp-menu" aria-label="Menu utama">
        <Link href={dash} className="lp-menu-item active">
          <IconHome /><span>Dash&shy;board</span>
        </Link>
        <a href="#tentang" className="lp-menu-item"><IconLeaf /><span>Tentang Kakao</span></a>
        <a href="#fitur" className="lp-menu-item"><IconGrid /><span>Fitur</span></a>
        <a href="#kontak" className="lp-menu-item"><IconMail /><span>Kontak Kami</span></a>
      </nav>

      <div className="lp-auth">
        {loggedIn ? (
          <Link href={dash} className="lp-pill light"><IconUser /><span>Akun Saya</span></Link>
        ) : (
          <>
            <Link href="/masuk" className="lp-pill light"><IconUser /><span>Masuk</span></Link>
            <Link href="/daftar" className="lp-pill dark"><span>Daftar</span></Link>
          </>
        )}
      </div>
    </header>
  );
}
