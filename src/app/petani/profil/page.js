'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import { tgl } from '@/lib/format';

export default function ProfilSaya() {
  const profile = useProfile();
  const [email, setEmail] = useState('');
  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [msg, setMsg] = useState({ tipe: '', teks: '' });
  const [ganti, setGanti] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email || ''));
  }, []);

  async function gantiPassword(e) {
    e.preventDefault();
    setMsg({ tipe: '', teks: '' });
    if (baru.length < 6) { setMsg({ tipe: 'error', teks: 'Password minimal 6 karakter.' }); return; }
    if (baru !== ulang) { setMsg({ tipe: 'error', teks: 'Password baru dan konfirmasinya tidak sama.' }); return; }
    setGanti(true);
    const { error } = await supabase.auth.updateUser({ password: baru });
    setGanti(false);
    if (error) { setMsg({ tipe: 'error', teks: error.message }); return; }
    setBaru(''); setUlang('');
    setMsg({ tipe: 'success', teks: 'Password berhasil diubah.' });
  }

  const baris = [
    ['Nama', `${profile.sapaan ? `${profile.sapaan} ` : ''}${profile.nama}`],
    ['Email', email || '-'],
    ['No. WhatsApp', profile.kontak || '-'],
    ['Alamat', profile.alamat || '-'],
    ['Terdaftar', tgl(profile.created_at)],
  ];

  return (
    <>
      <h1>Profil Saya</h1>
      <div className="card">
        <h3>Data diri</h3>
        <dl className="pt-profil">
          {baris.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
        <p className="muted">Untuk mengubah data diri, hubungi admin koperasi.</p>
      </div>

      <form className="card" onSubmit={gantiPassword} id="password">
        <h3>Ubah password</h3>
        {msg.teks && <div className={`alert ${msg.tipe === 'success' ? 'success' : ''}`}>{msg.teks}</div>}
        <div className="row">
          <div className="field"><label htmlFor="pw1">Password baru</label>
            <input id="pw1" className="input" type="password" autoComplete="new-password" value={baru} onChange={(e) => setBaru(e.target.value)} required /></div>
          <div className="field"><label htmlFor="pw2">Ulangi password baru</label>
            <input id="pw2" className="input" type="password" autoComplete="new-password" value={ulang} onChange={(e) => setUlang(e.target.value)} required /></div>
        </div>
        <button className="btn" disabled={ganti}>{ganti ? 'Menyimpan...' : 'Ubah password'}</button>
      </form>
    </>
  );
}
