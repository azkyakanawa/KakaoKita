'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import { rupiah, angka, tgl } from '@/lib/format';
import { panenPerBulan, estimasiPendapatan, persenBulanan, sapaNama, kunciBulan } from '@/lib/petani';
import TrenPanenChart from '@/components/petani/TrenPanenChart';
import { IconSprout, IconCoins } from '@/components/landing/Icons';
import { AIPod, AIBars, AICalendar, AIPin, AILand, AIChevronRight, AIArrow, AIMegaphone } from '@/components/admin/AdminIcons';

function Delta({ nilai, satuan = '%', kosong }) {
  if (nilai == null) return <p className="pt-delta flat">{kosong}</p>;
  const naik = nilai >= 0;
  const teks = satuan === '%' ? `${angka(Math.abs(nilai), 0)}%` : `${angka(Math.abs(nilai), 2)} ${satuan}`;
  return <p className={`pt-delta ${naik ? 'up' : 'down'}`}>{naik ? '↑ +' : '↓ -'}{teks}</p>;
}

export default function PetaniBeranda() {
  const profile = useProfile();
  const [harvests, setHarvests] = useState([]);
  const [lands, setLands] = useState([]);
  const [harga, setHarga] = useState([]);
  const [ann, setAnn] = useState([]);
  const [msg, setMsg] = useState('');
  const [muat, setMuat] = useState(true);
  const [bulan, setBulan] = useState(6);

  useEffect(() => {
    async function load() {
      const [h, l, p, a] = await Promise.all([
        supabase.from('harvests').select('*').eq('petani_id', profile.id).order('tanggal', { ascending: false }),
        supabase.from('lands').select('*').eq('petani_id', profile.id).order('created_at', { ascending: true }),
        supabase.from('price_entries').select('tanggal, harga_per_kg, sumber, is_simulasi, created_at')
          .eq('jenis', 'lokal').eq('kondisi', 'kering').order('tanggal', { ascending: false }).limit(1000),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(2),
      ]);
      setMuat(false);
      const err = h.error || l.error || p.error || a.error;
      if (err) { setMsg(err.message); return; }
      setHarvests(h.data); setLands(l.data); setHarga(p.data); setAnn(a.data);
    }
    load();
  }, [profile.id]);

  const ringkas = useMemo(() => {
    const aktif = lands.filter((x) => x.status === 'aktif');
    const totalHa = aktif.reduce((s, x) => s + Number(x.luas_ha), 0);
    const bulanIni = new Date().toISOString().slice(0, 7);
    const tambahHa = aktif.filter((x) => kunciBulan(x.created_at) === bulanIni).reduce((s, x) => s + Number(x.luas_ha), 0);
    const totalKg = harvests.reduce((s, r) => s + Number(r.berat_kg), 0);
    const perBulanKg = {};
    for (const r of harvests) perBulanKg[kunciBulan(r.tanggal)] = (perBulanKg[kunciBulan(r.tanggal)] || 0) + Number(r.berat_kg);
    const pend = estimasiPendapatan(harvests, harga);
    return { aktif, totalHa, tambahHa, totalKg, persenKg: persenBulanan(perBulanKg), pend, persenRp: persenBulanan(pend.perBulan) };
  }, [lands, harvests, harga]);

  const data = useMemo(() => panenPerBulan(harvests, bulan), [harvests, bulan]);
  const hargaTerbaru = harga[0];
  const daftarLahan = lands.slice(0, 2);

  return (
    <>
      <section className="pt-greet">
        <IconSprout className="pt-sprout" />
        <div>
          <h1>Halo, {sapaNama(profile)}!</h1>
          <p>Selamat datang di KakaoKita</p>
          <span className="pt-greet-line" aria-hidden="true" />
        </div>
      </section>

      {msg && <div className="alert">{msg}</div>}

      <section className="pt-stats" aria-label="Ringkasan">
        <article className="pt-stat">
          <span className="pt-ico green"><IconSprout /></span>
          <div>
            <h2>Total Lahan</h2>
            <p className="pt-val">{muat ? '...' : `${angka(ringkas.totalHa, 2)} Ha`}</p>
            {ringkas.tambahHa > 0
              ? <Delta nilai={ringkas.tambahHa} satuan="Ha" />
              : <p className="pt-delta flat">{ringkas.aktif.length} lahan aktif</p>}
          </div>
        </article>

        <article className="pt-stat">
          <span className="pt-ico orange"><AIPod /></span>
          <div>
            <h2>Total Panen</h2>
            <p className="pt-val">{muat ? '...' : `${angka(ringkas.totalKg, 1)} Kg`}</p>
            <Delta nilai={ringkas.persenKg} kosong="Belum ada pembanding bulan lalu" />
          </div>
        </article>

        <article className="pt-stat">
          <span className="pt-ico yellow"><IconCoins /></span>
          <div>
            <h2>Total Pendapatan <small>(estimasi)</small></h2>
            <p className="pt-val">{muat ? '...' : ringkas.pend.total == null ? '-' : rupiah(ringkas.pend.total)}</p>
            <Delta nilai={ringkas.persenRp} kosong={ringkas.pend.total == null ? 'Belum ada data harga' : 'Berat panen × harga lokal'} />
          </div>
        </article>
      </section>

      <div className="pt-cols">
        <div className="pt-col-main">
          <section className="pt-card">
            <div className="pt-card-head">
              <h2><AIBars /><span>Tren Panen</span></h2>
              <select className="pt-select" value={bulan} onChange={(e) => setBulan(Number(e.target.value))} aria-label="Rentang waktu">
                <option value={3}>3 Bulan Terakhir</option>
                <option value={6}>6 Bulan Terakhir</option>
                <option value={12}>12 Bulan Terakhir</option>
              </select>
            </div>
            <div className="pt-chart-wrap"><TrenPanenChart data={data} /></div>
          </section>

          <section className="pt-card">
            <div className="pt-card-head">
              <h2><AIPin /><span>Lahan Saya</span></h2>
              {lands.length > 2 && <Link href="/petani/lahan" className="pt-more">Lihat semua ({lands.length})</Link>}
            </div>
            {!muat && lands.length === 0 && (
              <p className="pt-empty">Belum ada data lahan. Lahan didaftarkan oleh admin koperasi setelah dokumen dicek. Hubungi admin bila lahan Anda belum terdaftar.</p>
            )}
            {daftarLahan.map((l) => (
              <div className="pt-lahan" key={l.id}>
                <div className="pt-lahan-foto">{l.foto_url ? <img src={l.foto_url} alt={`Foto ${l.nama}`} loading="lazy" /> : <AILand />}</div>
                <div className="pt-lahan-info">
                  <h3>{l.nama} <span className={`pt-badge ${l.status === 'aktif' ? 'ok' : 'off'}`}>{l.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></h3>
                  <p><AIPin />{[l.desa && `Desa ${l.desa}`, l.kecamatan && `Kec. ${l.kecamatan}`].filter(Boolean).join(', ') || 'Lokasi belum diisi'}</p>
                  <p><AILand />Luas : {angka(l.luas_ha, 2)} Ha</p>
                </div>
                <Link href="/petani/lahan" className="pt-detail-btn"><span>Lihat Detail</span><AIArrow /></Link>
              </div>
            ))}
          </section>
        </div>

        <aside className="pt-col-side">
          <section className="pt-card">
            <div className="pt-card-head"><h2><AICalendar /><span>Informasi Terbaru</span></h2></div>
            {!muat && !hargaTerbaru && ann.length === 0 && <p className="pt-empty">Belum ada informasi terbaru.</p>}
            {hargaTerbaru && (
              <Link href="/petani/informasi" className="pt-info">
                <span className="pt-info-ico"><AIBars /></span>
                <div>
                  <p className="pt-info-t">Harga Kakao Hari Ini</p>
                  <p className="pt-info-v">{rupiah(hargaTerbaru.harga_per_kg)} / Kg</p>
                </div>
                <time>{tgl(hargaTerbaru.tanggal)}</time>
                <AIChevronRight />
              </Link>
            )}
            {ann.map((a) => (
              <Link href="/petani/informasi" className="pt-info" key={a.id}>
                <span className="pt-info-ico alt"><AIMegaphone /></span>
                <div><p className="pt-info-t">Pengumuman</p><p className="pt-info-v small">{a.judul}</p></div>
                <time>{tgl(a.created_at)}</time>
                <AIChevronRight />
              </Link>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
