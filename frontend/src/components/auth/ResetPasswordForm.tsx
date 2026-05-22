'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth.api';
import axios from 'axios';

const resetPasswordSchema = z
  .object({
    nuevaContrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmarContrasena: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await resetPassword(token, data.nuevaContrasena);
      if (res.success) {
        toast.success('Contraseña actualizada correctamente');
        router.push('/login');
      } else {
        toast.error(res.error?.mensaje || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const msg = error.response?.data?.error?.mensaje;
        if (status === 400 && msg?.toLowerCase().includes('expirado')) {
          toast.error('El enlace ha expirado. Solicita uno nuevo.');
        } else {
          toast.error(msg || 'Error de conexión. Intenta de nuevo.');
        }
      } else {
        toast.error('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = (fieldName: string, hasError: boolean) =>
    `group flex items-center gap-3 rounded-full bg-white/10 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-white/40 bg-white/15 shadow-lg shadow-black/10'
        : 'border-transparent hover:border-white/20'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  if (!token) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center p-4 bg-[#31b9ad]">
        <Link
          href="/"
          className="absolute top-8 right-8 z-50 rounded-full bg-white/15 p-1.5 transition-colors hover:bg-white/30 sm:top-8 sm:right-8 sm:p-2 md:top-10 md:right-10 md:p-2.5"
        >
          <X className="h-6 w-6 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" />
        </Link>
        <div className="flex w-full max-w-5xl">
          <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:w-1/2">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Enlace inválido</h1>
              <p className="text-sm text-white/70 mb-6">
                El enlace de recuperación no es válido o ha expirado.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#008585] shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
          <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
            <img
              src="/assets/login-paciente.png"
              alt="Ilustración Paciente"
              className="relative z-10 max-h-[60vh] w-auto object-contain"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 bg-[#31b9ad]">
      <Link
        href="/"
        className="absolute top-8 right-8 z-50 rounded-full bg-white/15 p-1.5 transition-colors hover:bg-white/30 sm:top-8 sm:right-8 sm:p-2 md:top-10 md:right-10 md:p-2.5"
      >
        <X className="h-6 w-6 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" />
      </Link>

      <div className="flex w-full max-w-5xl">
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:w-1/2">
          <div className="mb-2">
            <h1 className="text-3xl font-light tracking-wide text-white/90 md:text-4xl lg:text-5xl">
              Restablecer
            </h1>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Contraseña
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Nueva contraseña
              </label>
              <div className={inputWrapper('nuevaContrasena', !!errors.nuevaContrasena)}>
                <Lock className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('nuevaContrasena')}
                  onFocus={() => setFocusedField('nuevaContrasena')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-white/40 transition-colors hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.nuevaContrasena && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.nuevaContrasena.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Confirmar contraseña
              </label>
              <div className={inputWrapper('confirmarContrasena', !!errors.confirmarContrasena)}>
                <Lock className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('confirmarContrasena')}
                  onFocus={() => setFocusedField('confirmarContrasena')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="shrink-0 text-white/40 transition-colors hover:text-white/80"
                >
                  {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.confirmarContrasena && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.confirmarContrasena.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-[#008585] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  'Actualizar contraseña'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-white/70">
              <Link
                href="/login"
                className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-white/80"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
          <img
            src="/assets/login-paciente.png"
            alt="Ilustración Paciente"
            className="relative z-10 max-h-[60vh] w-auto object-contain"
          />
        </div>
      </div>
    </main>
  );
}
