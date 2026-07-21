'use client';

import { useState } from 'react';
import type { ManualSection } from '@/data/manualData';
import ImageLightbox from './ImageLightbox';
import { ExternalLink } from 'lucide-react';

interface ManualContentProps {
  section: ManualSection;
  sections: ManualSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export default function ManualContent({
  section,
  sections,
  activeSection,
  onSelectSection,
}: ManualContentProps) {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  if (!section) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="md:hidden overflow-x-auto border-b border-gray-200">
        <div className="flex gap-1 px-3 py-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSection(s.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                s.id === activeSection
                  ? 'bg-[#008585] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-[#003F86]">{section.title}</h1>
        {section.description && (
          <p className="mt-3 leading-relaxed text-gray-600">{section.description}</p>
        )}

        {section.note && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50/70 px-5 py-4">
            <p className="text-sm font-medium text-blue-800">Nota</p>
            <p className="mt-1 text-sm leading-relaxed text-blue-700">{section.note}</p>
          </div>
        )}

        <ol className="mt-8 space-y-8">
          {section.steps.map((step, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#008585] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="leading-relaxed text-gray-800">{step.text}</p>
                {step.image && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                    <button
                      onClick={() =>
                        setLightboxImage({
                          src: step.image!,
                          alt: `Paso ${index + 1}: ${step.text.substring(0, 60)}...`,
                        })
                      }
                      className="group relative w-full cursor-zoom-in"
                    >
                      <img
                        src={step.image}
                        alt={`Paso ${index + 1} - ${section.title}`}
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10">
                        <span className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ampliar
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ImageLightbox
        src={lightboxImage?.src ?? ''}
        alt={lightboxImage?.alt ?? ''}
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
