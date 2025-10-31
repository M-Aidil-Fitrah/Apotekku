'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['admin' as UserRole]}>
      {children}
    </ProtectedRoute>
  );
}
