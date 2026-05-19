'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8">
        {children}
      </main>
    </div>
  );
}