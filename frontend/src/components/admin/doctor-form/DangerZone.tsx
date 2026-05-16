'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { toggleDoctorStatus } from '@/lib/api/admin.api';

interface DangerZoneProps {
  doctorId: string;
  doctorName: string;
  isActive: boolean;
}

export default function DangerZone({ doctorId, doctorName, isActive }: DangerZoneProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const deactivateMutation = useMutation({
    mutationFn: () => toggleDoctorStatus(doctorId, false),
    onSuccess: () => {
      toast.success('Médico desactivado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/dashboard');
    },
    onError: () => {
      toast.error('No se pudo desactivar el médico.');
    },
  });

  if (!isActive) return null;

  return (
    <>
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-sm font-semibold text-red-800">Zona de peligro</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">
          Esta acción no se puede deshacer fácilmente. Al desactivar al médico, sus citas futuras
          permanecerán en el sistema pero no aparecerá disponible para nuevas reservas.
        </p>
        <p className="mt-1 text-sm text-red-700">
          Puedes revertir esta acción activando el toggle en el Dashboard.
        </p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          🗑 Desactivar Médico
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">¿Desactivar médico?</h3>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que deseas desactivar al Dr. {doctorName}? Sus citas futuras permanecerán
              en el sistema pero el médico no aparecerá disponible para nuevas reservas.
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Esta acción puede revertirse activando el toggle en el Dashboard.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => deactivateMutation.mutate()}
                disabled={deactivateMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deactivateMutation.isPending ? 'Desactivando...' : 'Sí, desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}