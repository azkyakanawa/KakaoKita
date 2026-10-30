'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { angka, tgl, today } from '@/lib/format';

export default function PanenPage() {
  const [petani, setPetani] = useState([]);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ petani_id: '', tanggal: today(), berat_kg: '', kualitas: 'baik' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function load() {
    const [p, h] = await Promise.all([
      supabase.from('profiles').select('id, nama').eq('role', 'petani').eq('is_active', true).order('nama'),
      supabase.from('harvests').select('*, profiles(nama)').order('tanggal', { ascending: false }).limit(50),
    ]);
    if (p.error || h.error) { setMsg((p.error || h.error).message); return; }
    setPetani(p.data);
    setRows(h.data);
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.from('harvests').insert({ ...form, berat_kg: Number(form.berat_kg) });
    if (error) { setMsg(error.message); return; }
    setForm({ ...form, berat_kg: '' });
    load();
  }

  async function hapus(id) {
    if (!confirm('Hapus catatan panen ini?')) return;
    const { error } = await supabase.from('harvests').delete().eq('id', id);
    if (error) setMsg(error.message); else load();
  }

  const total = rows.reduce((a, r) => a + Number(r.berat_kg), 0);

  return (
    <>
      <h1>Catatan Panen</h1>
      {msg && <div className="alert">{msg}</div>}
      <form className="card" onSubmit={submit}>
        <h3>Catat panen anggota</h3>
        {petani.length === 0 && <div className="alert info">Belum ada petani aktif. Minta petani mendaftar dulu.</div>}
        <div className="row">
          <div className="field"><label>Petani</label>
            <select className="input" required value={form.petani_id} onChange={set('petani_id')}>
              <option value="">Pilih petani</option>
              {petani.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select></div>
          <div className="field"><label>Tanggal</label><input className="input" type="date" required value={form.tanggal} onChange={set('tanggal')} /></div>
          <div className="field"><label>Berat (kg)</label><input className="input" type="number" min="0.1" step="0.1" required value={form.berat_kg} onChange={set('berat_kg')} /></div>
          <div className="field"><label>Kualitas</label>
            <select className="input" value={form.kualitas} onChange={set('kualitas')}>
              <option value="baik">Baik</option><option value="sedang">Sedang</option><option value="kurang">Kurang</option>
            </select></div>
        </div>
        <button className="btn">Simpan</button>
      </form>

      <div className="card table-wrap">
        <p className="muted">Total pada daftar ini: <b>{angka(total, 1)} kg</b> (50 catatan terbaru)</p>
        <table>
          <thead><tr><th>Tanggal</th><th>Petani</th><th>Berat</th><th>Kualitas</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="5" className="muted">Belum ada catatan panen.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{tgl(r.tanggal)}</td><td>{r.profiles?.nama || '-'}</td><td>{angka(r.berat_kg, 1)} kg</td><td>{r.kualitas}</td>
                <td><button className="btn small danger" onClick={() => hapus(r.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
