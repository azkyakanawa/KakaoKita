'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import PriceChart from '@/components/PriceChart';
import { rupiah, angka, tgl } from '@/lib/format';

export default function PetaniBeranda() {
  const profile = useProfile();
  const [prices, setPrices] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [ann, setAnn] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const [p, h, a] = await Promise.all([
        supabase.from('price_entries').select('*').order('tanggal', { ascending: false }).limit(60),
        supabase.from('harvests').select('*').eq('petani_id', profile.id).order('tanggal', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      const err = p.error || h.error || a.error;
      if (err) { setMsg(err.message); return; }
      setPrices(p.data); setHarvests(h.data); setAnn(a.data);
    }
    load();
  }, [profile.id]);

  const kering = prices.filter((x) => x.kondisi === 'kering');
  const lokal = kering.find((x) => x.jenis === 'lokal');
  const tujuan = kering.find((x) => x.jenis === 'tujuan');
  const total = harvests.reduce((a, r) => a + Number(r.berat_kg), 0);

  return (
    <>
      <h1>Halo, {profile.nama}</h1>
      {msg && <div className="alert">{msg}</div>}

      <div className="grid cols-3">
        <div className="card">
          <div className="muted">Harga lokal terbaru (kering)</div>
          <div className="stat">{lokal ? rupiah(lokal.harga_per_kg) : '-'}</div>
          {lokal && <div className="muted">{tgl(lokal.tanggal)} - {lokal.sumber}</div>}
        </div>
        <div className="card">
          <div className="muted">Harga tujuan terbaru (kering)</div>
          <div className="stat">{tujuan ? rupiah(tujuan.harga_per_kg) : '-'}</div>
          {tujuan && <div className="muted">{tgl(tujuan.tanggal)} - {tujuan.sumber}</div>}
        </div>
        <div className="card">
          <div className="muted">Total panen saya</div>
          <div className="stat">{angka(total, 1)} kg</div>
        </div>
      </div>

      <div className="card">
        <h2>Tren harga</h2>
        <PriceChart entries={prices} />
      </div>

      <div className="card table-wrap">
        <h2>Riwayat panen saya</h2>
        <table>
          <thead><tr><th>Tanggal</th><th>Berat</th><th>Kualitas</th></tr></thead>
          <tbody>
            {harvests.length === 0 && <tr><td colSpan="3" className="muted">Belum ada panen yang dicatat koperasi.</td></tr>}
            {harvests.map((r) => (
              <tr key={r.id}><td>{tgl(r.tanggal)}</td><td>{angka(r.berat_kg, 1)} kg</td><td>{r.kualitas}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Pengumuman koperasi</h2>
        {ann.length === 0 && <p className="muted">Belum ada pengumuman.</p>}
        {ann.map((a) => (
          <div key={a.id} style={{ marginBottom: 12 }}>
            <h3>{a.judul}</h3>
            <p>{a.isi}</p>
            <p className="muted">{tgl(a.created_at)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
