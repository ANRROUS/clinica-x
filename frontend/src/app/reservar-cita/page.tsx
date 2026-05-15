'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles, Loader2 } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SpecialtySidebar from '@/components/booking/SpecialtySidebar';
import DoctorSelector from '@/components/booking/DoctorSelector';
import DaySelector from '@/components/booking/DaySelector';
import SlotSelector from '@/components/booking/SlotSelector';
import ConfirmBookingModal from '@/components/booking/ConfirmBookingModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingStore } from '@/store/useBookingStore';
import {
  getSpecialties,
  getAvailabilityBySpecialty,
  getAvailabilityByDoctor,
  bookManual,
  bookAutomatic,
} from '@/lib/api/appointments.api';
import type {
  EspecialidadDTO,
  DisponibilidadDoctorDTO,
  SlotDTO,
  DiaDisponibilidadDTO,
} from '@/lib/api/types';

export default function ReservarCitaPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
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
    if (!isAuthenticated) {
      sessionStorage.setItem('returnUrl', '/reservar-cita');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (prefillFromOrder) {
      setSpecialty(prefillFromOrder.specialtyId, '');
      setPrefill(null);
    }
  }, [prefillFromOrder, setSpecialty, setPrefill]);

  const { data: specialtiesData, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
    enabled: isAuthenticated,
  });

  const specialties: EspecialidadDTO[] = specialtiesData?.data ?? [];

  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
    queryKey: ['availability-specialty', selectedSpecialtyId],
    queryFn: () => getAvailabilityBySpecialty(selectedSpecialtyId!),
    enabled: !!selectedSpecialtyId,
  });

  const doctors: DisponibilidadDoctorDTO[] = doctorsData?.data ?? [];

  const selectedDoctorDays = selectedDoctor?.dias ?? [];

  const { data: doctorSlotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['availability-doctor', selectedDoctor?.doctorId, selectedDate],
    queryFn: () =>
      getAvailabilityByDoctor(selectedDoctor!.doctorId, selectedDate!),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const daySlots: SlotDTO[] = doctorSlotsData?.data ?? [];

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
        reset();
        router.push('/perfil');
      } else {
        toast.error(res.error?.mensaje || 'No hay turnos disponibles en este momento.');
      }
    } catch {
      toast.error('Error al reservar. Intenta de nuevo.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleManualBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    setBookingLoading(true);
    try {
      const fechaHora = `${selectedDate}T${selectedSlot.horaInicio}:00`;
      const res = await bookManual({
        medicoId: selectedDoctor.doctorId,
        fechaHora,
      });
      if (res.success && res.data) {
        toast.success(`¡Cita confirmada! Código: ${res.data.voucherCode || res.data.id}`);
        reset();
        router.push('/perfil');
      } else {
        toast.error(res.error?.mensaje || 'No se pudo confirmar la reserva.');
      }
    } catch {
      toast.error('Error al reservar. Intenta de nuevo.');
    } finally {
      setBookingLoading(false);
    }
  };

  const canConfirmManual = !!selectedDoctor && !!selectedDate && !!selectedSlot;

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Especialidades</h2>
            {loadingSpecialties ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              </div>
            ) : (
              <SpecialtySidebar
                specialties={specialties}
                selectedId={selectedSpecialtyId}
                onSelect={handleSpecialtySelect}
              />
            )}
          </div>
        </aside>

        <section className="flex-1">
          {!selectedSpecialtyId ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Reserva tu cita</h2>
              <p className="mt-2 text-gray-600">
                Selecciona una especialidad del panel izquierdo para ver los médicos disponibles.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSpecialtyName}</h2>
                <button
                  onClick={handleAutoBook}
                  disabled={bookingLoading}
                  className="flex items-center gap-2 rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Automático
                </button>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Elige al especialista</h3>
                {loadingDoctors ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                  </div>
                ) : (
                  <DoctorSelector
                    doctors={doctors}
                    selectedId={selectedDoctor?.doctorId ?? null}
                    onSelect={handleDoctorSelect}
                  />
                )}
              </div>

              {selectedDoctor && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">Elige el día</h3>
                  <DaySelector
                    days={selectedDoctorDays}
                    selectedDate={selectedDate}
                    onSelect={setDate}
                  />
                </div>
              )}

              {selectedDate && selectedDoctor && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">Elige la hora</h3>
                  {loadingSlots ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                    </div>
                  ) : (
                    <SlotSelector
                      slots={daySlots}
                      selectedSlot={selectedSlot}
                      onSelect={setSlot}
                    />
                  )}
                </div>
              )}

              {canConfirmManual && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-brand-500 px-8 py-3 font-semibold text-white hover:bg-brand-600"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
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