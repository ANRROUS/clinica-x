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
import DoctorFormSkeleton from './DoctorFormSkeleton';
import type { HorarioEntry } from './ScheduleGrid';
import type { MedicoDTO, EspecialidadDTO } from '@/lib/api/types';

const medicoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  email: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
  username: z.string().optional().default(''),
  specialtyId: z.string().min(1, 'Selecciona una especialidad'),
  shift: z.enum(['MANANA', 'TARDE'], { required_error: 'Selecciona un turno' }),
  password: z.string().optional(),
});

type MedicoForm = z.infer<typeof medicoSchema>;

interface DoctorFormProps {
  editId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function DoctorForm({ editId, onSaved, onCancel, isModal }: DoctorFormProps) {
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

  const { data: doctorData, isLoading: isLoadingDoctor } = useQuery({
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
    setValue,
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
      if (onSaved) onSaved();
      else router.push('/admin/dashboard');
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
      if (onSaved) onSaved();
      else router.push('/admin/dashboard');
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

    // Auto-generar username si está vacío
    let username = data.username?.trim();
    if (!username) {
      username = data.email.split('@')[0];
      if (username.length < 4) {
        username = `medico_${data.dni}`;
      }
    }

    const payload = { ...data, username, schedules };

    if (isEditing) {
      const body: any = { ...payload };
      if (!body.password) delete body.password;
      updateMutation.mutate({ id: editId!, body });
    } else {
      if (!data.password || data.password.length < 8) {
        toast.error('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      createMutation.mutate({ ...payload, password: data.password } as any);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingDoctor) {
    return <DoctorFormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className={`bg-white p-8 ${isModal ? '' : 'rounded-2xl border border-gray-200 shadow-sm'}`}>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar doctor' : 'Nuevo Médico'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Actualiza los datos del médico' : 'Registra los datos del médico'}
            </p>
          </div>
          <button
            onClick={onCancel ? onCancel : () => router.push('/admin/dashboard')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#008585]"
          >
            {onCancel ? 'Cancelar' : '<< Regresar'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('username')} />

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
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Horario de atención</h3>
                  <p className="mt-1 text-sm text-gray-500">Elige el horario</p>
                </div>
                <div className="text-right">
                  <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>
                    Turno
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setValue('shift', watchShift === 'MANANA' ? 'TARDE' : 'MANANA', { shouldValidate: true })
                    }
                    className="relative inline-flex h-9 w-44 items-center rounded-full border-2 border-[#008585] bg-[#008585] px-1 transition-colors"
                    aria-label={watchShift === 'TARDE' ? 'Tarde' : 'Mañana'}
                  >
                    <span
                      className={`absolute left-1 top-1 inline-block h-6 w-20 rounded-full bg-white text-xs font-semibold leading-6 text-[#008585] shadow transition-transform duration-300 ${
                        watchShift === 'TARDE' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
                      }`}
                    />
                    <span
                      className={`z-10 w-1/2 text-center text-xs font-semibold transition-colors duration-300 ${
                        watchShift === 'TARDE' ? 'text-white' : 'text-[#008585]'
                      }`}
                    >
                      Mañana
                    </span>
                    <span
                      className={`z-10 w-1/2 text-center text-xs font-semibold transition-colors duration-300 ${
                        watchShift === 'TARDE' ? 'text-[#008585]' : 'text-white'
                      }`}
                    >
                      Tarde
                    </span>
                  </button>
                  {errors.shift && (
                    <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>
                  )}
                </div>
              </div>
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
