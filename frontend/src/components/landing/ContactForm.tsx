'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.info('Formulario de contacto enviado (demo).');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-center text-lg font-bold uppercase tracking-wide text-gray-900">
        Contáctanos
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            required
            className="w-full border-0 border-b border-gray-300 bg-transparent px-1 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-0"
            placeholder="Escribe tu nombre"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Apellido *</label>
          <input
            type="text"
            required
            className="w-full border-0 border-b border-gray-300 bg-transparent px-1 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-0"
            placeholder="Escribe tu apellido"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Email *</label>
          <input
            type="email"
            required
            className="w-full border-0 border-b border-gray-300 bg-transparent px-1 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-0"
            placeholder="Ej. email@gmail.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Número de celular</label>
          <input
            type="tel"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-1 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-0"
            placeholder="Ej. XXX-XXXX-XXXX"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Comentario</label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-1 focus:ring-[#008585]"
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#008585] px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#007070] disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
