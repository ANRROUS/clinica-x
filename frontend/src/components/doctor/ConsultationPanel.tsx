'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stethoscope, FileText, MessageSquare } from 'lucide-react';
import { startConsultation, finalizeConsultation } from '@/lib/api/doctor.api';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

const finalizeSchema = z.object({
  diagnostico: z.string().min(3, 'El diagnóstico es requerido (mínimo 3 caracteres)'),
  notas: z.string().optional(),
});

type FinalizeForm = z.infer<typeof finalizeSchema>;

interface ConsultationPanelProps {
  activeConsultation: ConsultaMedicoDTO | null;
  pacienteId: string;
  citaId?: string;
  pacienteNombre?: string;
  onConsultationStarted: (consulta: ConsultaMedicoDTO) => void;
  onConsultationFinalized: () => void;
}

export default function ConsultationPanel({
  activeConsultation,
  pacienteId,
  citaId,
  pacienteNombre,
  onConsultationStarted,
  onConsultationFinalized,
}: ConsultationPanelProps) {
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);
  const [motivo, setMotivo] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FinalizeForm>({
    resolver: zodResolver(finalizeSchema),
  });

  const startMutation = useMutation({
    mutationFn: startConsultation,
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success('Consulta iniciada');
        onConsultationStarted(res.data);
      } else {
        toast.error(res.error?.mensaje || 'No se pudo iniciar la consulta');
      }
    },
    onError: () => {
      toast.error('Error al iniciar consulta');
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { diagnostico: string; notas?: string } }) =>
      finalizeConsultation(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Consulta finalizada correctamente');
        onConsultationFinalized();
        queryClient.invalidateQueries({ queryKey: ['doctor-calendar'] });
      } else {
        toast.error(res.error?.mensaje || 'Error al finalizar consulta');
      }
    },
    onError: () => {
      toast.error('Error al finalizar consulta');
    },
  });

  const handleStart = () => {
    setStarting(true);
    startMutation.mutate({
      pacienteId,
      citaId,
      motivoConsulta: motivo || undefined,
    });
  };

  const handleFinalize = (data: FinalizeForm) => {
    if (!activeConsultation) return;
    finalizeMutation.mutate({
      id: activeConsultation.id,
      data: { diagnostico: data.diagnostico, notas: data.notas },
    });
  };

  if (!activeConsultation) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <Stethoscope className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Iniciar Consulta</h3>
            <p className="text-sm text-gray-500">Paciente: {pacienteNombre || pacienteId}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Motivo de consulta (opcional)</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el motivo de la consulta..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            rows={3}
          />
        </div>

        <button
          onClick={handleStart}
          disabled={startMutation.isPending}
          className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {startMutation.isPending ? 'Iniciando...' : 'Iniciar Consulta'}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Stethoscope className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Consulta Activa</h3>
          <p className="text-sm text-amber-700">
            En atención — {pacienteNombre || pacienteId}
          </p>
        </div>
      </div>

      {activeConsultation.motivoConsulta && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-white p-3">
          <p className="text-xs font-medium text-gray-500">Motivo</p>
          <p className="text-sm text-gray-800">{activeConsultation.motivoConsulta}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFinalize)} className="space-y-4">
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Diagnóstico
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Ingrese el diagnóstico..."
            rows={4}
            {...register('diagnostico')}
          />
          {errors.diagnostico && <p className="mt-1 text-xs text-red-500">{errors.diagnostico.message}</p>}
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <MessageSquare className="h-4 w-4" />
            Notas adicionales
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Notas adicionales sobre la consulta..."
            rows={3}
            {...register('notas')}
          />
        </div>

        <button
          type="submit"
          disabled={finalizeMutation.isPending}
          className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {finalizeMutation.isPending ? 'Finalizando...' : 'Finalizar Consulta'}
        </button>
      </form>

      <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
        <strong>Agente X</strong> — Chat con IA próximamente disponible
      </div>
    </div>
  );
}
