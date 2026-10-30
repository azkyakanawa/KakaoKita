'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { tgl } from '@/lib/format';

export default function PengumumanAdminPage() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ judul: '', isi: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function load() {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) setMsg(error.message); else setRows(data);
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault(); setMsg('');
    const { error } = await supabase.from('announcements').insert(form);
    if (error) { setMsg(error.message); return; }
    setForm({ judul: '', isi: '' }); load();
  }
  async function hapus(id) {
    if (!confirm('Hapus pengumuman ini?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <>
      <h1>Pengumuman</h1>
      {msg && <div className="alert">{msg}</div>}
      <form className="card" onSubmit={submit}>
        <div className="field"><label>Judul</label><input className="input" required value={form.judul} onChange={set('judul')} /></div>
        <div className="field"><label>Isi pengumuman</label><textarea className="input" rows="3" required value={form.isi} onChange={set('isi')} /></div>
        <button className="btn">Kirim ke anggota</button>
      </form>
      {rows.length === 0 && <p className="muted">Belum ada pengumuman.</p>}
      {rows.map((r) => (
        <div className="card" key={r.id}>
          <h3>{r.judul}</h3>
          <p>{r.isi}</p>
          <p className="muted">{tgl(r.created_at)}</p>
          <button className="btn small danger" onClick={() => hapus(r.id)}>Hapus</button>
        </div>
      ))}
    </>
  );
}
