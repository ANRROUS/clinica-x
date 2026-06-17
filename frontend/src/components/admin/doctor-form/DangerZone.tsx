'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { toggleDoctorStatus } from '@/lib/api/admin.api';
import { getErrorMessage } from '@/lib/api/error-utils';

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
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  if (!isActive) return null;

  return (
    <>
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECACA' }}
      >
        <h3 className="text-sm font-bold uppercase" style={{ color: '#EF4444' }}>
          ZONA DE PELIGRO
        </h3>
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          Esta acción hará que el doctor pase a estado de inactivo y los pacientes no podrán reservar citas con él, como también el doctor pierde acceso a su portal.
        </p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: '#EF4444' }}
        >
          <Trash2 className="h-4 w-4" />
          Desactivar Médico
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
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: '#EF4444' }}
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