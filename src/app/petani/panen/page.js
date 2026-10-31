'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import { angka, tgl } from '@/lib/format';

export default function RiwayatPanen() {
  const profile = useProfile();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('harvests').select('*').eq('petani_id', profile.id).order('tanggal', { ascending: false })
      .then(({ data, error }) => { if (error) setMsg(error.message); else setRows(data); });
  }, [profile.id]);

  const total = rows.reduce((a, r) => a + Number(r.berat_kg), 0);

  return (
    <>
      <h1>Riwayat Panen</h1>
      {msg && <div className="alert">{msg}</div>}
      <div className="card">
        <div className="muted">Total panen tercatat</div>
        <div className="stat">{angka(total, 1)} kg</div>
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Tanggal</th><th>Berat</th><th>Kualitas</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="3" className="muted">Belum ada panen yang dicatat koperasi.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}><td>{tgl(r.tanggal)}</td><td>{angka(r.berat_kg, 1)} kg</td><td style={{ textTransform: 'capitalize' }}>{r.kualitas}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
