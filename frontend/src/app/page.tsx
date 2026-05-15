import Link from 'next/link';
import { Stethoscope, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ContactForm from '@/components/landing/ContactForm';

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 transition hover:border-brand-500 hover:shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
              Tu salud, <span className="text-brand-600">nuestra prioridad</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Reserva citas con médicos certificados, lleva tu historial clínico
              digitalizado y recibe atención personalizada las 24 horas.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/reservar-cita"
                className="rounded-md bg-brand-500 px-6 py-3 font-semibold text-white shadow hover:bg-brand-600"
              >
                Reserva tu cita
              </Link>
              <a
                href="#por-que-elegirnos"
                className="rounded-md px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
              >
                ¿Por qué elegirnos?
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-brand-100 text-brand-600">
              <Stethoscope className="h-32 w-32" />
            </div>
          </div>
        </div>
      </section>

      <section id="por-que-elegirnos" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
          <p className="mt-2 text-gray-600">
            En Clínica X combinamos tecnología y atención humana para ofrecer la mejor experiencia médica.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Feature
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Médicos certificados"
              description="Profesionales con experiencia comprobable y disponibles para atenderte."
            />
            <Feature
              icon={<Calendar className="h-8 w-8" />}
              title="Agendamiento 24/7"
              description="Reserva, reprograma o cancela tu cita desde la plataforma cuando lo necesites."
            />
            <Feature
              icon={<Stethoscope className="h-8 w-8" />}
              title="Historial digital"
              description="Accede a tu historial clínico, diagnósticos y análisis en un solo lugar."
            />
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">Contáctanos</h2>
          <p className="mt-2 text-gray-600">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos a la brevedad.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-8">
              <MapPin className="h-8 w-8 text-brand-600" />
              <p className="mt-4 text-center text-gray-600">
                Av. Principal 1234, Lima, Perú
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}