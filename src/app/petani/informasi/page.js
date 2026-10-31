'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PriceChart from '@/components/PriceChart';
import { rupiah, tgl } from '@/lib/format';

export default function Informasi() {
  const [prices, setPrices] = useState([]);
  const [ann, setAnn] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const [p, a] = await Promise.all([
        supabase.from('price_entries').select('*').order('tanggal', { ascending: false }).limit(60),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(20),
      ]);
      if (p.error || a.error) { setMsg((p.error || a.error).message); return; }
      setPrices(p.data); setAnn(a.data);
    }
    load();
  }, []);

  const kering = prices.filter((x) => x.kondisi === 'kering');
  const lokal = kering.find((x) => x.jenis === 'lokal');
  const tujuan = kering.find((x) => x.jenis === 'tujuan');

  return (
    <>
      <h1>Informasi Terbaru</h1>
      {msg && <div className="alert">{msg}</div>}

      <div className="grid cols-2">
        <div className="card">
          <div className="muted">Harga lokal terbaru (kering)</div>
          <div className="stat">{lokal ? rupiah(lokal.harga_per_kg) : '-'}</div>
          {lokal && <div className="muted">{tgl(lokal.tanggal)} - {lokal.sumber}{lokal.is_simulasi ? ' (simulasi)' : ''}</div>}
        </div>
        <div className="card">
          <div className="muted">Harga tujuan terbaru (kering)</div>
          <div className="stat">{tujuan ? rupiah(tujuan.harga_per_kg) : '-'}</div>
          {tujuan && <div className="muted">{tgl(tujuan.tanggal)} - {tujuan.sumber}{tujuan.is_simulasi ? ' (simulasi)' : ''}</div>}
        </div>
      </div>

      <div className="card">
        <h3>Tren harga</h3>
        <PriceChart entries={prices} />
      </div>

      <div className="card">
        <h3>Pengumuman koperasi</h3>
        {ann.length === 0 && <p className="muted">Belum ada pengumuman.</p>}
        {ann.map((a) => (
          <div key={a.id} style={{ marginBottom: 16 }}>
            <strong>{a.judul}</strong>
            <p style={{ margin: '4px 0' }}>{a.isi}</p>
            <p className="muted">{tgl(a.created_at)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
