import RoleGuard from '@/components/RoleGuard';
import PetaniShell from '@/components/petani/PetaniShell';

export default function PetaniLayout({ children }) {
  return (
    <RoleGuard role="petani">
      <PetaniShell>{children}</PetaniShell>
    </RoleGuard>
  );
}
