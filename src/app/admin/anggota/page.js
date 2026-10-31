'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase, buatKlienSementara } from '@/lib/supabase';
import { angka, tgl } from '@/lib/format';
import { AIPlus } from '@/components/admin/AdminIcons';

const KOSONG = { nama: '', sapaan: '', kontak: '', alamat: '', email: '', password: '' };

export default function AnggotaPage() {
  const [rows, setRows] = useState([]);
  const [lahan, setLahan] = useState([]);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [tambah, setTambah] = useState(false);
  const [f, setF] = useState(KOSONG);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function load() {
    const [p, l] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'petani').order('created_at', { ascending: false }),
      supabase.from('lands').select('petani_id, luas_ha, status'),
    ]);
    if (p.error || l.error) { setMsg((p.error || l.error).message); return; }
    setRows(p.data);
    setLahan(l.data);
  }
  useEffect(() => { load(); }, []);

  const ringkasLahan = useMemo(() => {
    const m = {};
    for (const x of lahan) {
      if (x.status !== 'aktif') continue;
      m[x.petani_id] = m[x.petani_id] || { n: 0, ha: 0 };
      m[x.petani_id].n += 1;
      m[x.petani_id].ha += Number(x.luas_ha);
    }
    return m;
  }, [lahan]);

  async function toggle(r) {
    const { error } = await supabase.from('profiles').update({ is_active: !r.is_active }).eq('id', r.id);
    if (error) setMsg(error.message); else load();
  }

  async function tambahPetani(e) {
    e.preventDefault();
    setMsg(''); setOk('');
    if (f.password.length < 6) { setMsg('Password sementara minimal 6 karakter.'); return; }
    setLoading(true);

    // Akun dibuat lewat klien sementara agar sesi admin tidak tertimpa.
    const temp = buatKlienSementara();
    const { data, error } = await temp.auth.signUp({
      email: f.email.trim().toLowerCase(),
      password: f.password,
      options: { data: { nama: f.nama.trim(), kontak: f.kontak.trim() } },
    });
    if (error) { setMsg(error.message); setLoading(false); return; }
    if (!data.user || (data.user.identities && data.user.identities.length === 0)) {
      setMsg('Email ini sudah terdaftar. Cari petaninya di daftar, atau pakai email lain.');
      setLoading(false);
      return;
    }

    // Profil dibuat otomatis oleh database; lengkapi sapaan dan alamat sebagai admin.
    const { error: e2 } = await supabase.from('profiles')
      .update({ sapaan: f.sapaan || null, alamat: f.alamat.trim() || null })
      .eq('id', data.user.id);
    setLoading(false);
    if (e2) { setMsg('Akun dibuat, tetapi sapaan/alamat belum tersimpan: ' + e2.message); load(); return; }

    setOk(
      `Petani "${f.nama.trim()}" berhasil ditambahkan. Berikan email dan password sementara tadi kepada petani` +
      (data.session ? '.' : ' (petani mungkin perlu konfirmasi email dulu, tergantung pengaturan Supabase).')
    );
    setF(KOSONG);
    setTambah(false);
    load();
  }

  return (
    <>
      <div className="ad-head">
        <h1>Data Anggota</h1>
        <button className="btn" onClick={() => { setTambah((v) => !v); setOk(''); }}>
          <AIPlus /><span>{tambah ? 'Tutup form' : 'Tambah Petani'}</span>
        </button>
      </div>

      {msg && <div className="alert">{msg}</div>}
      {ok && <div className="alert success" role="status">{ok}</div>}

      {tambah && (
        <form className="card" onSubmit={tambahPetani}>
          <h3>Tambah petani baru</h3>
          <p className="muted">Admin membuatkan akun login untuk petani. Berikan email dan password sementara ini kepada petani, lalu sarankan menggantinya.</p>
          <div className="row">
            <div className="field"><label htmlFor="a-nama">Nama lengkap</label>
              <input id="a-nama" className="input" required value={f.nama} onChange={set('nama')} /></div>
            <div className="field"><label htmlFor="a-sapaan">Sapaan di dashboard</label>
              <select id="a-sapaan" className="input" value={f.sapaan} onChange={set('sapaan')}>
                <option value="">Tanpa sapaan</option>
                <option value="Pak">Pak</option>
                <option value="Bu">Bu</option>
              </select></div>
            <div className="field"><label htmlFor="a-kontak">No. WhatsApp</label>
              <input id="a-kontak" className="input" inputMode="tel" placeholder="0812xxxxxxx" value={f.kontak} onChange={set('kontak')} /></div>
          </div>
          <div className="field"><label htmlFor="a-alamat">Alamat</label>
            <input id="a-alamat" className="input" placeholder="Desa, kecamatan" value={f.alamat} onChange={set('alamat')} /></div>
          <div className="row">
            <div className="field"><label htmlFor="a-email">Email (untuk login)</label>
              <input id="a-email" className="input" type="email" required autoCapitalize="none" value={f.email} onChange={set('email')} /></div>
            <div className="field"><label htmlFor="a-pw">Password sementara</label>
              <input id="a-pw" className="input" type="text" required minLength={6} autoComplete="off" value={f.password} onChange={set('password')} /></div>
          </div>
          <div className="ad-actions">
            <button className="btn" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan petani'}</button>
            <button type="button" className="btn secondary" onClick={() => setTambah(false)} disabled={loading}>Batal</button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Kontak</th><th>Lahan aktif</th><th>Terdaftar</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="6" className="muted">Belum ada petani terdaftar.</td></tr>}
            {rows.map((r) => {
              const l = ringkasLahan[r.id];
              return (
                <tr key={r.id}>
                  <td><Link href={`/admin/anggota/${r.id}`} className="ad-link"><strong>{r.sapaan ? `${r.sapaan} ` : ''}{r.nama}</strong></Link>
                    {r.alamat && <div className="muted">{r.alamat}</div>}</td>
                  <td>{r.kontak || '-'}</td>
                  <td>{l ? `${l.n} lahan · ${angka(l.ha, 2)} ha` : <span className="muted">Belum ada</span>}</td>
                  <td>{tgl(r.created_at)}</td>
                  <td><span className={`badge ${r.is_active ? 'ok' : 'off'}`}>{r.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td>
                    <div className="ad-actions">
                      <Link href={`/admin/anggota/${r.id}`} className="btn small">Detail & Lahan</Link>
                      <button className="btn small secondary" onClick={() => toggle(r)}>{r.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
