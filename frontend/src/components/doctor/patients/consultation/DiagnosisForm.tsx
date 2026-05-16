'use client';

import { FileText } from 'lucide-react';

interface DiagnosisFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DiagnosisForm({ value, onChange }: DiagnosisFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-900">Diagnóstico</h3>
      </div>
      <p className="mb-3 text-sm text-gray-500">Ingresa el diagnóstico del paciente</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="El paciente presentó ..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        rows={5}
      />
    </div>
  );
}
