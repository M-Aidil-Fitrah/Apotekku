'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ApotekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['apoteker' as any, 'admin' as any]}>
      {children}
    </ProtectedRoute>
  );
}
