'use client';

import DoctorForm from '@/components/admin/doctor-form/DoctorForm';

export default function EditarDoctorPage({ params }: { params: { id: string } }) {
  return <DoctorForm editId={params.id} />;
}