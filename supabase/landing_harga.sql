-- =====================================================================
-- Harga untuk landing page (publik, hanya-baca)
-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run.
--
-- Tabel price_entries tetap tertutup (RLS). Pengunjung yang belum login
-- hanya bisa memanggil fungsi ini, yang mengembalikan harga lokal kering
-- (satu baris per tanggal, 30 tanggal terbaru) dan tidak membuka data lain.
-- =====================================================================
create or replace function public.landing_harga()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with per_hari as (
    select distinct on (tanggal)
           tanggal, harga_per_kg, sumber, lokasi, is_simulasi
    from public.price_entries
    where jenis = 'lokal' and kondisi = 'kering'
    order by tanggal desc, created_at desc
    limit 30
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'tanggal',  tanggal,
        'harga',    harga_per_kg,
        'sumber',   sumber,
        'lokasi',   lokasi,
        'simulasi', is_simulasi
      ) order by tanggal desc
    ),
    '[]'::jsonb
  )
  from per_hari;
$$;

revoke all on function public.landing_harga() from public;
grant execute on function public.landing_harga() to anon, authenticated;
