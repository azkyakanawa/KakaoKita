import RoleGuard from '@/components/RoleGuard';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="admin">
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
