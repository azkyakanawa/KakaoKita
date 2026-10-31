'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import LandingImage from '@/components/landing/LandingImage';
import {
  AIGrid, AIUsers, AITrend, AILeaf, AIHandshake, AICalc, AIMegaphone, AIUser, AIMail, AIIdCard,
  AIShield, AIGear, AILock, AILogout, AIChevronDown, AIChevronRight, AICheck, AIPod,
} from './AdminIcons';
import '@/app/admin/admin.css';

const MENU = [
  { href: '/admin', label: 'Ringkasan', Icon: AIGrid },
  { href: '/admin/anggota', label: 'Anggota', Icon: AIUsers },
  { href: '/admin/harga', label: 'Harga', Icon: AITrend },
  { href: '/admin/panen', label: 'Panen', Icon: AILeaf },
  { href: '/admin/pembeli', label: 'Pembeli & Tarif', Icon: AIHandshake },
  { href: '/admin/simulasi', label: 'Simulasi Jual', Icon: AICalc },
  { href: '/admin/pengumuman', label: 'Pengumuman', Icon: AIMegaphone },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const box = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email || ''));
  }, []);

  // tutup menu profil saat klik di luar, tekan Esc, atau pindah halaman
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

  const aktif = (href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  const idAdmin = profile?.id ? `ADM-${profile.id.replace(/-/g, '').slice(0, 4).toUpperCase()}` : '-';

  return (
    <div className="ad-root">
      <header className="ad-top">
        <svg className="ad-top-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60V28C220 -4 420 -6 640 18s420 34 800 -4V60Z" fill="#fdf5ea" />
        </svg>
        <div className="ad-top-inner">
          <Link href="/" className="ad-brand" aria-label="KakaoKita, ke beranda">
            <span className="ad-brand-logo">
              <LandingImage file="logo.png" alt="" fallback={<AIPod />} />
            </span>
            <span className="ad-brand-name">Kakao<span>Kita</span></span>
          </Link>

          <nav className="ad-menu" aria-label="Menu admin">
            {MENU.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={`ad-menu-item${aktif(href) ? ' active' : ''}`} aria-current={aktif(href) ? 'page' : undefined}>
                <Icon /><span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="ad-user" ref={box}>
            <button
              type="button" className="ad-user-btn" onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu" aria-expanded={open} aria-label="Menu akun"
            >
              <span className="ad-avatar"><AIUser /></span>
              <AIChevronDown className={`ad-chevron${open ? ' up' : ''}`} />
            </button>

            {open && (
              <div className="ad-pop" role="menu">
                <div className="ad-pop-head">
                  <span className="ad-avatar big"><AIUser /></span>
                  <div>
                    <strong>{profile?.nama || 'Admin'}</strong>
                    <span className="ad-role"><AICheck />Administrator</span>
                  </div>
                </div>
                <dl className="ad-pop-info">
                  <div><AIUser /><dt>Nama</dt><dd>{profile?.nama || '-'}</dd></div>
                  <div><AIMail /><dt>Email</dt><dd>{email || '-'}</dd></div>
                  <div><AIIdCard /><dt>ID Admin</dt><dd>{idAdmin}</dd></div>
                  <div><AIShield /><dt>Jabatan</dt><dd>Kepala Koperasi</dd></div>
                </dl>
                <div className="ad-pop-links">
                  <Link href="/admin/profil" role="menuitem"><AIGear /><span>Pengaturan Profil</span><AIChevronRight /></Link>
                  <Link href="/admin/profil#password" role="menuitem"><AILock /><span>Ubah Password</span><AIChevronRight /></Link>
                </div>
                <button type="button" className="ad-logout" onClick={keluar}><AILogout /><span>Keluar dari Akun</span></button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="ad-main">{children}</main>
    </div>
  );
}
