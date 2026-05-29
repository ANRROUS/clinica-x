'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, CreditCard } from 'lucide-react';
import { login } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormContentProps {
  onSuccess?: () => void;
}

export default function LoginFormContent({ onSuccess }: LoginFormContentProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await login(data);
      if (res.success && res.data) {
        setAuth(res.data.usuario, res.data.token);
        toast.success('Sesión iniciada correctamente');
        if (onSuccess) {
          onSuccess();
        } else {
          const returnUrl = sessionStorage.getItem('returnUrl') || '/perfil';
          sessionStorage.removeItem('returnUrl');
          router.push(returnUrl);
        }
      } else {
        toast.error(res.error?.mensaje || 'Credenciales inválidas');
      }
    } catch {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = (fieldName: string, hasError: boolean) =>
    `group flex items-center gap-3 rounded-full bg-gray-50 px-4 py-3 transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-[#31b9ad] bg-white shadow-md shadow-[#31b9ad]/10'
        : 'border-gray-200 hover:border-gray-300'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
        <p className="mt-1 text-sm text-gray-500">Inicia sesión en tu cuenta</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* DNI */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            DNI / Cédula de extranjería
          </label>
          <div className={inputWrapper('dni', !!errors.dni)}>
            <CreditCard className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#31b9ad]" />
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
            <p className="text-xs font-medium text-red-500">{errors.dni.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <div className={inputWrapper('email', !!errors.email)}>
            <Mail className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#31b9ad]" />
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
            <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <div className={inputWrapper('password', !!errors.password)}>
            <Lock className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-focus-within:text-[#31b9ad]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <a
            href="/forgot-password"
            className="text-xs font-medium text-[#31b9ad] transition-colors hover:text-[#008585]"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#31b9ad] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#31b9ad]/20 transition-all duration-300 hover:bg-[#008585] hover:shadow-lg hover:shadow-[#008585]/20 disabled:opacity-50"
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
              Ingresando...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#31b9ad] underline underline-offset-2 transition-colors hover:text-[#008585]"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
