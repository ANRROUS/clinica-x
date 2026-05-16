'use client';

import { Eye, EyeOff } from 'lucide-react';
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
      <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
          {displayName || '?'}
        </div>
        <p className="mt-3 text-lg font-semibold text-gray-900">
          {displayName || 'Nombre del médico'}
        </p>
        {displaySpecialty && (
          <span className="mt-1 inline-flex rounded-full bg-teal-50 px-3 py-0.5 text-sm font-medium text-teal-700">
            {displaySpecialty}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Datos Personales</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              {...register('nombre')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Juan"
            />
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Apellido *</label>
            <input
              {...register('apellido')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Pérez"
            />
            {errors.apellido && <p className="mt-1 text-xs text-red-500">{errors.apellido.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">DNI *</label>
            <input
              {...register('dni')}
              inputMode="numeric"
              maxLength={8}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="12345678"
            />
            {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="juan@clinica.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              {...register('telefono')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="999888777"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username *</label>
            <input
              {...register('username')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="dr.perez"
            />
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Datos Profesionales</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Especialidad *</label>
            <select
              {...register('specialtyId')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Turno *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MANANA"
                  {...register('shift')}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Mañana</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="TARDE"
                  {...register('shift')}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Tarde</span>
              </label>
            </div>
            {errors.shift && <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña {isEditing ? '' : '*'}
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder={isEditing ? 'Dejar vacío para mantener la contraseña actual' : 'Mínimo 8 caracteres'}
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
            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">Dejar vacío para mantener la contraseña actual</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}