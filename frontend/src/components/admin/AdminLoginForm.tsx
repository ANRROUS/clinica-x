'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Shield, Mail, Lock } from 'lucide-react';
import { login } from '@/lib/api/auth.api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

const adminLoginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginForm() {
  const router = useRouter();
  const { setAuth } = useAdminAuthStore();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const inputWrapper = (fieldName: string, hasError: boolean) =>
    `group flex items-center gap-2.5 rounded-xl bg-[#7FCDCD]/60 px-4 py-2.5 transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-white/30 bg-[#7FCDCD]/80 shadow-lg shadow-black/10'
        : 'border-transparent hover:border-white/10'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  return (
    <main className="flex min-h-screen w-full bg-[#006666]">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-8 sm:px-12 md:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Portal Admin
            </h1>
            <p className="mt-1 text-xs font-light text-white/60">
              Ingresa tus credenciales de acceso
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Usuario */}
            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Correo electrónico
              </label>
              <div className={inputWrapper('email', !!errors.email)}>
                <Mail className="h-4 w-4 shrink-0 text-[#006666]/50 transition-colors group-focus-within:text-[#006666]" />
                <input
                  type="email"
                  placeholder="admin@clinica.com"
                  className="w-full bg-transparent text-sm font-medium text-[#006666] placeholder-[#006666]/40 outline-none"
                  {...register('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.email && (
                <p className="ml-1 text-[10px] font-medium text-red-200">{errors.email.message}</p>
              )}
            </div>

            {/* Credencial */}
            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Contraseña
              </label>
              <div className={inputWrapper('password', !!errors.password)}>
                <Lock className="h-4 w-4 shrink-0 text-[#006666]/50 transition-colors group-focus-within:text-[#006666]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-medium text-[#006666] placeholder-[#006666]/40 outline-none"
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.password && (
                <p className="ml-1 text-[10px] font-medium text-red-200">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#004d4d] px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#003d3d] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Wavy white shape */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 500 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,0
               C 120,0 160,100 120,200
               S 40,300 120,400
               S 40,500 120,600
               S 40,700 120,800
               L 500,800
               L 500,0
               Z"
            fill="white"
          />
        </svg>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8">
          <div className="absolute top-12 right-12 flex items-center gap-3 text-3xl font-bold text-[#006666]">
            Portal Admin
            <Shield className="h-8 w-8" />
          </div>
          <img
            src="/assets/login-admin.png"
            alt="Ilustración Admin"
            className="max-h-[50%] w-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </main>
  );
}
