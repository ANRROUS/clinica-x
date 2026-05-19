'use client';

import { FileText, Upload } from 'lucide-react';

const ANALYSIS_LIST = [
  { name: 'Hemograma completo' },
  { name: 'Exámen de orina' },
];

const MEDICATIONS = [
  { name: 'Paracetamol', days: 5, time: '8hrs.' },
  { name: 'Paracetamol', days: 10, time: '12hrs.' },
  { name: 'Paracetamol', days: 7, time: '8hrs.' },
];

export default function TreatmentTab() {
  return (
    <div className="space-y-10 px-2">
      {/* Análisis a realizar */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Análisis a realizar:</h3>
        <p className="mt-1 text-sm text-gray-600">
          El doctor en tu última consulta te ha asignado realizarze los siguientes análisis, puedes reservar o subirlo en PDF
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {ANALYSIS_LIST.map((analysis) => (
            <div
              key={analysis.name}
              className="flex flex-col items-center rounded-xl border-2 border-[#008585] bg-white p-6"
            >
              <p className="text-lg font-semibold text-gray-900">{analysis.name}</p>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg bg-[#008585] px-6 py-2 text-sm font-medium text-white hover:bg-[#007070] transition">
                  Reservar
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-[#008585] px-6 py-2 text-sm font-medium text-white hover:bg-[#007070] transition">
                  Subir
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medicación actual */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Medicación actual:</h3>
        <p className="mt-1 text-sm text-gray-600">
          El doctor en tu última consulta te ha asignado la siguienta medicacón:
        </p>

        <div className="mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#008585]">
                <th className="px-4 py-3 text-left font-semibold text-[#008585]">Nombre</th>
                <th className="px-4 py-3 text-center font-semibold text-[#008585]">N° Días</th>
                <th className="px-4 py-3 text-center font-semibold text-[#008585]">Hora</th>
              </tr>
            </thead>
            <tbody>
              {MEDICATIONS.map((med, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-4 py-4 text-gray-800">{med.name}</td>
                  <td className="px-4 py-4 text-center text-gray-800">{med.days}</td>
                  <td className="px-4 py-4 text-center text-gray-800">{med.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
