// Grafik mini naik (area + garis) untuk kartu "Harga Kakao Hari Ini".
// Ubah deretan angka di `data` jika ingin bentuk yang lain.
export default function Sparkline({ data = [8, 10, 7, 11, 9, 13, 12, 16, 14, 18, 17, 22, 19, 26, 24, 30, 27, 34, 31, 38], className = '' }) {
  const W = 300, H = 90, P = 6;
  const min = Math.min(...data), max = Math.max(...data);
  const x = (i) => P + (i / (data.length - 1)) * (W - P * 2);
  const y = (v) => H - P - ((v - min) / (max - min)) * (H - P * 2);
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const line = pts.join(' ');
  const area = `${P},${H} ${line} ${W - P},${H}`;
  const last = data.length - 1;
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Grafik harga kakao naik">
      <defs>
        <linearGradient id="lpSpark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6DAE3A" stopOpacity=".38" />
          <stop offset="1" stopColor="#6DAE3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lpSpark)" />
      <polyline points={line} fill="none" stroke="#4C8A26" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={x(last)} cy={y(data[last])} r="4" fill="#fff" stroke="#4C8A26" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
