'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { rupiah, tgl, today } from '@/lib/format';

export default function PembeliPage() {
  const [buyers, setBuyers] = useState([]);
  const [rates, setRates] = useState([]);
  const [msg, setMsg] = useState('');
  const [fb, setFb] = useState({ nama: '', kota_tujuan: '', harga_penawaran: '', sumber: '', tanggal: today(), is_simulasi: false });
  const [fr, setFr] = useState({ asal: 'Lampung', tujuan: '', tarif_per_kg: '', sumber: '', tanggal: today(), is_simulasi: false });
  const setB = (k) => (e) => setFb({ ...fb, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setR = (k) => (e) => setFr({ ...fr, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function load() {
    const [b, r] = await Promise.all([
      supabase.from('buyers').select('*').order('tanggal', { ascending: false }),
      supabase.from('shipping_rates').select('*').order('tanggal', { ascending: false }),
    ]);
    if (b.error || r.error) { setMsg((b.error || r.error).message); return; }
    setBuyers(b.data); setRates(r.data);
  }
  useEffect(() => { load(); }, []);

  async function addBuyer(e) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('buyers').insert({ ...fb, harga_penawaran: Number(fb.harga_penawaran) });
    if (error) { setMsg(error.message); return; }
    setFb({ ...fb, nama: '', kota_tujuan: '', harga_penawaran: '', sumber: '' }); load();
  }
  async function addRate(e) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('shipping_rates').insert({ ...fr, tarif_per_kg: Number(fr.tarif_per_kg) });
    if (error) { setMsg(error.message); return; }
    setFr({ ...fr, tujuan: '', tarif_per_kg: '', sumber: '' }); load();
  }
  async function hapus(tabel, id) {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await supabase.from(tabel).delete().eq('id', id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <>
      <h1>Data Pembeli dan Tarif Kirim</h1>
      <div className="alert info">
        Data ini diinput manual oleh pengurus dari penawaran yang diterima (lengkap dengan sumber dan tanggal). Hanya kepala koperasi yang dapat melihatnya. Aplikasi ini bukan marketplace.
      </div>
      {msg && <div className="alert">{msg}</div>}

      <form className="card" onSubmit={addBuyer}>
        <h3>Tambah data pembeli</h3>
        <div className="row">
          <div className="field"><label>Nama pembeli</label><input className="input" required value={fb.nama} onChange={setB('nama')} /></div>
          <div className="field"><label>Kota tujuan</label><input className="input" required value={fb.kota_tujuan} onChange={setB('kota_tujuan')} /></div>
          <div className="field"><label>Harga penawaran (Rp/kg)</label><input className="input" type="number" min="0" required value={fb.harga_penawaran} onChange={setB('harga_penawaran')} /></div>
          <div className="field"><label>Sumber</label><input className="input" required value={fb.sumber} onChange={setB('sumber')} /></div>
          <div className="field"><label>Tanggal</label><input className="input" type="date" required value={fb.tanggal} onChange={setB('tanggal')} /></div>
        </div>
        <label className="check"><input type="checkbox" checked={fb.is_simulasi} onChange={setB('is_simulasi')} /> Data simulasi</label>
        <button className="btn">Simpan pembeli</button>
      </form>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Pembeli</th><th>Tujuan</th><th>Penawaran/kg</th><th>Sumber</th><th>Tanggal</th><th></th></tr></thead>
          <tbody>
            {buyers.length === 0 && <tr><td colSpan="6" className="muted">Belum ada data pembeli.</td></tr>}
            {buyers.map((b) => (
              <tr key={b.id}>
                <td>{b.nama} {b.is_simulasi && <span className="badge">Simulasi</span>}</td>
                <td>{b.kota_tujuan}</td><td>{rupiah(b.harga_penawaran)}</td><td>{b.sumber}</td><td>{tgl(b.tanggal)}</td>
                <td><button className="btn small danger" onClick={() => hapus('buyers', b.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="card" onSubmit={addRate}>
        <h3>Tambah tarif kirim</h3>
        <div className="row">
          <div className="field"><label>Asal</label><input className="input" required value={fr.asal} onChange={setR('asal')} /></div>
          <div className="field"><label>Tujuan</label><input className="input" required value={fr.tujuan} onChange={setR('tujuan')} /></div>
          <div className="field"><label>Tarif (Rp/kg)</label><input className="input" type="number" min="0" required value={fr.tarif_per_kg} onChange={setR('tarif_per_kg')} /></div>
          <div className="field"><label>Sumber (ekspedisi)</label><input className="input" required value={fr.sumber} onChange={setR('sumber')} /></div>
          <div className="field"><label>Tanggal</label><input className="input" type="date" required value={fr.tanggal} onChange={setR('tanggal')} /></div>
        </div>
        <label className="check"><input type="checkbox" checked={fr.is_simulasi} onChange={setR('is_simulasi')} /> Data simulasi</label>
        <button className="btn">Simpan tarif</button>
      </form>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Rute</th><th>Tarif/kg</th><th>Sumber</th><th>Tanggal</th><th></th></tr></thead>
          <tbody>
            {rates.length === 0 && <tr><td colSpan="5" className="muted">Belum ada tarif kirim.</td></tr>}
            {rates.map((r) => (
              <tr key={r.id}>
                <td>{r.asal} → {r.tujuan} {r.is_simulasi && <span className="badge">Simulasi</span>}</td>
                <td>{rupiah(r.tarif_per_kg)}</td><td>{r.sumber}</td><td>{tgl(r.tanggal)}</td>
                <td><button className="btn small danger" onClick={() => hapus('shipping_rates', r.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
