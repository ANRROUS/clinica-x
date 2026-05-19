import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#003F86] lg:text-5xl">
            La salud de siempre,{' '}
            <span className="text-[#008585]">con la agilidad de hoy.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-500">
            Con Clínica X, conecta con tu médico al instante. Gestiona recetas, análisis e historial clínico en un solo lugar, sin trámites lentos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/reservar-cita"
              className="rounded-md bg-[#008585] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#007070]"
            >
              Reservar tu cita
            </Link>
            <a
              href="#mision"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-50"
            >
              ¿Por qué elegirnos?
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl">
            <Image
              src="/assets/image-frontend.png"
              alt="Médico utilizando tablet digital"
              width={600}
              height={450}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
