import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: 'Política de Cookies — Clínica X',
  description: 'Política de cookies de Clínica X.',
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-[#003F86]">Política de Cookies</h1>
        <p className="mt-2 text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. ¿Qué son las cookies?</h2>
            <p className="mt-2">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Se utilizan para mejorar su experiencia de navegación y recordar sus preferencias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Tipos de cookies que utilizamos</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.</li>
              <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo interactúan los usuarios con la plataforma.</li>
              <li><strong>Cookies de funcionalidad:</strong> Permiten recordar sus preferencias y configuraciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Gestión de cookies</h2>
            <p className="mt-2">
              Puede configurar su navegador para rechazar cookies o alertarle cuando se envíen cookies. Sin embargo, algunas funciones de la plataforma pueden no funcionar correctamente sin cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Cambios en la política</h2>
            <p className="mt-2">
              Podemos actualizar esta política periódicamente. Le recomendamos revisar esta página regularmente para estar informado sobre cualquier cambio.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
