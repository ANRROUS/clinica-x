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
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>('consultas');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ProfileHeader />
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-2">
          {activeTab === 'consultas' && <ConsultationsTab />}
          {activeTab === 'tratamiento' && <TreatmentTab />}
          {activeTab === 'reservas' && <AppointmentsTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
