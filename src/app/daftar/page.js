'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, configured } from '@/lib/supabase';

export default function DaftarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: '', kontak: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setOk('');
    if (form.password.length < 6) {
      setMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nama: form.nama, kontak: form.kontak } },
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data.session) {
      router.replace('/petani');
    } else {
      setOk('Pendaftaran berhasil. Cek email untuk konfirmasi, lalu masuk.');
    }
  }

  return (
    <div className="container narrow">
      <h1>Daftar Petani</h1>
      {!configured && <div className="alert info">Supabase belum dikonfigurasi (.env.local kosong).</div>}
      <form className="card" onSubmit={submit}>
        {msg && <div className="alert">{msg}</div>}
        {ok && <div className="alert success">{ok}</div>}
        <div className="field">
          <label htmlFor="nama">Nama lengkap</label>
          <input id="nama" className="input" required value={form.nama} onChange={set('nama')} />
        </div>
        <div className="field">
          <label htmlFor="kontak">Nomor HP / WhatsApp</label>
          <input id="kontak" className="input" inputMode="tel" value={form.kontak} onChange={set('kontak')} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" required value={form.email} onChange={set('email')} />
        </div>
        <div className="field">
          <label htmlFor="password">Kata sandi</label>
          <input id="password" className="input" type="password" required value={form.password} onChange={set('password')} />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>
      <p className="muted">Akun baru otomatis berperan sebagai petani. Peran kepala koperasi diatur oleh pengelola sistem.</p>
      <p className="center">Sudah punya akun? <Link href="/masuk">Masuk</Link></p>
    </div>
  );
}
