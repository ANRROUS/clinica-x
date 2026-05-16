'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api/auth.api';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';

const doctorLoginSchema = z.object({
  email: z.string().email('Usuario inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type DoctorLoginForm = z.infer<typeof doctorLoginSchema>;

export default function DoctorLoginForm() {
  const { setAuth } = useDoctorAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorLoginForm>({
    resolver: zodResolver(doctorLoginSchema),
  });

  const onSubmit = async (data: DoctorLoginForm) => {
    setLoading(true);
    try {
      const res = await login(data);
      if (res.success && res.data) {
        if (res.data.usuario.rol !== 'MEDICO') {
          toast.error('Credenciales inválidas');
          return;
        }
        setAuth(res.data.usuario, res.data.token);
        toast.success('Bienvenido al Portal Médico');
        window.location.href = '/doctor/calendario';
      } else {
        toast.error('Usuario o contraseña incorrectos');
      }
    } catch {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-indigo-700">
          <Stethoscope className="h-7 w-7" />
          Portal Médico
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Portal Médico'}
          </button>
        </form>
      </div>
    </main>
  );
}
