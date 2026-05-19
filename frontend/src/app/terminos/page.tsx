import LegalModal from '@/components/shared/LegalModal';

export const metadata = {
  title: 'Términos y Condiciones de Reserva — Clínica X',
  description: 'Términos y condiciones de uso de Clínica X.',
};

export default function TerminosPage() {
  return (
    <LegalModal title="Términos y Condiciones de Reserva">
      <section>
        <h2 className="text-base font-bold text-white">Cláusula de Cancelación y Reprogramación</h2>
        <p className="mt-2">
          El usuario acepta que la confirmación de su reserva implica el compromiso de asistencia. Se permite la reprogramación o cancelación de la cita sin penalidad hasta un máximo de una hora (1h) antes de la hora programada.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-white">Restricción Urgente</h2>
        <p className="mt-2">
          En caso de realizar una reserva para una cita cuya ejecución esté prevista en menos de una hora desde el momento de la solicitud, el usuario reconoce y acepta que <strong>no tendrá derecho a reprogramación ni cancelación</strong>, considerándose la reserva como firme y definitiva bajo nuestras políticas de gestión de agenda médica.
        </p>
      </section>
    </LegalModal>
  );
}
