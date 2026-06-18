"use client";

import { Heart, Baby, Smile, Brain, Bone } from 'lucide-react';

const specialties = [
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
    icon: Smile,
    title: 'Odontología',
    description: 'Atención dental integral, desde la estética de rutina hasta procedimientos restaurativos complejos.',
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
    title: 'Ortopedia',
    description: 'Tratamiento quirúrgico y no quirúrgico para problemas musculoesqueléticos, asegurando la movilidad.',
    color: '#65A30D',
  },
];

export default function SpecialtiesSection() {
  return (
    <section id="especialidades" className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Nuestras Especialidades Clínicas
          </h2>
          <p className="mt-3 text-sm text-[#008585]">
            Experiencia integral en 5 disciplinas, entregada con precisión.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-center rounded-xl border border-gray-100 border-t-[8px] bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTopColor: s.color }}
            >
              <s.icon className="h-10 w-10" style={{ color: s.color }} />
              <h3 className="mt-4 text-base font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
