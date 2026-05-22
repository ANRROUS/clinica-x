"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Link from 'next/link';
import { Heart, Baby, Sparkles, Brain, Bone, Stethoscope } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const specialties = [
  {
    icon: Stethoscope,
    title: 'Medicina General',
    description: 'Atención integral primaria para diagnóstico, prevención y manejo inicial de enfermedades.',
    color: '#003F86',
  },
  {
    icon: Heart,
    title: 'Cardiología',
    description: 'Atención cardiovascular avanzada, diagnósticos y estrategias preventivas de salud cardiaca.',
    color: '#DC2626',
  },
  {
    icon: Baby,
    title: 'Pediatría',
    description: 'Atención compasiva y especializada para bebés, niños y adolescentes.',
    color: '#F97316',
  },
  {
    icon: Sparkles,
    title: 'Dermatología',
    description: 'Cuidado y tratamiento de la piel, diagnóstico de afecciones dermatológicas y procedimientos no invasivos.',
    color: '#008585',
  },
  {
    icon: Brain,
    title: 'Neurología',
    description: 'Diagnóstico y manejo experto de trastornos que afectan el cerebro y el sistema nervioso.',
    color: '#6B7280',
  },
  {
    icon: Bone,
    title: 'Traumatología',
    description: 'Atención de urgencias y tratamiento de lesiones traumáticas del sistema musculoesquelético.',
    color: '#65A30D',
  },
];

export default function SpecialtiesSection() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();

  // ensure auth store has hydrated (client-side)
  useCallback(() => {
    hydrate();
  }, [hydrate]);

  const handleClick = (title: string) => {
    // always scroll to specialties on return
    sessionStorage.setItem('scrollToSpecialties', '1');
    // if logged in go to reservar-cita and set preferred name, otherwise go to register
    if (isAuthenticated) {
      const targetName = title === 'Medicina General' ? 'Medicina General - Integrador' : title;
      sessionStorage.setItem('preferredSpecialtyName', targetName);
      router.push('/reservar-cita');
      return;
    }
    router.push('/register');
  };

  return (
    <section id="especialidades" className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Nuestras Especialidades Clínicas
          </h2>
          <p className="mt-3 text-sm text-[#008585]">
            Experiencia integral en 6 disciplinas, entregada con precisión.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s) => (
            <button
              key={s.title}
              onClick={() => handleClick(s.title)}
              className="flex flex-col items-center rounded-xl border border-gray-100 border-t-[8px] bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTopColor: s.color }}
            >
              <s.icon className="h-10 w-10" style={{ color: s.color }} />
              <h3 className="mt-4 text-base font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{s.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
