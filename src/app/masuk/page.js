'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';

export default function MasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    // Clean email dari spasi dan ubah ke huruf kecil
    const cleanEmail = email.trim().toLowerCase();

    // 1. Eksekusi Login Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    });

    if (error) {
      console.error('Login error detail:', error.message);
      // Menampilkan pesan asli error Supabase di console browser (F12) untuk debugging
      setMsg('Email atau kata sandi salah.');
      setLoading(false);
      return;
    }

    // 2. Ambil Profil Role User
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setMsg('Profil tidak ditemukan. Hubungi kepala koperasi.');
      return;
    }

    // 3. Routing Berdasarkan Role
    if (profile.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/petani');
    }
  }

  return (
    <div className="container narrow">
      <h1>Masuk</h1>
      {!configured && (
        <div className="alert info">
          Supabase belum dikonfigurasi (.env.local kosong).
        </div>
      )}
      <form className="card" onSubmit={submit}>
        {msg && <div className="alert">{msg}</div>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Kata sandi</label>
          <input
            id="password"
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="center">
        Belum punya akun? <Link href="/daftar">Daftar sebagai petani</Link>
      </p>
      <p className="center">
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </div>
  );
}