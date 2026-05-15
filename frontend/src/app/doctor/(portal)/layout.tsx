'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}