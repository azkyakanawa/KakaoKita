'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';

const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);

// Melindungi halaman: hanya pengguna yang sudah login DAN berperan sesuai yang boleh masuk.
// (Keamanan data yang sebenarnya dijaga oleh aturan RLS di database.)
export default function RoleGuard({ role, children }) {
  const router = useRouter();
  const [state, setState] = useState({ status: 'loading', profile: null, message: '' });

  useEffect(() => {
    let active = true;

    async function check() {
      if (!configured) {
        setState({ status: 'error', profile: null, message: 'Supabase belum dikonfigurasi. Isi file .env.local.' });
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        router.replace('/masuk');
        return;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sess.session.user.id)
        .single();
      if (!active) return;
      if (error || !profile) {
        setState({ status: 'error', profile: null, message: 'Profil tidak ditemukan. Coba keluar lalu masuk kembali.' });
        return;
      }
      if (!profile.is_active) {
        setState({ status: 'inactive', profile, message: '' });
        return;
      }
      if (profile.role !== role) {
        router.replace(profile.role === 'admin' ? '/admin' : '/petani');
        return;
      }
      setState({ status: 'ok', profile, message: '' });
    }

    check();
    return () => {
      active = false;
    };
  }, [role, router]);

  async function keluar() {
    await supabase.auth.signOut();
    router.replace('/masuk');
  }

  if (state.status === 'loading') {
    return <div className="container center muted">Memuat...</div>;
  }
  if (state.status === 'error') {
    return (
      <div className="container narrow">
        <div className="alert">{state.message}</div>
        <button className="btn secondary" onClick={keluar}>Keluar</button>
      </div>
    );
  }
  if (state.status === 'inactive') {
    return (
      <div className="container narrow">
        <div className="alert info">Akun kamu belum aktif atau telah dinonaktifkan. Hubungi kepala koperasi.</div>
        <button className="btn secondary" onClick={keluar}>Keluar</button>
      </div>
    );
  }
  if (state.status !== 'ok') return null;

  return <ProfileContext.Provider value={state.profile}>{children}</ProfileContext.Provider>;
}
