import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: 'Términos y Condiciones — Clínica X',
  description: 'Términos y condiciones de uso de Clínica X.',
};

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-[#003F86]">Términos y Condiciones</h1>
        <p className="mt-2 text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Aceptación de los términos</h2>
            <p className="mt-2">
              Al acceder y utilizar la plataforma de Clínica X, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo, por favor no utilice nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Uso del servicio</h2>
            <p className="mt-2">
              Clínica X proporciona una plataforma para la gestión de citas médicas, historiales clínicos y comunicación entre pacientes y profesionales de la salud. El uso indebido de la plataforma está estrictamente prohibido.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Responsabilidades del usuario</h2>
            <p className="mt-2">
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Clínica X no se hace responsable por el acceso no autorizado resultante de negligencia del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Limitación de responsabilidad</h2>
            <p className="mt-2">
              Clínica X no garantiza la disponibilidad ininterrumpida del servicio. No nos hacemos responsables por daños directos o indirectos derivados del uso o imposibilidad de uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Modificaciones</h2>
            <p className="mt-2">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en la plataforma.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
