'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, X } from 'lucide-react';

function Popup({
  isOpen,
  onClose,
  title,
  children,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-md bg-[#343434] p-8 text-white shadow-2xl md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 transition hover:text-white md:right-6 md:top-6"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-center text-xl font-bold text-white md:text-2xl">
          {title}
        </h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-white/90">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);

  return (
    <>
      {/* Popup Términos */}
      <Popup
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Términos y Condiciones de Reserva"
      >
        <section>
          <h3 className="text-base font-bold text-white">
            Cláusula de Cancelación y Reprogramación
          </h3>
          <p className="mt-2">
            El usuario acepta que la confirmación de su reserva implica el
            compromiso de asistencia. Se permite la reprogramación o
            cancelación de la cita sin penalidad hasta un máximo de una hora
            (1h) antes de la hora programada.
          </p>
        </section>
        <section>
          <h3 className="text-base font-bold text-white">Restricción Urgente</h3>
          <p className="mt-2">
            En caso de realizar una reserva para una cita cuya ejecución esté
            prevista en menos de una hora desde el momento de la solicitud, el
            usuario reconoce y acepta que{' '}
            <strong>no tendrá derecho a reprogramación ni cancelación</strong>,
            considerándose la reserva como firme y definitiva bajo nuestras
            políticas de gestión de agenda médica.
          </p>
        </section>
      </Popup>

      {/* Popup Privacidad */}
      <Popup
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Política de Privacidad"
      >
        <p>
          <strong className="text-white">Identidad del Responsable:</strong>{' '}
          Clínica X es responsable del tratamiento de sus datos personales.
        </p>
        <p>
          <strong className="text-white">Finalidad:</strong> Recopilamos sus
          datos (nombre, contacto, historial médico básico) exclusivamente
          para gestionar sus citas médicas, recordatorios y prestar servicios
          de salud.
        </p>
        <p>
          <strong className="text-white">Derechos ARCO:</strong> Usted tiene
          derecho a acceder, rectificar, cancelar u oponerse al uso de sus
          datos enviando un correo a{' '}
          <strong>contactanos@cx.com</strong>.
        </p>
        <p>
          <strong className="text-white">Seguridad:</strong> Nos comprometemos
          a proteger la confidencialidad de su información clínica conforme a
          la normativa vigente de protección de datos personales.
        </p>
      </Popup>

      {/* Popup Cookies */}
      <Popup
        isOpen={cookiesOpen}
        onClose={() => setCookiesOpen(false)}
        title="Política de Cookies"
      >
        <p>
          <strong className="text-white">¿Qué son las cookies?</strong> Son
          pequeños archivos que se almacenan en su navegador para mejorar su
          experiencia.
        </p>
        <section>
          <h3 className="text-base font-bold text-white">Uso en nuestra web:</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Técnicas:</strong> Necesarias para que el sistema de
              reservas funcione (mantener sesión iniciada).
            </li>
            <li>
              <strong>Analíticas:</strong> Para entender qué servicios son los
              más buscados y mejorar nuestra atención.
            </li>
          </ul>
        </section>
        <p>
          <strong className="text-white">Gestión:</strong> Usted puede bloquear
          o eliminar las cookies desde la configuración de su navegador en
          cualquier momento, aunque esto podría afectar el funcionamiento del
          proceso de reserva en línea.
        </p>
      </Popup>

      <footer className="bg-[#006666] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Logo */}
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-white">Clínica X</h3>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Contacto
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-white/70" />
                  (511) 999-107-035
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-white/70" />
                  contactanos@cx.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  Av. Arequipa, 265, Lima, Perú
                </li>
              </ul>
            </div>

            {/* Navegación */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Navegación
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li>
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="hover:text-white hover:underline"
                  >
                    Términos y condiciones
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setCookiesOpen(true)}
                    className="hover:text-white hover:underline"
                  >
                    Política de cookies
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="hover:text-white hover:underline"
                  >
                    Política de privacidad
                  </button>
                </li>
              </ul>
            </div>

            {/* Horario */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Horario
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  <span>
                    <span className="font-medium text-white/90">
                      Lunes a Viernes:
                    </span>
                    <br />
                    7:00 a.m. - 10:00 p.m.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  <span>
                    <span className="font-medium text-white/90">
                      Sábado y Domingo:
                    </span>
                    <br />
                    8:00 a.m. - 5:00 p.m.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-white/60">
            &copy; 2026 Clínica X — Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
