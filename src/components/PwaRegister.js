'use client';
import { useEffect } from 'react';

// Mendaftarkan service worker. Hanya aktif pada versi production (npm run build / hosting).
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}
