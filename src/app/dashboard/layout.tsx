'use client';

import { AuthProvider } from '@/components/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
