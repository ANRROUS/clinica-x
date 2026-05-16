'use client';

import { useState } from 'react';
import { Plus, Trash2, Pill } from 'lucide-react';
import type { Medication } from '@/store/useConsultationStore';

interface MedicationTableProps {
  medications: Medication[];
  onAdd: (med: Medication) => void;
  onRemove: (index: number) => void;
}

export default function MedicationTable({ medications, onAdd, onRemove }: MedicationTableProps) {
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const [frequency, setFrequency] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim() || !days || !frequency.trim()) return;
    onAdd({
      name: name.trim(),
      days: parseInt(days, 10),
      frequency: frequency.trim(),
    });
    setName('');
    setDays('');
    setFrequency('');
    setShowForm(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Medicamentos</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
      <p className="mb-3 text-sm text-gray-500">
        Ingresa las instrucciones de los medicamentos, días y horas para el paciente
      </p>

      {showForm && (
        <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Paracetamol"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="w-20">
              <label className="mb-1 block text-xs font-medium text-gray-700">Días</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="5"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block text-xs font-medium text-gray-700">Frecuencia</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="8 hrs."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !days || !frequency.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {medications.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-2.5 text-left text-sm font-semibold">Nombre</th>
                <th className="px-4 py-2.5 text-left text-sm font-semibold">Días</th>
                <th className="px-4 py-2.5 text-left text-sm font-semibold">Frecuencia</th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <tr
                  key={index}
                  className={`group border-t border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{med.name}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{med.days}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{med.frequency}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => onRemove(index)}
                      className="rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
