// Grafik garis + area untuk tren panen (kg per bulan). SVG murni, responsif.
function langkahBagus(maks) {
  const mentah = Math.max(maks, 1) / 3;
  const pangkat = Math.pow(10, Math.floor(Math.log10(mentah)));
  for (const k of [1, 2, 2.5, 5, 10]) if (k * pangkat >= mentah) return k * pangkat;
  return 10 * pangkat;
}

export default function TrenPanenChart({ data }) {
  const W = 800, H = 300, L = 58, R = 26, T = 18, B = 44;
  const n = data.length;
  const maks = Math.max(0, ...data.map((d) => d.value));
  const step = langkahBagus(maks);
  const yMax = step * 3;
  const pw = W - L - R, ph = H - T - B;
  const pad = n > 1 ? 10 : 0;
  const x = (i) => (n === 1 ? L + pw / 2 : L + pad + (i * (pw - pad * 2)) / (n - 1));
  const y = (v) => T + ph - (v / yMax) * ph;
  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const garis = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${garis} L${pts[n - 1][0].toFixed(1)} ${T + ph} L${pts[0][0].toFixed(1)} ${T + ph} Z`;
  const ticks = [0, 1, 2, 3].map((i) => i * step);
  const fmt = (v) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(v);
  const kosong = maks === 0;

  return (
    <svg className="pt-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Grafik panen ${n} bulan terakhir`}>
      <defs>
        <linearGradient id="ptArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9b476" stopOpacity=".55" />
          <stop offset="1" stopColor="#f6dcba" stopOpacity=".08" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#eadbc6" strokeWidth="1" />
          <text x={L - 12} y={y(t) + 5} textAnchor="end" fontSize="15" fill="#4a2a14">{fmt(t)}</text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={d.key}>
          <line x1={x(i)} x2={x(i)} y1={T} y2={T + ph} stroke="#f1e5d3" strokeWidth="1" />
          <text x={x(i)} y={H - 14} textAnchor="middle" fontSize="15" fill="#4a2a14">{d.label}</text>
        </g>
      ))}
      <line x1={L} x2={L} y1={T} y2={T + ph} stroke="#e3d2bb" strokeWidth="1.2" />
      <line x1={L} x2={W - R} y1={T + ph} y2={T + ph} stroke="#e3d2bb" strokeWidth="1.2" />
      {n > 1 && <path d={area} fill="url(#ptArea)" />}
      {n > 1 && <path d={garis} fill="none" stroke="#c98a3b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
      {pts.map((p, i) => (
        <circle key={data[i].key} cx={p[0]} cy={p[1]} r="5.5" fill="#a9631c" stroke="#fff" strokeWidth="2">
          <title>{`${data[i].label}: ${fmt(data[i].value)} kg`}</title>
        </circle>
      ))}
      {kosong && (
        <text x={W / 2} y={T + ph / 2} textAnchor="middle" fontSize="17" fill="#8a6a4e">Belum ada panen yang dicatat pada periode ini</text>
      )}
    </svg>
  );
}
