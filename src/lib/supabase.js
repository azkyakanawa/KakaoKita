import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Nilai cadangan mencegah error saat build jika .env.local belum diisi.
export const configured = Boolean(url && key);
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key'
);

// Klien sementara tanpa menyimpan sesi. Dipakai admin untuk membuatkan akun petani
// (signUp) tanpa mengganti sesi admin yang sedang login.
export function buatKlienSementara() {
  return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
