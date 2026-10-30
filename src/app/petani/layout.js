import RoleGuard from '@/components/RoleGuard';
import AppShell from '@/components/AppShell';

const links = [{ href: '/petani', label: 'Beranda Petani' }];

export default function PetaniLayout({ children }) {
  return (
    <RoleGuard role="petani">
      <AppShell links={links} subtitle="Petani">{children}</AppShell>
    </RoleGuard>
  );
}
