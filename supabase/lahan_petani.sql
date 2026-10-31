-- =====================================================================
-- KakaoKita - Lahan petani + data petani yang bisa diedit admin
-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run.
-- Aman dijalankan ulang (memakai "if not exists" / "drop policy if exists").
--
-- Prinsip: lahan HANYA bisa ditambah, diubah, dan dihapus oleh admin
-- (karena memuat jenis dan nomor dokumen yang harus diverifikasi).
-- Petani hanya bisa MELIHAT lahan miliknya sendiri.
-- =====================================================================

-- 1. Kolom tambahan di profil petani --------------------------------
alter table public.profiles add column if not exists sapaan text;
alter table public.profiles add column if not exists alamat text;

alter table public.profiles drop constraint if exists profiles_sapaan_check;
alter table public.profiles add constraint profiles_sapaan_check
  check (sapaan is null or sapaan in ('Pak', 'Bu'));

-- 2. Tabel lahan -----------------------------------------------------
create table if not exists public.lands (
  id             uuid primary key default gen_random_uuid(),
  petani_id      uuid not null references public.profiles(id) on delete cascade,
  nama           text not null,
  desa           text,
  kecamatan      text,
  luas_ha        numeric(10,2) not null check (luas_ha > 0),
  status         text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  jenis_dokumen  text,
  nomor_dokumen  text,
  catatan        text,
  foto_url       text,
  foto_path      text,
  created_by     uuid default auth.uid(),
  created_at     timestamptz not null default now()
);

create index if not exists lands_petani_idx on public.lands (petani_id);

alter table public.lands enable row level security;

drop policy if exists "lands_select" on public.lands;
create policy "lands_select" on public.lands
  for select to authenticated using (petani_id = auth.uid() or public.is_admin());

drop policy if exists "lands_write" on public.lands;
create policy "lands_write" on public.lands
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3. Penyimpanan foto lahan (bucket "lahan") --------------------------
-- Bucket publik: foto bisa ditampilkan lewat tautan; hanya admin yang boleh
-- mengunggah, mengganti, atau menghapus.
insert into storage.buckets (id, name, public)
values ('lahan', 'lahan', true)
on conflict (id) do update set public = true;

drop policy if exists "lahan_admin_select" on storage.objects;
create policy "lahan_admin_select" on storage.objects
  for select to authenticated using (bucket_id = 'lahan' and public.is_admin());

drop policy if exists "lahan_admin_insert" on storage.objects;
create policy "lahan_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'lahan' and public.is_admin());

drop policy if exists "lahan_admin_update" on storage.objects;
create policy "lahan_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'lahan' and public.is_admin())
  with check (bucket_id = 'lahan' and public.is_admin());

drop policy if exists "lahan_admin_delete" on storage.objects;
create policy "lahan_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'lahan' and public.is_admin());
