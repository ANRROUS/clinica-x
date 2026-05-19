'use client';

import Image from 'next/image';
import { Eye, EyeOff, Stethoscope, Fingerprint, Mail, Phone, User } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { EspecialidadDTO } from '@/lib/api/types';

type FormData = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  username: string;
  specialtyId: string;
  shift: 'MANANA' | 'TARDE';
  password?: string;
};

interface DoctorFormLeftProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isEditing: boolean;
  displayName: string;
  displaySpecialty: string;
  specialties: EspecialidadDTO[];
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function DoctorFormLeft({
  register,
  errors,
  isEditing,
  displayName,
  displaySpecialty,
  specialties,
  showPassword,
  onTogglePassword,
}: DoctorFormLeftProps) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative h-32 w-32 overflow-hidden rounded-full">
          <Image
            src="/image-frontend.png"
            alt="Foto del médico"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          {displayName || 'Dra. Angelina Alva'}
        </p>
        {displaySpecialty && (
          <span
            className="mt-2 inline-flex rounded-full px-4 py-1 text-sm font-medium"
            style={{ backgroundColor: '#e6f7f1', color: '#008585' }}
          >
            {displaySpecialty}
          </span>
        )}
      </div>

      {/* Datos Personales */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Nombre completo</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('nombre')}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="Alejandro"
              />
            </div>
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Apellido</label>
            <input
              {...register('apellido')}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
              placeholder="Rivera"
            />
            {errors.apellido && <p className="mt-1 text-xs text-red-500">{errors.apellido.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>DNI</label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('dni')}
                inputMode="numeric"
                maxLength={8}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="71135924"
              />
            </div>
            {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="doctor@gmail.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('telefono')}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="+5255 1234 5678"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('username')}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="Jungkook"
              />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Turno</label>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MANANA"
                  {...register('shift')}
                  className="h-4 w-4 border-gray-300 text-[#008585] focus:ring-[#008585]"
                />
                <span className="text-sm text-gray-700">Mañana</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="TARDE"
                  {...register('shift')}
                  className="h-4 w-4 border-gray-300 text-[#008585] focus:ring-[#008585]"
                />
                <span className="text-sm text-gray-700">Tarde</span>
              </label>
            </div>
            {errors.shift && <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Contraseña</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <label className="mb-1 block text-xs font-semibold" style={{ color: '#008585' }}>Especialidad *</label>
              <select
                {...register('specialtyId')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
              >
                <option value="">Seleccionar...</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              {errors.specialtyId && <p className="mt-1 text-xs text-red-500">{errors.specialtyId.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}