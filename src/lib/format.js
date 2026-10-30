export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const angka = (n, digit = 0) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: digit }).format(Number(n) || 0);

export const tgl = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export const today = () => new Date().toISOString().slice(0, 10);
