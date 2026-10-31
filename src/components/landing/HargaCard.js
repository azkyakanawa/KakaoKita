'use client';
import { useEffect, useState } from 'react';
import { supabase, configured } from '@/lib/supabase';
import { ringkasHarga } from '@/lib/harga';
import { angka, tgl } from '@/lib/format';
import Sparkline from './Sparkline';
import { IconTrend } from './Icons';

// Kartu "Harga Kakao Hari Ini": datanya dari harga lokal (kering) terbaru yang diinput admin.
export default function HargaCard() {
  const [state, setState] = useState('loading'); // loading | ok | kosong | error
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!configured) { setState('error'); return; }
      const { data, error } = await supabase.rpc('landing_harga');
      if (!alive) return;
      if (error) { setState('error'); return; }
      const r = ringkasHarga(data);
      if (!r) { setState('kosong'); return; }
      setInfo(r);
      setState('ok');
    })();
    return () => { alive = false; };
  }, []);

  const tanda = info?.arah === 'naik' ? '▲' : info?.arah === 'turun' ? '▼' : '■';
  const persenTeks = info?.persen == null ? null : `${info.persen > 0 ? '+' : ''}${angka(info.persen, 1)}%`;

  return (
    <article className="lp-card lp-stat lp-stat-harga" aria-live="polite">
      <span className="lp-circle"><IconTrend /></span>
      <div className="lp-stat-body">
        <h3>Harga Kakao Hari Ini</h3>

        {state === 'loading' && <p className="lp-harga-note">Memuat harga terbaru...</p>}

        {state === 'kosong' && <p className="lp-harga-note">Belum ada harga yang diinput admin.</p>}

        {state === 'error' && <p className="lp-harga-note">Harga belum bisa ditampilkan. Coba muat ulang.</p>}

        {state === 'ok' && (
          <>
            <p className="lp-price">Rp {angka(info.harga)} <small>/kg</small></p>
            {info.persen == null ? (
              <p className="lp-harga-note">Belum ada harga pembanding</p>
            ) : (
              <p className={`lp-up ${info.arah}`}>
                <span aria-hidden="true">{tanda}</span>{' '}
                {info.arah === 'tetap' ? 'Tetap' : persenTeks} dari {info.pembanding}
              </p>
            )}
            <p className="lp-harga-meta">
              {tgl(info.tanggal)}
              {info.simulasi ? ' · Data simulasi' : ` · ${info.sumber}`}
            </p>
          </>
        )}
      </div>
      {state === 'ok' && info.deret.length >= 2 && <Sparkline className="lp-spark" data={info.deret} />}
    </article>
  );
}
