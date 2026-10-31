'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';

export default function MasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="container narrow">
      <h1>Masuk</h1>
      {!configured && <div className="alert info">Supabase belum dikonfigurasi (.env.local kosong).</div>}
      {info && <div className="alert success">{info}</div>}
      <form className="card" onSubmit={submit}>
        {msg && <div className="alert">{msg}</div>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" required autoCapitalize="none" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Kata sandi</label>
          <input id="password" className="input" type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="center">Belum punya akun? <Link href="/daftar">Daftar sebagai petani</Link></p>
      <p className="center"><Link href="/">Kembali ke beranda</Link></p>
    </div>
  );
}