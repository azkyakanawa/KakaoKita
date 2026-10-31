import './globals.css';
import PwaRegister from '@/components/PwaRegister';

export const metadata = {
  title: 'KakaoKita - Koperasi Kakao Digital',
  description: 'Pantau harga, catat panen, dan hitung penjualan kolektif kelompok tani kakao di Lampung.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: 'KakaoKita', statusBarStyle: 'default' },
};

export const viewport = {
  themeColor: '#3E2A1E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
