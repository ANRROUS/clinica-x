import Link from 'next/link';
import { Stethoscope, Calendar, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ContactForm from '@/components/landing/ContactForm';

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
            <div className="relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200">
              <Stethoscope className="h-32 w-32 text-brand-600/40" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-brand-400/30 to-transparent" />
              <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/60 text-brand-600 shadow">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="absolute bottom-8 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/60 text-brand-600 shadow">
                <Calendar className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="por-que-elegirnos" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center lg:order-first">
              <div className="flex h-72 w-72 items-center justify-center rounded-3xl bg-gradient-to-bl from-brand-100 to-brand-50 lg:h-96 lg:w-full lg:max-w-md">
                <div className="grid grid-cols-2 gap-4 p-6">
                  {[
                    { icon: <CheckCircle className="h-6 w-6" />, label: 'Certificados' },
                    { icon: <Calendar className="h-6 w-6" />, label: '24/7' },
                    { icon: <ShieldCheck className="h-6 w-6" />, label: 'Digitalizado' },
                    { icon: <Stethoscope className="h-6 w-6" />, label: 'Personalizada' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-xl bg-white/70 p-4 text-center shadow-sm"
                    >
                      <span className="text-brand-600">{item.icon}</span>
                      <span className="text-xs font-medium text-brand-800">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
              <p className="mt-4 text-gray-600">
                En Clínica X combinamos tecnología y atención humana para ofrecer la mejor experiencia médica.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-gray-700">
                    <strong>Médicos certificados</strong> y con experiencia comprobable.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-gray-700">
                    <strong>Agendamiento digital 24/7</strong> desde cualquier dispositivo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-gray-700">
                    <strong>Historial clínico digitalizado</strong> accesible en todo momento.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-gray-700">
                    <strong>Atención personalizada</strong> enfocada en tus necesidades.
                  </span>
                </li>
              </ul>
            </div>
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
            <div className="overflow-hidden rounded-xl bg-gray-200">
              <iframe
                title="Ubicación de Clínica X"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9621661343478!2d-77.0331801845644!3d-12.062276145849443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8f1c7a5f7e3%3A0x4c8aac5e6b8b0aaf!2sAv.%20Principal%201234%2C%20Lima!5e0!3m2!1ses-419!2spe!4v1690000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
