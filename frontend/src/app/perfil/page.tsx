'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfileHeader from '@/components/patient-profile/ProfileHeader';
import ProfileTabs from '@/components/patient-profile/ProfileTabs';
import ConsultationsTab from '@/components/patient-profile/ConsultationsTab';
import TreatmentTab from '@/components/patient-profile/TreatmentTab';
import AppointmentsTab from '@/components/patient-profile/AppointmentsTab';
import { useAuthStore } from '@/store/useAuthStore';

type TabKey = 'consultas' | 'tratamiento' | 'reservas';

export default function PerfilPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>('consultas');

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, _hasHydrated]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ProfileHeader />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-56">
            <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
          </aside>
          <div className="flex-1">
            {activeTab === 'consultas' && <ConsultationsTab />}
            {activeTab === 'tratamiento' && <TreatmentTab />}
            {activeTab === 'reservas' && <AppointmentsTab />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
