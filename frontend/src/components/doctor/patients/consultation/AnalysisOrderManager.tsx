'use client';

import { useState } from 'react';
import { Plus, X, FlaskConical } from 'lucide-react';
import type { AnalysisOrder } from '@/store/useConsultationStore';
import { getAnalisisDisplayName } from '@/lib/utils';

interface AnalysisOrderManagerProps {
  orders: AnalysisOrder[];
  onAdd: (order: AnalysisOrder) => void;
  onRemove: (index: number) => void;
}

export default function AnalysisOrderManager({ orders, onAdd, onRemove }: AnalysisOrderManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [examName, setExamName] = useState('SANGRE');

  const handleAdd = () => {
    if (!examName.trim()) return;
    onAdd({ examName: examName.trim() });
    setExamName('SANGRE');
    setShowForm(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-brand-500" />
          <h3 className="text-lg font-bold text-gray-900">Análisis Clínico</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
      <p className="mb-3 text-sm text-gray-500">
        En caso tu paciente requiera análisis, selecciona cuáles tiene que realizarse
      </p>

      {showForm && (
        <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-700">Nombre del análisis</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="SANGRE">Análisis de Sangre</option>
                <option value="ORINA">Análisis de Orina</option>
                <option value="HECES">Análisis de Heces</option>
              </select>
            </div>
            <button
              onClick={handleAdd}
              disabled={!examName.trim()}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {orders.map((order, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3 py-1.5 text-sm font-medium text-brand-700"
            >
              {getAnalisisDisplayName(order.examName)}
              <button
                onClick={() => onRemove(index)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
