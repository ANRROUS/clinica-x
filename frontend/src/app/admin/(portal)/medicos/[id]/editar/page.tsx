'use client';

import { use } from 'react';
import DoctorForm from '@/components/admin/DoctorForm';

export default function EditarMedicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <DoctorForm editId={id} />
      </div>
    </div>
  );
}