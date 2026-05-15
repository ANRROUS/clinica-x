'use client';

import DoctorForm from '@/components/admin/DoctorForm';

export default function EditarMedicoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <DoctorForm editId={id} />
      </div>
    </div>
  );
}