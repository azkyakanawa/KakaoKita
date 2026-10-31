'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/components/RoleGuard';
import { angka, tgl } from '@/lib/format';
import { AILand } from '@/components/admin/AdminIcons';

export default function LahanSaya() {
  const profile = useProfile();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [muat, setMuat] = useState(true);

  useEffect(() => {
    supabase.from('lands').select('*').eq('petani_id', profile.id).order('created_at', { ascending: true })
      .then(({ data, error }) => { setMuat(false); if (error) setMsg(error.message); else setRows(data); });
  }, [profile.id]);

  const totalHa = rows.filter((r) => r.status === 'aktif').reduce((a, r) => a + Number(r.luas_ha), 0);

  return (
    <>
      <h1>Lahan Saya</h1>
      <div className="alert info">
        Data lahan didaftarkan dan diverifikasi oleh admin koperasi dan tidak bisa diubah dari akun petani.
        Jika ada data yang tidak sesuai, hubungi admin koperasi.
      </div>
      {msg && <div className="alert">{msg}</div>}
      {muat && <p className="muted">Memuat...</p>}
      {!muat && rows.length === 0 && <div className="card muted">Belum ada lahan yang didaftarkan untuk akun Anda.</div>}
      {rows.length > 0 && <p className="muted">Total lahan aktif: <strong>{angka(totalHa, 2)} Ha</strong></p>}

      {rows.map((l) => (
        <article className="card pt-lahan-card" key={l.id}>
          <div className="pt-lahan-foto">{l.foto_url ? <img src={l.foto_url} alt={`Foto ${l.nama}`} loading="lazy" /> : <AILand />}</div>
          <div>
            <h3 style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {l.nama} <span className={`pt-badge ${l.status === 'aktif' ? 'ok' : 'off'}`}>{l.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
            </h3>
            <dl>
              <dt>Lokasi</dt><dd>{[l.desa && `Desa ${l.desa}`, l.kecamatan && `Kec. ${l.kecamatan}`].filter(Boolean).join(', ') || '-'}</dd>
              <dt>Luas</dt><dd>{angka(l.luas_ha, 2)} Ha</dd>
              <dt>Jenis dokumen</dt><dd>{l.jenis_dokumen || 'Belum dicatat'}</dd>
              <dt>Nomor dokumen</dt><dd>{l.nomor_dokumen || '-'}</dd>
              {l.catatan && (<><dt>Catatan</dt><dd>{l.catatan}</dd></>)}
              <dt>Didaftarkan</dt><dd>{tgl(l.created_at)}</dd>
            </dl>
          </div>
        </article>
      ))}
    </>
  );
}
