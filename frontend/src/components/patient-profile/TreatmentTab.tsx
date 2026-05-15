'use client';

import { FileText } from 'lucide-react';

export default function TreatmentTab() {
  return (
    <div className="py-8 text-center">
      <FileText className="mx-auto h-12 w-12 text-gray-300" />
      <p className="mt-4 text-gray-500">No tienes tratamiento asignado actualmente.</p>
      <p className="mt-1 text-sm text-gray-400">
        Cuando un médico te asigne análisis o medicación, aparecerá aquí.
      </p>
    </div>
  );
}