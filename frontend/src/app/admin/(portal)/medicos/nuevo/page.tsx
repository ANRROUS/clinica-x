'use client';

import DoctorForm from '@/components/admin/DoctorForm';

export default function NuevoMedicoPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <DoctorForm />
      </div>
    </div>
  );
}