import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: 'Política de Privacidad — Clínica X',
  description: 'Política de privacidad de Clínica X.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-[#003F86]">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Información que recopilamos</h2>
            <p className="mt-2">
              Recopilamos información personal que usted nos proporciona directamente, como nombre, apellido, correo electrónico, número de teléfono e información de salud necesaria para la prestación de servicios médicos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Uso de la información</h2>
            <p className="mt-2">
              Utilizamos su información para gestionar citas médicas, mantener su historial clínico, comunicarnos con usted y mejorar nuestros servicios. No vendemos ni compartimos su información con terceros sin su consentimiento, salvo requerimiento legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Seguridad de los datos</h2>
            <p className="mt-2">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Sus derechos</h2>
            <p className="mt-2">
              Usted tiene derecho a acceder, rectificar, eliminar y limitar el tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos a través de nuestros canales oficiales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Cambios en la política</h2>
            <p className="mt-2">
              Podemos actualizar esta política de privacidad ocasionalmente. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
