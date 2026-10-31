// Perhitungan untuk dashboard petani: panen per bulan, estimasi pendapatan, dan perubahan bulanan.
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const kunciBulan = (d) => String(d).slice(0, 7); // 'YYYY-MM'

export function daftarBulan(n, sekarang = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    out.push({ key, label: BULAN[d.getMonth()] });
  }
  return out;
}

// Total kg per bulan untuk n bulan terakhir (termasuk bulan yang kosong = 0)
export function panenPerBulan(harvests, n) {
  const map = {};
  for (const h of harvests) map[kunciBulan(h.tanggal)] = (map[kunciBulan(h.tanggal)] || 0) + Number(h.berat_kg);
  return daftarBulan(n).map((b) => ({ label: b.label, key: b.key, value: Math.round((map[b.key] || 0) * 100) / 100 }));
}

// Harga lokal kering yang berlaku pada tanggal tertentu (terbaru sebelum/pada tanggal itu;
// bila belum ada, pakai harga paling awal yang tercatat).
function hargaPada(hargaUrut, tanggal) {
  if (!hargaUrut.length) return null;
  let pilih = null;
  for (const p of hargaUrut) {
    if (p.tanggal <= tanggal) pilih = p; else break;
  }
  return Number((pilih || hargaUrut[0]).harga_per_kg);
}

// Estimasi pendapatan = berat panen x harga lokal kering pada tanggal panen.
export function estimasiPendapatan(harvests, hargaLokalKering) {
  const urut = [...hargaLokalKering].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  if (!urut.length) return { total: null, perBulan: {} };
  const perBulan = {};
  let total = 0;
  for (const h of harvests) {
    const nilai = Number(h.berat_kg) * hargaPada(urut, h.tanggal);
    total += nilai;
    perBulan[kunciBulan(h.tanggal)] = (perBulan[kunciBulan(h.tanggal)] || 0) + nilai;
  }
  return { total, perBulan };
}

// Persen perubahan bulan ini dibanding bulan lalu; null bila tidak ada pembanding.
export function persenBulanan(perBulan, sekarang = new Date()) {
  const [ini, lalu] = [daftarBulan(1, sekarang)[0].key, daftarBulan(2, sekarang)[0].key];
  const a = perBulan[ini] || 0;
  const b = perBulan[lalu] || 0;
  if (b <= 0) return null;
  return ((a - b) / b) * 100;
}

// Sapaan di dashboard: "Pak Budi" / "Bu Siti" (bila sapaan diisi admin), jika tidak "Budi Santoso" -> "Budi".
export function sapaNama(profile) {
  const depan = String(profile?.nama || '').trim().split(/\s+/)[0] || 'Petani';
  return profile?.sapaan ? `${profile.sapaan} ${depan}` : depan;
}
