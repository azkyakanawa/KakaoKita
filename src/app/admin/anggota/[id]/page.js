'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { angka, tgl } from '@/lib/format';
import LahanForm from '@/components/admin/LahanForm';
import { AIPlus, AIPin, AILand } from '@/components/admin/AdminIcons';

export default function DetailPetani() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [lahan, setLahan] = useState([]);
  const [totalKg, setTotalKg] = useState(0);
  const [f, setF] = useState({ nama: '', sapaan: '', kontak: '', alamat: '' });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [simpan, setSimpan] = useState(false);
  const [formLahan, setFormLahan] = useState(null); // null | 'baru' | objek lahan
  const [memuat, setMemuat] = useState(true);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = useCallback(async () => {
    const [pr, l, h] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
      supabase.from('lands').select('*').eq('petani_id', id).order('created_at', { ascending: true }),
      supabase.from('harvests').select('berat_kg').eq('petani_id', id),
    ]);
    setMemuat(false);
    if (pr.error || l.error || h.error) { setMsg((pr.error || l.error || h.error).message); return; }
    if (!pr.data) { setMsg('Petani tidak ditemukan.'); return; }
    setP(pr.data);
    setF({ nama: pr.data.nama || '', sapaan: pr.data.sapaan || '', kontak: pr.data.kontak || '', alamat: pr.data.alamat || '' });
    setLahan(l.data);
    setTotalKg(h.data.reduce((a, r) => a + Number(r.berat_kg), 0));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function simpanData(e) {
    e.preventDefault();
    setMsg(''); setOk('');
    if (!f.nama.trim()) { setMsg('Nama tidak boleh kosong.'); return; }
    setSimpan(true);
    const { error } = await supabase.from('profiles').update({
      nama: f.nama.trim(), sapaan: f.sapaan || null, kontak: f.kontak.trim() || null, alamat: f.alamat.trim() || null,
    }).eq('id', id);
    setSimpan(false);
    if (error) { setMsg(error.message); return; }
    setOk('Data petani tersimpan.');
    load();
  }

  async function ubahStatus() {
    const { error } = await supabase.from('profiles').update({ is_active: !p.is_active }).eq('id', id);
    if (error) setMsg(error.message); else load();
  }

  async function hapusLahan(l) {
    if (!confirm(`Hapus lahan "${l.nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await supabase.from('lands').delete().eq('id', l.id);
    if (error) { setMsg(error.message); return; }
    if (l.foto_path) await supabase.storage.from('lahan').remove([l.foto_path]);
    load();
  }

  if (memuat) return <p className="muted">Memuat...</p>;
  if (!p) return (<><div className="alert">{msg || 'Petani tidak ditemukan.'}</div><Link href="/admin/anggota" className="btn secondary">Kembali ke daftar</Link></>);

  const totalHa = lahan.filter((l) => l.status === 'aktif').reduce((a, l) => a + Number(l.luas_ha), 0);

  return (
    <>
      <div className="ad-head">
        <h1>{p.sapaan ? `${p.sapaan} ` : ''}{p.nama}</h1>
        <Link href="/admin/anggota" className="btn secondary">Kembali ke daftar</Link>
      </div>

      {msg && <div className="alert">{msg}</div>}
      {ok && <div className="alert success" role="status">{ok}</div>}

      <div className="grid cols-3">
        <div className="card"><div className="muted">Status akun</div>
          <div style={{ margin: '8px 0 12px' }}><span className={`badge ${p.is_active ? 'ok' : 'off'}`}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span></div>
          <button className="btn small secondary" onClick={ubahStatus}>{p.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button></div>
        <div className="card"><div className="muted">Lahan aktif</div><div className="stat">{angka(totalHa, 2)} ha</div><div className="muted">{lahan.filter((l) => l.status === 'aktif').length} lahan</div></div>
        <div className="card"><div className="muted">Total panen tercatat</div><div className="stat">{angka(totalKg, 1)} kg</div><div className="muted">Terdaftar {tgl(p.created_at)}</div></div>
      </div>

      <form className="card" onSubmit={simpanData}>
        <h3>Data petani</h3>
        <div className="row">
          <div className="field"><label htmlFor="d-nama">Nama lengkap</label>
            <input id="d-nama" className="input" required value={f.nama} onChange={set('nama')} /></div>
          <div className="field"><label htmlFor="d-sapaan">Sapaan di dashboard</label>
            <select id="d-sapaan" className="input" value={f.sapaan} onChange={set('sapaan')}>
              <option value="">Tanpa sapaan</option><option value="Pak">Pak</option><option value="Bu">Bu</option>
            </select></div>
          <div className="field"><label htmlFor="d-kontak">No. WhatsApp</label>
            <input id="d-kontak" className="input" inputMode="tel" value={f.kontak} onChange={set('kontak')} /></div>
        </div>
        <div className="field"><label htmlFor="d-alamat">Alamat</label>
          <input id="d-alamat" className="input" placeholder="Desa, kecamatan" value={f.alamat} onChange={set('alamat')} /></div>
        <button className="btn" disabled={simpan}>{simpan ? 'Menyimpan...' : 'Simpan data'}</button>
      </form>

      <div className="ad-head ad-head-sub">
        <h3 style={{ margin: 0 }}>Lahan petani</h3>
        {formLahan === null && <button className="btn small" onClick={() => setFormLahan('baru')}><AIPlus /><span>Tambah lahan</span></button>}
      </div>

      {formLahan !== null && (
        <LahanForm
          key={formLahan === 'baru' ? 'baru' : formLahan.id}
          petaniId={id}
          lahan={formLahan === 'baru' ? null : formLahan}
          onCancel={() => setFormLahan(null)}
          onSaved={() => { setFormLahan(null); setOk('Data lahan tersimpan.'); load(); }}
        />
      )}

      {lahan.length === 0 && formLahan === null && (
        <div className="card muted">Belum ada lahan. Klik "Tambah lahan" setelah dokumen petani dicek.</div>
      )}

      {lahan.map((l) => (
        <article className="card ad-lahan" key={l.id}>
          <div className="ad-lahan-foto">
            {l.foto_url ? <img src={l.foto_url} alt={`Foto ${l.nama}`} loading="lazy" /> : <span><AILand /></span>}
          </div>
          <div className="ad-lahan-info">
            <h3>{l.nama} <span className={`badge ${l.status === 'aktif' ? 'ok' : 'off'}`}>{l.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></h3>
            <p><AIPin className="ad-mini" /> {[l.desa && `Desa ${l.desa}`, l.kecamatan && `Kec. ${l.kecamatan}`].filter(Boolean).join(', ') || 'Lokasi belum diisi'}</p>
            <p>Luas: <strong>{angka(l.luas_ha, 2)} ha</strong></p>
            <p className="muted">{l.jenis_dokumen ? `${l.jenis_dokumen}${l.nomor_dokumen ? ` · No. ${l.nomor_dokumen}` : ''}` : 'Dokumen belum dicatat'}</p>
            {l.catatan && <p className="muted">Catatan: {l.catatan}</p>}
          </div>
          <div className="ad-actions">
            <button className="btn small secondary" onClick={() => { setFormLahan(l); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Ubah</button>
            <button className="btn small danger" onClick={() => hapusLahan(l)}>Hapus</button>
          </div>
        </article>
      ))}
    </>
  );
}
