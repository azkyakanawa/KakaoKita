// Mengubah hasil rpc landing_harga() (urut terbaru dulu) menjadi ringkasan untuk kartu landing.
const HARI = 24 * 60 * 60 * 1000;

const hariKe = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export function ringkasHarga(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const terbaru = rows[0];
  const sebelumnya = rows[1] || null;
  const harga = Number(terbaru.harga);

  let persen = null;
  let arah = 'tetap';
  let pembanding = null;
  if (sebelumnya && Number(sebelumnya.harga) > 0) {
    const lama = Number(sebelumnya.harga);
    persen = ((harga - lama) / lama) * 100;
    arah = Math.abs(persen) < 0.05 ? 'tetap' : persen > 0 ? 'naik' : 'turun';
    const selisih = Math.round((hariKe(terbaru.tanggal) - hariKe(sebelumnya.tanggal)) / HARI);
    pembanding = selisih === 1 ? 'kemarin' : `${selisih} hari lalu`;
  }

  return {
    harga,
    tanggal: terbaru.tanggal,
    sumber: terbaru.sumber,
    simulasi: Boolean(terbaru.simulasi),
    persen,
    arah,
    pembanding,
    deret: rows.slice().reverse().map((r) => Number(r.harga)), // lama -> baru
  };
}
