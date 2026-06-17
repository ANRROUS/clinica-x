'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminSpecialties, createDoctor, updateDoctor, getAdminDoctor } from '@/lib/api/admin.api';
import { getErrorMessage } from '@/lib/api/error-utils';
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
  const prevShiftRef = useRef<string | undefined>(undefined);

  const displayName = [watchNombre, watchApellido].filter(Boolean).join(' ') || '';
  const displaySpecialty = specialties.find((s) => s.id === watchSpecialtyId)?.nombre || '';

  useEffect(() => {
    if (isEditing && doctor) {
      reset({
        nombre: doctor.nombre,
        apellido: doctor.apellido,
        dni: doctor.dni,
        email: doctor.email,
        telefono: doctor.telefono || '',
        username: doctor.username,
        specialtyId: doctor.specialtyId,
        shift: doctor.shift,
        password: '',
      });
      setSchedules(
        doctor.schedules.map((s) => ({
          diaSemana: s.diaSemana,
          horaInicio: s.horaInicio,
          horaFin: s.horaFin,
        })),
      );
    }
  }, [isEditing, doctor, reset]);

  useEffect(() => {
    if (prevShiftRef.current !== undefined && prevShiftRef.current !== watchShift) {
      setSchedules([]);
    }
    prevShiftRef.current = watchShift;
  }, [watchShift]);

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      toast.success('Médico registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      router.push('/admin/dashboard');
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err));
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
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = (data: MedicoForm) => {
    if (schedules.length === 0) {
      setScheduleError('Agrega al menos un horario');
      return;
    }
    setScheduleError('');

    // Validar coherencia entre turno y horarios seleccionados
    const turnoStart = data.shift === 'MANANA' ? '00:00' : '12:00';
    const turnoEnd = data.shift === 'MANANA' ? '12:00' : '24:00';
    const horariosInvalidos = schedules.some(
      (s) => s.horaInicio < turnoStart || s.horaFin > turnoEnd
    );
    if (horariosInvalidos) {
      toast.error('Los horarios seleccionados no corresponden al turno elegido');
      return;
    }

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
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Nuevo Médico / Actualizar Médico' : 'Nuevo Médico / Actualizar Médico'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Aquí podrás registrar o actualizar los datos del médico indicado' : 'Aquí podrás registrar o actualizar los datos del médico indicado'}
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-sm font-semibold"
            style={{ color: '#008585' }}
          >
            {'<<'} Regresar
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
              <div>
                <h3 className="text-lg font-bold text-gray-900">Horario de atención</h3>
                <p className="mt-1 text-sm text-gray-500">Elige el horario</p>
                <div className="mt-4">
                  <ScheduleGrid
                    schedules={schedules}
                    onChange={setSchedules}
                    shift={watchShift || 'MANANA'}
                    error={scheduleError}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#008585' }}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </form>

        {isEditing && doctor && (
          <div className="mt-8">
            <DangerZone
              doctorId={doctor.id}
              doctorName={`${doctor.nombre} ${doctor.apellido}`}
              isActive={doctor.activo}
            />
          </div>
        )}
      </div>
    </div>
  );
}