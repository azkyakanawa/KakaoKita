import RoleGuard from '@/components/RoleGuard';
import AppShell from '@/components/AppShell';

const links = [
  { href: '/admin', label: 'Ringkasan' },
  { href: '/admin/anggota', label: 'Anggota' },
  { href: '/admin/harga', label: 'Harga' },
  { href: '/admin/panen', label: 'Panen' },
  { href: '/admin/pembeli', label: 'Pembeli & Tarif' },
  { href: '/admin/simulasi', label: 'Simulasi Jual' },
  { href: '/admin/pengumuman', label: 'Pengumuman' },
];

export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="admin">
      <AppShell links={links} subtitle="Kepala Koperasi">{children}</AppShell>
    </RoleGuard>
  );
}
