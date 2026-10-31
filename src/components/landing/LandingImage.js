'use client';
import { useEffect, useRef, useState } from 'react';

// Slot gambar. Letakkan file di public/images/landing/<nama-file> lalu muncul otomatis.
// - Jika file belum ada dan ada `fallback`, tampil fallback tersebut.
// - Jika belum ada dan `decor` (hiasan), tidak tampil apa-apa.
// - Jika belum ada (mode dev), tampil kotak putus-putus berisi nama file agar mudah dicari.
export default function LandingImage({ file, alt = '', className = '', fallback = null, decor = false }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const src = `/images/landing/${file}`;

  // Gambar bisa gagal dimuat sebelum React aktif (saat render dari server),
  // jadi cek ulang setelah halaman tampil.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    if (fallback) return <span className={`lp-img-fallback ${className}`}>{fallback}</span>;
    if (decor || process.env.NODE_ENV === 'production') return null;
    return (
      <span className={`lp-img-slot ${className}`} role="img" aria-label={`Gambar belum ada: ${file}`}>
        <span>{file}</span>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} onError={() => setFailed(true)} draggable={false} />;
}
