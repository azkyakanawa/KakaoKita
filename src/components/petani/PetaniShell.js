'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import LandingImage from '@/components/landing/LandingImage';
import { AIGrid, AIUser, AIClipboard, AILogout, AIChevronDown, AICheck, AIPod } from '@/components/admin/AdminIcons';
import '@/app/admin/admin.css';
import '@/app/petani/petani.css';

export default function PetaniShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);

  async function keluar() {
    await supabase.auth.signOut();
    router.replace('/masuk');
  }

  return (
    <div className="ad-root pt-root">
      <header className="pt-top">
        <div className="pt-top-inner">
          <Link href="/" className="pt-brand" aria-label="KakaoKita, ke beranda situs">
            <span className="pt-brand-logo"><LandingImage file="logo.png" alt="" fallback={<AIPod />} /></span>
            <span className="pt-brand-name">Kakao<span>Kita</span></span>
          </Link>

          <Link href="/petani" className="pt-home" aria-current={pathname === '/petani' ? 'page' : undefined}>
            <AIGrid /><span>Beranda</span>
          </Link>

          <div className="pt-user" ref={box}>
            <button type="button" className="pt-user-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="Menu akun">
              <span className="pt-avatar"><AIUser /></span>
              <AIChevronDown className={`ad-chevron${open ? ' up' : ''}`} />
            </button>

            {open && (
              <div className="pt-pop" role="menu">
                <div className="pt-pop-head">
                  <span className="pt-avatar big"><AIUser /></span>
                  <div>
                    <strong>{profile?.nama || 'Petani'}</strong>
                    <span className="ad-role"><AICheck />Petani</span>
                  </div>
                </div>
                <div className="pt-pop-links">
                  <Link href="/petani/profil" role="menuitem"><AIUser /><span>Profil Saya</span></Link>
                  <Link href="/petani/panen" role="menuitem"><AIClipboard /><span>Riwayat Panen</span></Link>
                </div>
                <button type="button" className="pt-logout" onClick={keluar}><AILogout /><span>Keluar dari Akun</span></button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="pt-main">{children}</main>
    </div>
  );
}
