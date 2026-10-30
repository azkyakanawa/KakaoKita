// Rumus Simulasi Jual (sesuai proposal):
//   harga efektif = harga tujuan x (1 - susut%)
//   harga bersih  = harga efektif - ongkir/kg - biaya lain/kg
//   selisih       = harga bersih - harga pengepul lokal
//   tambahan      = selisih x berat
export function hitungSimulasi({ berat, hargaTujuan, ongkir, biayaLain, susutPersen, hargaLokal }) {
  const n = (v) => Number(v) || 0;
  const hargaEfektif = n(hargaTujuan) * (1 - n(susutPersen) / 100);
  const hargaBersih = hargaEfektif - n(ongkir) - n(biayaLain);
  const selisih = hargaBersih - n(hargaLokal);
  return {
    hargaEfektif,
    hargaBersih,
    selisih,
    tambahan: selisih * n(berat),
    totalKolektif: hargaBersih * n(berat),
    totalLokal: n(hargaLokal) * n(berat),
    rekomendasi: selisih > 0 ? 'kolektif' : 'lokal',
  };
}
