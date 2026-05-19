import LegalModal from '@/components/shared/LegalModal';

export const metadata = {
  title: 'Política de Privacidad — Clínica X',
  description: 'Política de privacidad de Clínica X.',
};

export default function PrivacidadPage() {
  return (
    <LegalModal title="Política de Privacidad">
      <section>
        <p className="mt-2">
          <strong className="text-white">Identidad del Responsable:</strong> Clínica X es responsable del tratamiento de sus datos personales.
        </p>
      </section>

      <section>
        <p className="mt-2">
          <strong className="text-white">Finalidad:</strong> Recopilamos sus datos (nombre, contacto, historial médico básico) exclusivamente para gestionar sus citas médicas, recordatorios y prestar servicios de salud.
        </p>
      </section>

      <section>
        <p className="mt-2">
          <strong className="text-white">Derechos ARCO:</strong> Usted tiene derecho a acceder, rectificar, cancelar u oponerse al uso de sus datos enviando un correo a <strong>contactanos@cx.com</strong>.
        </p>
      </section>

      <section>
        <p className="mt-2">
          <strong className="text-white">Seguridad:</strong> Nos comprometemos a proteger la confidencialidad de su información clínica conforme a la normativa vigente de protección de datos personales.
        </p>
      </section>
    </LegalModal>
  );
}
