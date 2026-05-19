import LegalModal from '@/components/shared/LegalModal';

export const metadata = {
  title: 'Política de Cookies — Clínica X',
  description: 'Política de cookies de Clínica X.',
};

export default function CookiesPage() {
  return (
    <LegalModal title="Política de Cookies">
      <section>
        <p className="mt-2">
          <strong className="text-white">¿Qué son las cookies?</strong> Son pequeños archivos que se almacenan en su navegador para mejorar su experiencia.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-white">Uso en nuestra web:</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Técnicas:</strong> Necesarias para que el sistema de reservas funcione (mantener sesión iniciada).</li>
          <li><strong>Analíticas:</strong> Para entender qué servicios son los más buscados y mejorar nuestra atención.</li>
        </ul>
      </section>

      <section>
        <p className="mt-2">
          <strong className="text-white">Gestión:</strong> Usted puede bloquear o eliminar las cookies desde la configuración de su navegador en cualquier momento, aunque esto podría afectar el funcionamiento del proceso de reserva en línea.
        </p>
      </section>
    </LegalModal>
  );
}
