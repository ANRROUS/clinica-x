'use client';

import { createPortal } from 'react-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface FinalizeConsultationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function FinalizeConsultationModal({
  onConfirm,
  onCancel,
  loading,
}: FinalizeConsultationModalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-500" />
            <p className="text-sm font-medium text-gray-700">Finalizando consulta...</p>
          </div>
        )}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Finalizar consulta</h3>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          ¿Confirmas finalizar la consulta? Una vez finalizada no podrás editarla.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
