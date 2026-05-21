'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, CreditCard, User, Phone } from 'lucide-react';
import { register as registerApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z
  .object({
    dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
    email: z.string().email('Correo inválido'),
    nombre: z.string().min(1, 'El nombre es requerido'),
    apellido: z.string().min(1, 'El apellido es requerido'),
    telefono: z.string().optional(),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterFormContentProps {
  onSuccess?: () => void;
}

export default function RegisterFormContent({ onSuccess }: RegisterFormContentProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await registerApi({
        dni: data.dni,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || undefined,
        password: data.password,
      });
      if (res.success && res.data) {
        setAuth(res.data.usuario, res.data.token);
        toast.success('Cuenta creada correctamente');
        if (onSuccess) {
          onSuccess();
        } else {
          const returnUrl = sessionStorage.getItem('returnUrl') || '/perfil';
          sessionStorage.removeItem('returnUrl');
          router.push(returnUrl);
        }
      } else {
        const errorMsg = res.error?.mensaje || 'Error al crear cuenta';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = (fieldName: string, hasError: boolean) =>
    `group flex items-center gap-2.5 rounded-full bg-gray-50 px-4 py-2.5 transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-[#3BA99F] bg-white shadow-md shadow-[#3BA99F]/10'
        : 'border-gray-200 hover:border-gray-300'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="mt-1 text-sm text-gray-500">Completa tus datos para registrarte</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {/* Row 1: Nombre | Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Nombre</label>
            <div className={inputWrapper('nombre', !!errors.nombre)}>
              <User className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type="text"
                placeholder="Juan"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('nombre')}
                onFocus={() => setFocusedField('nombre')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.nombre && (
              <p className="text-[10px] font-medium text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Apellido</label>
            <div className={inputWrapper('apellido', !!errors.apellido)}>
              <User className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type="text"
                placeholder="Pérez"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('apellido')}
                onFocus={() => setFocusedField('apellido')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.apellido && (
              <p className="text-[10px] font-medium text-red-500">{errors.apellido.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: DNI | Teléfono */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">DNI</label>
            <div className={inputWrapper('dni', !!errors.dni)}>
              <CreditCard className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="12345678"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('dni')}
                onFocus={() => setFocusedField('dni')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.dni && (
              <p className="text-[10px] font-medium text-red-500">{errors.dni.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Teléfono <span className="text-gray-500">(opc.)</span>
            </label>
            <div className={inputWrapper('telefono', !!errors.telefono)}>
              <Phone className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type="tel"
                placeholder="999888777"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('telefono')}
                onFocus={() => setFocusedField('telefono')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.telefono && (
              <p className="text-[10px] font-medium text-red-500">{errors.telefono.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Correo electrónico</label>
          <div className={inputWrapper('email', !!errors.email)}>
            <Mail className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              {...register('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Row 3: Contraseña | Confirmar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Contraseña</label>
            <div className={inputWrapper('password', !!errors.password)}>
              <Lock className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="8+ chars"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('password')}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] font-medium text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Confirmar</label>
            <div className={inputWrapper('confirmPassword', !!errors.confirmPassword)}>
              <Lock className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#3BA99F]" />
              <input
                type="password"
                placeholder="Repite"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                {...register('confirmPassword')}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] font-medium text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#3BA99F] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#3BA99F]/20 transition-all duration-300 hover:bg-[#008585] hover:shadow-lg hover:shadow-[#008585]/20 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando...
            </span>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#3BA99F] underline underline-offset-2 transition-colors hover:text-[#008585]"
        >
          Ingresar
        </Link>
      </p>
    </div>
  );
}
