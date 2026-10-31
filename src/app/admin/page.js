'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { rupiah, angka, tgl } from '@/lib/format';
import { AICalendar, AIMegaphone, AICalc, AIArrow } from '@/components/admin/AdminIcons';

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

      <section className="ad-stats" aria-label="Ringkasan angka">
        <article className="ad-stat">
          <h2>Petani Aktif</h2>
          <p className="ad-stat-val">{angka(stat.petani)}</p>
        </article>

        <article className="ad-stat">
          <h2>Stok Panen Tercatat</h2>
          <p className="ad-stat-val">{angka(stat.totalKg, 1)} kg</p>
        </article>

        <article className="ad-stat">
          <h2>Harga Lokal Terbaru (Kering)</h2>
          <p className="ad-stat-val">{stat.lokal ? rupiah(stat.lokal.harga_per_kg) : '-'}</p>
          {stat.lokal && <p className="ad-stat-date"><AICalendar />{tgl(stat.lokal.tanggal)}</p>}
        </article>

        <article className="ad-stat">
          <h2>Harga Tujuan (Kering)</h2>
          <p className="ad-stat-val">{stat.tujuan ? rupiah(stat.tujuan.harga_per_kg) : '-'}</p>
          {stat.tujuan && <p className="ad-stat-date"><AICalendar />{tgl(stat.tujuan.tanggal)}</p>}
        </article>
      </section>

      <section className="ad-start">
        <span className="ad-start-icon"><AIMegaphone /></span>
        <div>
          <h3>Mulai dari sini</h3>
          <p>Catat panen anggota, perbarui harga, lalu gunakan Simulasi Jual untuk menilai apakah menjual bersama lebih menguntungkan.</p>
          <Link href="/admin/simulasi" className="btn ad-start-btn"><AICalc /><span>Buka Simulasi Jual</span><AIArrow /></Link>
        </div>
      </section>
    </>
  );
}
