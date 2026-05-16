'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
        const returnUrl = sessionStorage.getItem('returnUrl') || '/perfil';
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        toast.error(res.error?.mensaje || 'Credenciales inválidas');
      }
    } catch {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-brand-700">
          <Stethoscope className="h-7 w-7" />
          Clínica X
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Ingresar</h1>
        <p className="mb-6 text-sm text-gray-600">
          Ingresa tu DNI, correo electrónico y contraseña para acceder.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">DNI</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ej. 12345678"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              {...register('dni')}
            />
            {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </p>

        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}