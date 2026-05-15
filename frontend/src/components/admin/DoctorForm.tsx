'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialties, createDoctor, updateDoctor, getAdminDoctor } from '@/lib/api/admin.api';
import ScheduleGrid from './ScheduleGrid';
import type { HorarioEntry } from './ScheduleGrid';
import type { MedicoDTO, EspecialidadDTO } from '@/lib/api/types';

const medicoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  email: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
  username: z.string().min(4, 'Mínimo 4 caracteres').regex(/^\S+$/, 'Sin espacios'),
  specialtyId: z.string().min(1, 'Selecciona una especialidad'),
  shift: z.enum(['MANANA', 'TARDE'], { required_error: 'Selecciona un turno' }),
  password: z.string().optional(),
});

type MedicoForm = z.infer<typeof medicoSchema>;

interface DoctorFormProps {
  editId?: string;
}

export default function DoctorForm({ editId }: DoctorFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [schedules, setSchedules] = useState<HorarioEntry[]>([]);
  const [scheduleError, setScheduleError] = useState('');

  const isEditing = !!editId;

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });
  const specialties: EspecialidadDTO[] = specialtiesData?.data || [];

  const { data: doctorData } = useQuery({
    queryKey: ['admin-doctor', editId],
    queryFn: () => getAdminDoctor(editId!),
    enabled: isEditing,
  });

  const doctor: MedicoDTO | null = (doctorData?.data as { doctor: MedicoDTO } | undefined)?.doctor ?? null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicoForm>({
    resolver: zodResolver(medicoSchema),
    defaultValues: isEditing
      ? undefined
      : {
          nombre: '',
          apellido: '',
          dni: '',
          email: '',
          telefono: '',
          username: '',
          specialtyId: '',
          shift: 'MANANA' as const,
          password: '',
        },
  });

  const populateForm = (doc: MedicoDTO) => {
    reset({
      nombre: doc.nombre,
      apellido: doc.apellido,
      dni: doc.dni,
      email: doc.email,
      telefono: doc.telefono || '',
      username: doc.username,
      specialtyId: doc.specialtyId,
      shift: doc.shift,
      password: '',
    });
    setSchedules(
      doc.schedules.map((s) => ({
        diaSemana: s.diaSemana,
        horaInicio: s.horaInicio,
        horaFin: s.horaFin,
      })),
    );
  };

  if (isEditing && doctor && schedules.length === 0) {
    populateForm(doctor);
  }

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      toast.success('Médico creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/medicos');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'Error al crear médico');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; body: any }) => updateDoctor(data.id, data.body),
    onSuccess: () => {
      toast.success('Médico actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/medicos');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'Error al actualizar médico');
    },
  });

  const onSubmit = (data: MedicoForm) => {
    if (schedules.length === 0) {
      setScheduleError('Agrega al menos un horario');
      return;
    }
    setScheduleError('');

    if (isEditing) {
      const body: any = {
        ...data,
        schedules,
      };
      if (!body.password) delete body.password;
      updateMutation.mutate({ id: editId!, body });
    } else {
      if (!data.password || data.password.length < 8) {
        toast.error('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      createMutation.mutate({ ...data, password: data.password, schedules });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/medicos')}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Médico' : 'Nuevo Médico'}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditing ? 'Modifica los datos del médico' : 'Completa el formulario para registrar un nuevo médico'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Datos Personales</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                {...register('nombre')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Juan"
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Apellido *</label>
              <input
                {...register('apellido')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Pérez"
              />
              {errors.apellido && <p className="mt-1 text-xs text-red-500">{errors.apellido.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">DNI *</label>
              <input
                {...register('dni')}
                inputMode="numeric"
                maxLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="12345678"
              />
              {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="juan@clinica.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                {...register('telefono')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="999888777"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={isEditing ? '••••••••' : 'Mínimo 8 caracteres'}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Datos Profesionales</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Username *</label>
              <input
                {...register('username')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="dr.perez"
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Especialidad *</label>
              <select
                {...register('specialtyId')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Seleccionar...</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              {errors.specialtyId && <p className="mt-1 text-xs text-red-500">{errors.specialtyId.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Turno *</label>
              <select
                {...register('shift')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="MANANA">Mañana</option>
                <option value="TARDE">Tarde</option>
              </select>
              {errors.shift && <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ScheduleGrid
            schedules={schedules}
            onChange={setSchedules}
            errors={scheduleError}
          />
        </div>

        {isEditing && doctor && !doctor.activo && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="mb-2 text-sm font-semibold text-red-800">Zona de peligro</h3>
            <p className="mb-3 text-sm text-red-700">
              Este médico está desactivado. Puedes reactivarlo desde la tabla de médicos.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/medicos')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            {isEditing ? 'Guardar Cambios' : 'Crear Médico'}
          </button>
        </div>
      </form>
    </div>
  );
}