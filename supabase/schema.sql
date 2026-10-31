-- =====================================================================
-- KakaoKita - skema database (jalankan di Supabase -> SQL Editor)
-- =====================================================================

-- 1. PROFIL PENGGUNA (satu baris per akun login) ----------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nama       text not null,
  kontak     text,
  role       text not null default 'petani' check (role in ('admin', 'petani')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Profil dibuat otomatis saat akun baru mendaftar. Peran SELALU 'petani';
-- admin pertama ditetapkan manual lewat SQL (lihat README).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, kontak, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nama', ''), split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'kontak',
    'petani'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fungsi bantu: apakah pengguna saat ini admin aktif?
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

-- 2. TABEL DATA ---------------------------------------------------------
create table if not exists public.price_entries (
  id           uuid primary key default gen_random_uuid(),
  tanggal      date not null default current_date,
  lokasi       text not null,
  jenis        text not null check (jenis in ('lokal', 'tujuan')),
  kondisi      text not null default 'kering' check (kondisi in ('kering', 'basah')),
  harga_per_kg numeric not null check (harga_per_kg >= 0),
  sumber       text not null,
  is_simulasi  boolean not null default false,
  created_by   uuid default auth.uid(),
  created_at   timestamptz not null default now()
);

create table if not exists public.harvests (
  id         uuid primary key default gen_random_uuid(),
  petani_id  uuid not null references public.profiles(id) on delete cascade,
  tanggal    date not null default current_date,
  berat_kg   numeric not null check (berat_kg > 0),
  kualitas   text not null default 'baik' check (kualitas in ('baik', 'sedang', 'kurang')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.buyers (
  id              uuid primary key default gen_random_uuid(),
  nama            text not null,
  kota_tujuan     text not null,
  harga_penawaran numeric not null check (harga_penawaran >= 0),
  sumber          text not null,
  tanggal         date not null default current_date,
  is_simulasi     boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists public.shipping_rates (
  id           uuid primary key default gen_random_uuid(),
  asal         text not null,
  tujuan       text not null,
  tarif_per_kg numeric not null check (tarif_per_kg >= 0),
  sumber       text not null,
  tanggal      date not null default current_date,
  is_simulasi  boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  judul      text not null,
  isi        text not null,
  created_at timestamptz not null default now()
);

-- 3. KEAMANAN (Row Level Security) -------------------------------------
alter table public.profiles        enable row level security;
alter table public.price_entries   enable row level security;
alter table public.harvests        enable row level security;
alter table public.buyers          enable row level security;
alter table public.shipping_rates  enable row level security;
alter table public.announcements   enable row level security;

-- profiles: pengguna melihat profil sendiri; admin melihat dan mengubah semua
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- price_entries: semua pengguna login boleh melihat; hanya admin yang menulis
drop policy if exists "price_select" on public.price_entries;
create policy "price_select" on public.price_entries
  for select to authenticated using (true);
drop policy if exists "price_write" on public.price_entries;
create policy "price_write" on public.price_entries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- harvests: petani hanya melihat panennya sendiri; admin penuh
drop policy if exists "harvest_select" on public.harvests;
create policy "harvest_select" on public.harvests
  for select to authenticated using (petani_id = auth.uid() or public.is_admin());
drop policy if exists "harvest_write" on public.harvests;
create policy "harvest_write" on public.harvests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- buyers dan shipping_rates: hanya admin (petani tidak melihat data pembeli)
drop policy if exists "buyers_admin" on public.buyers;
create policy "buyers_admin" on public.buyers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "rates_admin" on public.shipping_rates;
create policy "rates_admin" on public.shipping_rates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- announcements: semua pengguna login membaca; admin menulis
drop policy if exists "ann_select" on public.announcements;
create policy "ann_select" on public.announcements
  for select to authenticated using (true);
drop policy if exists "ann_write" on public.announcements;
create policy "ann_write" on public.announcements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4. HARGA PUBLIK UNTUK LANDING PAGE ------------------------------------
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
