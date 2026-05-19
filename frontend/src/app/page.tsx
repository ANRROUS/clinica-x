import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import MissionSection from '@/components/landing/MissionSection';
import SpecialtiesSection from '@/components/landing/SpecialtiesSection';
import ContactForm from '@/components/landing/ContactForm';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <SpecialtiesSection />

        {/* Contacto */}
        <section id="contacto" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Mapa */}
              <div className="relative overflow-hidden rounded-xl bg-gray-200">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-[#003F86] px-4 py-1.5 text-xs font-semibold text-white shadow">
                  Av. Arequipa, 265, Lima, Peru
                </div>
                <iframe
                  title="Ubicación de Clínica X"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.1196870048744!2d-77.0376974845636!3d-12.07262094581768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c6e0e8c6b7%3A0x8f5c0b8f5b5b5b5b!2sAv.%20Arequipa%20265%2C%20Lima!5e0!3m2!1ses-419!2spe!4v1690000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 420 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Formulario */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
