'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { rupiah, angka } from '@/lib/format';
import { hitungSimulasi } from '@/lib/simulasi';

export default function SimulasiPage() {
  const [buyers, setBuyers] = useState([]);
  const [rates, setRates] = useState([]);
  const [msg, setMsg] = useState('');
  const [f, setF] = useState({
    berat: '', hargaTujuan: '', ongkir: '', biayaLain: '', susutPersen: '2', hargaLokal: '',
  });
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));

  useEffect(() => {
    async function load() {
      const [b, r, l] = await Promise.all([
        supabase.from('buyers').select('*').order('tanggal', { ascending: false }),
        supabase.from('shipping_rates').select('*').order('tanggal', { ascending: false }),
        supabase.from('price_entries').select('harga_per_kg').eq('jenis', 'lokal').eq('kondisi', 'kering')
          .order('tanggal', { ascending: false }).limit(1),
      ]);
      if (b.error || r.error || l.error) { setMsg((b.error || r.error || l.error).message); return; }
      setBuyers(b.data); setRates(r.data);
      if (l.data?.[0]) setF((prev) => (prev.hargaLokal ? prev : { ...prev, hargaLokal: String(l.data[0].harga_per_kg) }));
    }
    load();
  }, []);

  const hasil = useMemo(() => hitungSimulasi(f), [f]);
  const siap = Number(f.berat) > 0 && Number(f.hargaTujuan) > 0 && Number(f.hargaLokal) > 0;

  return (
    <>
      <h1>Simulasi Jual</h1>
      <p className="muted">Bandingkan hasil menjual bersama ke tujuan jauh dengan menjual ke pengepul lokal. Hasil hanya perkiraan.</p>
      {msg && <div className="alert">{msg}</div>}

      <div className="card">
        <h3>Isi data</h3>
        <div className="row">
          <div className="field"><label>Pilih pembeli (opsional)</label>
            <select className="input" defaultValue="" onChange={(e) => {
              const b = buyers.find((x) => x.id === e.target.value);
              if (b) setF((p) => ({ ...p, hargaTujuan: String(b.harga_penawaran) }));
            }}>
              <option value="">- isi manual -</option>
              {buyers.map((b) => <option key={b.id} value={b.id}>{b.nama} - {b.kota_tujuan}</option>)}
            </select></div>
          <div className="field"><label>Pilih tarif kirim (opsional)</label>
            <select className="input" defaultValue="" onChange={(e) => {
              const r = rates.find((x) => x.id === e.target.value);
              if (r) setF((p) => ({ ...p, ongkir: String(r.tarif_per_kg) }));
            }}>
              <option value="">- isi manual -</option>
              {rates.map((r) => <option key={r.id} value={r.id}>{r.asal} → {r.tujuan}</option>)}
            </select></div>
        </div>
        <div className="row">
          <div className="field"><label>Total berat (kg)</label><input className="input" type="number" min="0" value={f.berat} onChange={set('berat')} /></div>
          <div className="field"><label>Harga di tujuan (Rp/kg)</label><input className="input" type="number" min="0" value={f.hargaTujuan} onChange={set('hargaTujuan')} /></div>
          <div className="field"><label>Ongkir (Rp/kg)</label><input className="input" type="number" min="0" value={f.ongkir} onChange={set('ongkir')} /></div>
          <div className="field"><label>Biaya lain (Rp/kg)</label><input className="input" type="number" min="0" placeholder="karung, bongkar muat" value={f.biayaLain} onChange={set('biayaLain')} /></div>
          <div className="field"><label>Susut (%)</label><input className="input" type="number" min="0" max="100" step="0.1" value={f.susutPersen} onChange={set('susutPersen')} /></div>
          <div className="field"><label>Harga pengepul lokal (Rp/kg)</label><input className="input" type="number" min="0" value={f.hargaLokal} onChange={set('hargaLokal')} /></div>
        </div>
      </div>

      <div className="card">
        <h3>Hasil</h3>
        {!siap ? (
          <p className="muted">Isi total berat, harga tujuan, dan harga lokal untuk melihat hasil.</p>
        ) : (
          <>
            <div className="grid cols-3">
              <div><div className="muted">Harga bersih di tujuan</div><div className="stat">{rupiah(hasil.hargaBersih)}/kg</div></div>
              <div><div className="muted">Harga pengepul lokal</div><div className="stat">{rupiah(f.hargaLokal)}/kg</div></div>
              <div><div className="muted">Selisih per kg</div>
                <div className="stat" style={{ color: hasil.selisih > 0 ? 'var(--hijau)' : 'var(--merah)' }}>{rupiah(hasil.selisih)}</div></div>
            </div>
            <p style={{ marginTop: 12 }}>
              Total jual kolektif: <b>{rupiah(hasil.totalKolektif)}</b> &nbsp;|&nbsp; Total jual lokal: <b>{rupiah(hasil.totalLokal)}</b> &nbsp;|&nbsp;
              Selisih untuk {angka(f.berat)} kg: <b>{rupiah(hasil.tambahan)}</b>
            </p>
            <div className={`alert ${hasil.rekomendasi === 'kolektif' ? 'success' : 'info'}`}>
              {hasil.rekomendasi === 'kolektif'
                ? 'Jual kolektif lebih menguntungkan berdasarkan angka yang dimasukkan.'
                : 'Lebih baik jual lokal berdasarkan angka yang dimasukkan.'}
            </div>
            <p className="muted">
              Rumus: harga bersih = harga tujuan × (1 − susut%) − ongkir − biaya lain. Pertimbangkan juga waktu pengiriman dan risiko pembayaran.
            </p>
          </>
        )}
      </div>
    </>
  );
}
