'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';

export default function ProfilAdmin() {
  const profile = useProfile();
  const [nama, setNama] = useState(profile?.nama || '');
  const [kontak, setKontak] = useState(profile?.kontak || '');
  const [msgProfil, setMsgProfil] = useState({ tipe: '', teks: '' });
  const [simpan, setSimpan] = useState(false);

  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [msgPw, setMsgPw] = useState({ tipe: '', teks: '' });
  const [ganti, setGanti] = useState(false);

  // buka langsung ke bagian password bila alamatnya /admin/profil#password
  useEffect(() => {
    if (window.location.hash === '#password') {
      document.getElementById('password')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  async function simpanProfil(e) {
    e.preventDefault();
    setMsgProfil({ tipe: '', teks: '' });
    if (!nama.trim()) { setMsgProfil({ tipe: 'error', teks: 'Nama tidak boleh kosong.' }); return; }
    setSimpan(true);
    const { error } = await supabase.from('profiles').update({ nama: nama.trim(), kontak: kontak.trim() || null }).eq('id', profile.id);
    setSimpan(false);
    if (error) { setMsgProfil({ tipe: 'error', teks: error.message }); return; }
    setMsgProfil({ tipe: 'success', teks: 'Profil tersimpan. Memuat ulang...' });
    setTimeout(() => window.location.reload(), 700);
  }

  async function gantiPassword(e) {
    e.preventDefault();
    setMsgPw({ tipe: '', teks: '' });
    if (baru.length < 6) { setMsgPw({ tipe: 'error', teks: 'Password minimal 6 karakter.' }); return; }
    if (baru !== ulang) { setMsgPw({ tipe: 'error', teks: 'Password baru dan konfirmasinya tidak sama.' }); return; }
    setGanti(true);
    const { error } = await supabase.auth.updateUser({ password: baru });
    setGanti(false);
    if (error) { setMsgPw({ tipe: 'error', teks: error.message }); return; }
    setBaru(''); setUlang('');
    setMsgPw({ tipe: 'success', teks: 'Password berhasil diubah.' });
  }

  return (
    <>
      <h1>Pengaturan Profil</h1>

      <form className="card" onSubmit={simpanProfil}>
        <h3>Data diri</h3>
        {msgProfil.teks && <div className={`alert ${msgProfil.tipe === 'success' ? 'success' : ''}`}>{msgProfil.teks}</div>}
        <div className="row">
          <div className="field"><label htmlFor="nama">Nama</label>
            <input id="nama" className="input" value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
          <div className="field"><label htmlFor="kontak">Kontak (WhatsApp)</label>
            <input id="kontak" className="input" value={kontak} onChange={(e) => setKontak(e.target.value)} placeholder="mis. 0812xxxxxxx" /></div>
        </div>
        <button className="btn" disabled={simpan}>{simpan ? 'Menyimpan...' : 'Simpan profil'}</button>
      </form>

      <form className="card" onSubmit={gantiPassword} id="password">
        <h3>Ubah password</h3>
        {msgPw.teks && <div className={`alert ${msgPw.tipe === 'success' ? 'success' : ''}`}>{msgPw.teks}</div>}
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
