// Mengecilkan foto di browser sebelum diunggah (maks. sisi 1280px, JPEG) agar hemat kuota dan penyimpanan.
export const BATAS_FOTO_MB = 8;

export async function kecilkanFoto(file, maxSide = 1280, kualitas = 0.82) {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar (JPG, PNG, atau WebP).');
  if (file.size > BATAS_FOTO_MB * 1024 * 1024) throw new Error(`Ukuran foto maksimal ${BATAS_FOTO_MB} MB.`);

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('Foto tidak bisa dibaca. Coba file lain.'));
      i.src = url;
    });
    const skala = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.round(img.width * skala);
    const h = Math.round(img.height * skala);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', kualitas));
    if (!blob) throw new Error('Gagal memproses foto.');
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
