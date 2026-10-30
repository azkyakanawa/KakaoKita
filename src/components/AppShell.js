'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';

export default function AppShell({ links, subtitle, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();

  async function keluar() {
    await supabase.auth.signOut();
    router.replace('/masuk');
  }

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">KakaoKita</Link>
        <span className="who">
          {profile?.nama} ({subtitle})
        </span>
        <button className="btn small secondary" style={{ color: '#fff', borderColor: '#fff' }} onClick={keluar}>
          Keluar
        </button>
      </header>
      <nav className="nav">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </nav>
      <main className="container">{children}</main>
    </>
  );
}
