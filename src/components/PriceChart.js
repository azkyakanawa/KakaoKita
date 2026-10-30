import { rupiah, tgl } from '@/lib/format';

// Grafik garis sederhana (SVG) untuk harga kakao KERING: lokal vs tujuan.
export default function PriceChart({ entries }) {
  const W = 640, H = 260, P = { l: 70, r: 16, t: 16, b: 40 };
  const data = (entries || []).filter((e) => e.kondisi === 'kering');
  const sorted = [...data].sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(-40);
  const dates = [...new Set(sorted.map((e) => e.tanggal))];

  if (dates.length < 2) {
    return <p className="muted">Belum cukup data untuk grafik (minimal 2 tanggal harga kakao kering).</p>;
  }

  const vals = sorted.map((e) => Number(e.harga_per_kg));
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.1;
  min -= pad; max += pad;

  const x = (d) => P.l + (dates.indexOf(d) / (dates.length - 1)) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);

  const series = [
    { name: 'Harga lokal (pengepul)', jenis: 'lokal', color: '#B5651D' },
    { name: 'Harga tujuan (pembeli)', jenis: 'tujuan', color: '#2E7D32' },
  ].map((s) => ({ ...s, pts: sorted.filter((e) => e.jenis === s.jenis) }));

  const ticks = [0, 1, 2, 3].map((i) => min + ((max - min) * i) / 3);

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik tren harga kakao kering per kilogram">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#E3D5C4" />
            <text x={P.l - 6} y={y(t) + 4} fontSize="11" textAnchor="end" fill="#6B5B4E">
              {rupiah(t).replace('Rp', '').trim()}
            </text>
          </g>
        ))}
        {series.map((s) =>
          s.pts.length > 0 ? (
            <g key={s.jenis}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                points={s.pts.map((e) => `${x(e.tanggal)},${y(Number(e.harga_per_kg))}`).join(' ')}
              />
              {s.pts.map((e) => (
                <circle key={e.id} cx={x(e.tanggal)} cy={y(Number(e.harga_per_kg))} r="3.5" fill={s.color} />
              ))}
            </g>
          ) : null
        )}
        <text x={P.l} y={H - 12} fontSize="11" fill="#6B5B4E">{tgl(dates[0])}</text>
        <text x={W - P.r} y={H - 12} fontSize="11" textAnchor="end" fill="#6B5B4E">{tgl(dates[dates.length - 1])}</text>
      </svg>
      <div className="legend">
        {series.map((s) => (
          <span key={s.jenis}><span className="dot" style={{ background: s.color }} />{s.name}</span>
        ))}
      </div>
      <p className="muted">Harga per kg untuk kakao kering.</p>
    </div>
  );
}
