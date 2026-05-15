'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api/auth.api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

const adminLoginSchema = z.object({
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginForm() {
  const router = useRouter();
  const { setAuth } = useAdminAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setLoading(true);
    try {
      const res = await login(data);
      if (res.success && res.data) {
        if (res.data.usuario.rol !== 'ADMIN') {
          toast.error('Este portal es exclusivo para administradores.');
          return;
        }
        setAuth(res.data.usuario, res.data.token);
        toast.success('Bienvenido, Admin');
        router.push('/admin/dashboard');
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-emerald-700">
          <Shield className="h-7 w-7" />
          Clínica X
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Portal Admin</h1>
        <p className="mb-6 text-sm text-gray-600">
          Ingresa tus credenciales para acceder al panel de administración.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">DNI</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ej. 12345678"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              {...register('dni')}
            />
            {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@clinica.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </main>
  );
}