import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#006666] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + descripción */}
          <div>
            <h3 className="text-xl font-bold">Clínica X</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Tu salud, nuestra prioridad. Atención médica de calidad con tecnología de punta.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Contacto</h4>
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
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Navegación</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <Link href="/terminos" className="hover:text-white hover:underline">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white hover:underline">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white hover:underline">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Horario</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                <span>
                  <span className="font-medium text-white/90">Lunes a Viernes:</span>
                  <br />
                  7:00 a.m. - 10:00 p.m.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                <span>
                  <span className="font-medium text-white/90">Sábado y Domingo:</span>
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
          &copy; {new Date().getFullYear()} Clínica X — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
