'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminSpecialties, createDoctor, updateDoctor, getAdminDoctor } from '@/lib/api/admin.api';
import ScheduleGrid from './ScheduleGrid';
import DoctorFormLeft from './DoctorFormLeft';
import DangerZone from './DangerZone';
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
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!editId;

  const { data: specialtiesData } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: getAdminSpecialties,
  });
  const specialties: EspecialidadDTO[] = (specialtiesData?.data || []).filter((s) => s.activo);

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
    watch,
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

  const watchNombre = watch('nombre');
  const watchApellido = watch('apellido');
  const watchSpecialtyId = watch('specialtyId');
  const watchShift = watch('shift');

  const displayName = [watchNombre, watchApellido].filter(Boolean).join(' ') || '';
  const displaySpecialty = specialties.find((s) => s.id === watchSpecialtyId)?.nombre || '';

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
      toast.success('Médico registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'No se pudo guardar. Revisa los datos e intenta nuevamente.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; body: any }) => updateDoctor(data.id, data.body),
    onSuccess: () => {
      toast.success('Datos del médico actualizados');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'No se pudo guardar. Revisa los datos e intenta nuevamente.');
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
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Médico' : 'Nuevo Médico'}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditing ? 'Modifica los datos del médico' : 'Aquí podrás registrar o actualizar los datos del médico indicado'}
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DoctorFormLeft
            register={register}
            errors={errors}
            isEditing={isEditing}
            displayName={displayName}
            displaySpecialty={displaySpecialty}
            specialties={specialties}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Horario de atención</h3>
              <p className="mb-4 text-xs text-gray-500">
                Elige el horario del médico marcando las celdas correspondientes
              </p>
              <ScheduleGrid
                schedules={schedules}
                onChange={setSchedules}
                shift={watchShift || 'MANANA'}
                error={scheduleError}
              />
            </div>

            {isEditing && doctor && (
              <DangerZone
                doctorId={doctor.id}
                doctorName={`${doctor.nombre} ${doctor.apellido}`}
                isActive={doctor.activo}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}