'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { rupiah, angka, tgl } from '@/lib/format';

export default function AdminRingkasan() {
  const [stat, setStat] = useState({ petani: 0, totalKg: 0, lokal: null, tujuan: null });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const [p, h, hl, ht] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'petani').eq('is_active', true),
        supabase.from('harvests').select('berat_kg'),
        supabase.from('price_entries').select('*').eq('jenis', 'lokal').eq('kondisi', 'kering').order('tanggal', { ascending: false }).limit(1),
        supabase.from('price_entries').select('*').eq('jenis', 'tujuan').eq('kondisi', 'kering').order('tanggal', { ascending: false }).limit(1),
      ]);
      const err = p.error || h.error || hl.error || ht.error;
      if (err) { setMsg(err.message); return; }
      setStat({
        petani: p.count || 0,
        totalKg: (h.data || []).reduce((a, r) => a + Number(r.berat_kg), 0),
        lokal: hl.data?.[0] || null,
        tujuan: ht.data?.[0] || null,
      });
    }
    load();
  }, []);

  return (
    <>
      <h1>Ringkasan Koperasi</h1>
      {msg && <div className="alert">{msg}</div>}
      <div className="grid cols-3">
        <div className="card"><div className="muted">Petani aktif</div><div className="stat">{angka(stat.petani)}</div></div>
        <div className="card"><div className="muted">Stok panen tercatat</div><div className="stat">{angka(stat.totalKg, 1)} kg</div></div>
        <div className="card">
          <div className="muted">Harga lokal terbaru (kering)</div>
          <div className="stat">{stat.lokal ? rupiah(stat.lokal.harga_per_kg) : '-'}</div>
          {stat.lokal && <div className="muted">{tgl(stat.lokal.tanggal)}</div>}
        </div>
        <div className="card">
          <div className="muted">Harga tujuan terbaru (kering)</div>
          <div className="stat">{stat.tujuan ? rupiah(stat.tujuan.harga_per_kg) : '-'}</div>
          {stat.tujuan && <div className="muted">{tgl(stat.tujuan.tanggal)}</div>}
        </div>
      </div>
      <div className="card">
        <h3>Mulai dari sini</h3>
        <p>Catat panen anggota, perbarui harga, lalu gunakan Simulasi Jual untuk menilai apakah menjual bersama lebih menguntungkan.</p>
        <Link href="/admin/simulasi" className="btn">Buka Simulasi Jual</Link>
      </div>
    </>
  );
}
