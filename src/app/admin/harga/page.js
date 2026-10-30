'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { rupiah, tgl, today } from '@/lib/format';

export default function HargaPage() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    tanggal: today(), lokasi: '', jenis: 'lokal', kondisi: 'kering', harga_per_kg: '', sumber: '', is_simulasi: false,
  });
  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function load() {
    const { data, error } = await supabase
      .from('price_entries').select('*').order('tanggal', { ascending: false }).limit(50);
    if (error) setMsg(error.message); else setRows(data);
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.from('price_entries').insert({ ...form, harga_per_kg: Number(form.harga_per_kg) });
    if (error) { setMsg(error.message); return; }
    setForm({ ...form, harga_per_kg: '', sumber: '' });
    load();
  }

  async function hapus(id) {
    if (!confirm('Hapus data harga ini?')) return;
    const { error } = await supabase.from('price_entries').delete().eq('id', id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <>
      <h1>Harga Kakao</h1>
      {msg && <div className="alert">{msg}</div>}
      <form className="card" onSubmit={submit}>
        <h3>Tambah harga</h3>
        <div className="row">
          <div className="field"><label>Tanggal</label><input className="input" type="date" required value={form.tanggal} onChange={set('tanggal')} /></div>
          <div className="field"><label>Lokasi / pihak</label><input className="input" required placeholder="mis. Pengepul desa X" value={form.lokasi} onChange={set('lokasi')} /></div>
          <div className="field"><label>Jenis</label>
            <select className="input" value={form.jenis} onChange={set('jenis')}>
              <option value="lokal">Lokal (pengepul)</option>
              <option value="tujuan">Tujuan (pembeli jauh)</option>
            </select></div>
          <div className="field"><label>Kondisi biji</label>
            <select className="input" value={form.kondisi} onChange={set('kondisi')}>
              <option value="kering">Kering</option>
              <option value="basah">Basah</option>
            </select></div>
          <div className="field"><label>Harga per kg (Rp)</label><input className="input" type="number" min="0" required value={form.harga_per_kg} onChange={set('harga_per_kg')} /></div>
          <div className="field"><label>Sumber data</label><input className="input" required placeholder="mis. Wawancara pengepul, 29 Okt" value={form.sumber} onChange={set('sumber')} /></div>
        </div>
        <label className="check"><input type="checkbox" checked={form.is_simulasi} onChange={set('is_simulasi')} /> Tandai sebagai data simulasi</label>
        <button className="btn">Simpan</button>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Tanggal</th><th>Lokasi</th><th>Jenis</th><th>Kondisi</th><th>Harga/kg</th><th>Sumber</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="7" className="muted">Belum ada data.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{tgl(r.tanggal)}</td><td>{r.lokasi}</td><td>{r.jenis}</td><td>{r.kondisi}</td>
                <td>{rupiah(r.harga_per_kg)}</td>
                <td>{r.sumber} {r.is_simulasi && <span className="badge">Simulasi</span>}</td>
                <td><button className="btn small danger" onClick={() => hapus(r.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
