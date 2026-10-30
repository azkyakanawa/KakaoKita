-- =====================================================================
-- DATA CONTOH (SIMULASI) - opsional, hanya untuk demo.
-- Semua baris diberi tanda is_simulasi = true. Angka di bawah BUKAN data
-- nyata; ganti dengan data dari koperasi/pengepul/ekspedisi yang sebenarnya.
-- =====================================================================
insert into public.price_entries (tanggal, lokasi, jenis, kondisi, harga_per_kg, sumber, is_simulasi) values
  (current_date - 28, 'Pengepul lokal (contoh)', 'lokal',  'kering', 68000, 'Data simulasi', true),
  (current_date - 21, 'Pengepul lokal (contoh)', 'lokal',  'kering', 70000, 'Data simulasi', true),
  (current_date - 14, 'Pengepul lokal (contoh)', 'lokal',  'kering', 72000, 'Data simulasi', true),
  (current_date - 7,  'Pengepul lokal (contoh)', 'lokal',  'kering', 71000, 'Data simulasi', true),
  (current_date,      'Pengepul lokal (contoh)', 'lokal',  'kering', 73000, 'Data simulasi', true),
  (current_date - 28, 'Tujuan A (contoh)',       'tujuan', 'kering', 76000, 'Data simulasi', true),
  (current_date - 21, 'Tujuan A (contoh)',       'tujuan', 'kering', 78000, 'Data simulasi', true),
  (current_date - 14, 'Tujuan A (contoh)',       'tujuan', 'kering', 79000, 'Data simulasi', true),
  (current_date - 7,  'Tujuan A (contoh)',       'tujuan', 'kering', 78500, 'Data simulasi', true),
  (current_date,      'Tujuan A (contoh)',       'tujuan', 'kering', 80000, 'Data simulasi', true);

insert into public.buyers (nama, kota_tujuan, harga_penawaran, sumber, is_simulasi) values
  ('Pembeli A (contoh)', 'Kota Tujuan A', 80000, 'Data simulasi', true),
  ('Pembeli B (contoh)', 'Kota Tujuan B', 78000, 'Data simulasi', true);

insert into public.shipping_rates (asal, tujuan, tarif_per_kg, sumber, is_simulasi) values
  ('Lampung', 'Kota Tujuan A', 1500, 'Data simulasi', true),
  ('Lampung', 'Kota Tujuan B', 1200, 'Data simulasi', true);

insert into public.announcements (judul, isi) values
  ('Selamat datang di KakaoKita', 'Ini adalah pengumuman contoh. Data harga pada versi prototipe adalah data simulasi.');
