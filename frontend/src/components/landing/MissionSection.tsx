import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function MissionSection() {
  return (
    <section id="mision" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Imagen izquierda */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl">
              <Image
                src="/assets/image-frontend.png"
                alt="Médico profesional de Clínica X"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
              {/* Badge 15+ años */}
              <div className="absolute bottom-4 left-4 rounded-md bg-white px-4 py-2 shadow-lg">
                <p className="text-2xl font-bold text-[#003F86]">15+</p>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Años de experiencia</p>
              </div>
            </div>
          </div>

          {/* Texto derecha */}
          <div>
            <h2 className="text-3xl font-bold text-[#008585] lg:text-4xl">
              La Misión de Clínica X
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Nuestra misión es transformar la experiencia de cuidado de la salud mediante la integración de tecnología intuitiva que elimina las barreras logísticas entre médicos y pacientes.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Nos dedicamos a ofrecer una atención médica humana y eficiente, donde la comunicación fluida, el acceso inmediato a la información clínica y la agilidad en los procesos administrativos permitan que el paciente se enfoque exclusivamente en lo más importante: su bienestar y recuperación.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#008585]/10 px-4 py-2">
              <CheckCircle className="h-4 w-4 text-[#008585]" />
              <span className="text-xs font-semibold text-[#008585]">
                Excelencia Acreditada en el Cuidado del Paciente
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
