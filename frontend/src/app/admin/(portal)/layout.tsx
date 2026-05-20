'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated, hydrate } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, _hasHydrated]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <AdminHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8">
        {children}
      </main>
    </div>
  );
}