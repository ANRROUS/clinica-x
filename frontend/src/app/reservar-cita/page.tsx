'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SpecialtySidebar from '@/components/booking/SpecialtySidebar';
import DoctorSelector from '@/components/booking/DoctorSelector';
import DaySelector from '@/components/booking/DaySelector';
import SlotSelector from '@/components/booking/SlotSelector';
import ConfirmBookingModal from '@/components/booking/ConfirmBookingModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingStore } from '@/store/useBookingStore';
import { buildLimaDate, toISOLima, formatLima } from '@clinica-x/date-utils';
import {
  getSpecialties,
  getAvailabilityBySpecialty,
  getAvailabilityByDoctor,
  bookManual,
  bookAutomatic,
  getPatientAppointments,
} from '@/lib/api/appointments.api';
import { getErrorMessage } from '@/lib/api/error-utils';
import type {
  EspecialidadDTO,
  DisponibilidadDoctorDTO,
  SlotDTO,
  DiaDisponibilidadDTO,
  CitaDTO,
} from '@/lib/api/types';

export default function ReservarCitaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();
  const {
    selectedSpecialtyId,
    selectedSpecialtyName,
    selectedDoctor,
    selectedDate,
    selectedSlot,
    bookingMode,
    prefillFromOrder,
    setSpecialty,
    setDoctor,
    setDate,
    setSlot,
    setMode,
    setPrefill,
    reset,
  } = useBookingStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (_hasHydrated && (!isAuthenticated || user?.rol !== 'PACIENTE')) {
      sessionStorage.setItem('returnUrl', '/reservar-cita');
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  const { data: specialtiesData, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
    enabled: isAuthenticated,
  });

  const specialties: EspecialidadDTO[] = specialtiesData?.data ?? [];

  useEffect(() => {
    if (prefillFromOrder) {
      const specialtyName = specialties.find((s) => s.id === prefillFromOrder.specialtyId)?.nombre ?? '';
      setSpecialty(prefillFromOrder.specialtyId, specialtyName);
      setPrefill(null);
    }
  }, [prefillFromOrder, setSpecialty, setPrefill, specialties]);

  const {
    data: doctorsData,
    isLoading: loadingDoctors,
    isError: doctorsError,
  } = useQuery({
    queryKey: ['availability-specialty', selectedSpecialtyId],
    queryFn: () => getAvailabilityBySpecialty(selectedSpecialtyId!),
    enabled: !!selectedSpecialtyId && isAuthenticated,
  });

  const doctors: DisponibilidadDoctorDTO[] = doctorsData?.data ?? [];

  useEffect(() => {
    if (doctorsError) {
      toast.error(getErrorMessage(doctorsError));
    }
  }, [doctorsError]);

  const selectedDoctorDays = selectedDoctor?.dias ?? [];

  const { data: doctorSlotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['availability-doctor', selectedDoctor?.doctorId, selectedDate],
    queryFn: () => getAvailabilityByDoctor(selectedDoctor!.doctorId, selectedDate!),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const daySlots: SlotDTO[] = doctorSlotsData?.data ?? [];

  // Obtener citas existentes del paciente para validación
  const { data: patientAppointmentsData } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: getPatientAppointments,
    enabled: isAuthenticated,
  });

  const patientAppointments: CitaDTO[] = patientAppointmentsData?.data ?? [];

  const isDuplicate = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return false;

    return patientAppointments.some((cita) => {
      if (cita.estado === 'CANCELADA') return false;
      if (cita.medicoId !== selectedDoctor.doctorId) return false;

      const citaDate = formatLima(new Date(cita.fechaHora), 'yyyy-MM-dd');
      return citaDate === selectedDate;
    });
  }, [patientAppointments, selectedDoctor, selectedDate]);

  const handleSpecialtySelect = (id: string, name: string) => {
    setSpecialty(id, name);
  };

  const handleDoctorSelect = (doc: DisponibilidadDoctorDTO) => {
    setDoctor(doc);
  };

  const handleAutoBook = async () => {
    if (!selectedSpecialtyId) return;
    setMode('automatic');
    setBookingLoading(true);
    try {
      const res = await bookAutomatic({ especialidadId: selectedSpecialtyId });
      if (res.success && res.data) {
        toast.success('¡Reserva confirmada automáticamente!');
        queryClient.invalidateQueries({ queryKey: ['availability-specialty'] });
        queryClient.invalidateQueries({ queryKey: ['availability-doctor'] });
        queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
        reset();
        router.push('/perfil');
      } else {
        toast.error(res.error?.mensaje || 'No hay turnos disponibles en este momento.');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  const handleManualBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    setBookingLoading(true);
    try {
      const [hours, minutes] = selectedSlot.horaInicio.split(':').map(Number);
      const d = buildLimaDate(
        selectedDate,
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`,
      );
      const fechaHora = toISOLima(d);
      const res = await bookManual({
        medicoId: selectedDoctor.doctorId,
        fechaHora,
      });
      if (res.success && res.data) {
        toast.success(`¡Cita confirmada! Código: ${res.data.voucherCode || res.data.id}`);
        queryClient.invalidateQueries({ queryKey: ['availability-specialty'] });
        queryClient.invalidateQueries({ queryKey: ['availability-doctor'] });
        queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
        reset();
        router.push('/perfil');
      } else {
        toast.error(res.error?.mensaje || 'No se pudo confirmar la reserva.');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  const canConfirmManual = !!selectedDoctor && !!selectedDate && !!selectedSlot && !isDuplicate;

  if (!_hasHydrated || !isAuthenticated || user?.rol !== 'PACIENTE') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#008585]" />
        <p className="mt-4 text-sm text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#003F86]">Agenda tu Cita Médica</h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestiona tu atención en medicina general de forma rápida y sencilla.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {loadingSpecialties ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
            </div>
          ) : !selectedSpecialtyId && specialties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Sin especialidades</h2>
              <p className="mt-2 text-gray-600">
                No hay especialidades disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Sidebar izquierdo */}
              <aside className="w-full shrink-0 border-b border-gray-200 pb-6 md:w-64 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                {loadingSpecialties ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#008585]" />
                  </div>
                ) : (
                  <SpecialtySidebar
                    specialties={specialties}
                    selectedId={selectedSpecialtyId}
                    onSelect={handleSpecialtySelect}
                  />
                )}
              </aside>

              {/* Contenido derecho */}
              <section className="flex-1">
                {!selectedSpecialtyId ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-xl font-bold text-gray-900">Selecciona una especialidad</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Elige una especialidad del panel izquierdo para ver los médicos disponibles.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Header de especialidad */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold uppercase text-gray-900">
                        {selectedSpecialtyName}
                      </h2>
                      <button
                        onClick={handleAutoBook}
                        disabled={bookingLoading}
                        className="flex items-center gap-2 rounded-lg bg-[#003F86] px-4 py-2 text-sm font-medium text-white hover:bg-[#00306b] disabled:opacity-50 transition"
                      >
                        Automático
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Selector de doctor */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-gray-800">
                        Elige al especialista:
                      </h3>
                      <DoctorSelector
                        doctors={doctors}
                        selectedId={selectedDoctor?.doctorId ?? null}
                        onSelect={handleDoctorSelect}
                        loading={loadingDoctors}
                        error={doctorsError}
                        onRetry={() =>
                          queryClient.invalidateQueries({ queryKey: ['availability-specialty', selectedSpecialtyId] })
                        }
                      />
                    </div>

                    {selectedDoctor && (
                      <div className="space-y-6">
                        {/* Selector de día */}
                        <div>
                          <h3 className="mb-3 text-sm font-semibold text-gray-800">
                            Elige el Día:
                          </h3>
                          <DaySelector
                            days={selectedDoctorDays}
                            selectedDate={selectedDate}
                            onSelect={setDate}
                          />
                        </div>

                        {/* Selector de hora */}
                        {selectedDate && (
                          <div>
                            <h3 className="mb-3 text-sm font-semibold text-gray-800">
                              Elige la Hora:
                            </h3>
                            <SlotSelector
                              slots={daySlots}
                              selectedSlot={selectedSlot}
                              onSelect={setSlot}
                              loading={loadingSlots}
                            />
                          </div>
                        )}

                        {/* Advertencia de cita duplicada */}
                        {selectedSlot && isDuplicate && (
                          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
                            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-amber-900">
                                Ya tienes una cita programada
                              </h4>
                                <p className="mt-1 text-sm text-amber-800">
                                Ya cuentas con una cita el mismo día con{' '}
                                {selectedDoctor?.doctorName}. No puedes reservar más de una cita
                                por día con el mismo médico.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Botón confirmar */}
                        {selectedSlot && !isDuplicate && (
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => setModalOpen(true)}
                              className="rounded-lg bg-[#003F86] px-8 py-3 text-sm font-semibold text-white hover:bg-[#00306b] transition"
                            >
                              Confirmar Reserva
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <ConfirmBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleManualBook}
        loading={bookingLoading}
        specialtyName={selectedSpecialtyName || ''}
        doctor={selectedDoctor}
        date={selectedDate}
        slot={selectedSlot}
        bookingMode={bookingMode}
      />

      <Footer />
    </div>
  );
}
