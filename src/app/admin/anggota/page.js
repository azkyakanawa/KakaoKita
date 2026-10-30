'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { tgl } from '@/lib/format';

export default function AnggotaPage() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('role', 'petani').order('created_at', { ascending: false });
    if (error) setMsg(error.message); else setRows(data);
  }
  useEffect(() => { load(); }, []);

  async function toggle(r) {
    const { error } = await supabase.from('profiles').update({ is_active: !r.is_active }).eq('id', r.id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <>
      <h1>Data Anggota</h1>
      <div className="alert info">
        Petani mendaftar sendiri lewat halaman Daftar. Di sini kepala koperasi mengaktifkan atau menonaktifkan anggota.
      </div>
      {msg && <div className="alert">{msg}</div>}
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Nama</th><th>Kontak</th><th>Terdaftar</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="5" className="muted">Belum ada petani terdaftar.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.nama}</td>
                <td>{r.kontak || '-'}</td>
                <td>{tgl(r.created_at)}</td>
                <td><span className={`badge ${r.is_active ? 'ok' : 'off'}`}>{r.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                <td><button className="btn small secondary" onClick={() => toggle(r)}>{r.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
