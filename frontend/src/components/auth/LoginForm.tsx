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

export default function LoginForm() {
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

  const inputWrapper = (fieldName: string, hasError: boolean) =>
    `group flex items-center gap-3 rounded-full bg-white/10 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-white/40 bg-white/15 shadow-lg shadow-black/10'
        : 'border-transparent hover:border-white/20'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  return (
    <main className="flex min-h-screen w-full bg-[#3BA99F]">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:w-1/2">
        <div className="mb-2">
          <h1 className="text-3xl font-light tracking-wide text-white/90 md:text-4xl lg:text-5xl">
            Bienvenido a
          </h1>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Clínica X
          </h2>
        </div>

        <p className="mb-10 text-sm font-light text-white/70">
          Ingresa tus credenciales para acceder a tu portal
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          {/* DNI */}
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
              DNI / Cédula de extranjería
            </label>
            <div className={inputWrapper('dni', !!errors.dni)}>
              <CreditCard className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="12345678"
                className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                {...register('dni')}
                onFocus={() => setFocusedField('dni')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.dni && (
              <p className="ml-1 text-xs font-medium text-red-200">{errors.dni.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
              Correo electrónico
            </label>
            <div className={inputWrapper('email', !!errors.email)}>
              <Mail className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                {...register('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.email && (
              <p className="ml-1 text-xs font-medium text-red-200">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
              Contraseña
            </label>
            <div className={inputWrapper('password', !!errors.password)}>
              <Lock className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                {...register('password')}
                onFocus={() => setFocusedField('password')}
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
            {errors.password && (
              <p className="ml-1 text-xs font-medium text-red-200">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <a
              href="/forgot-password"
              className="text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              ¿Olvidaste tu contraseña?
            </a>
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
                  Ingresando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-white/70">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-white/80"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>

      {/* Right side - Illustration with organic wave shape */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* <svg
          className="absolute right-0 top-1/2 h-[85%] w-[90%] -translate-y-1/2"
          viewBox="0 0 500 600"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 80,40
               C 180,0 320,0 420,40
               S 500,180 470,300
               S 380,520 250,570
               S 80,520 40,380
               S 0,160 80,40
               Z"
            fill="white"
          />
        </svg> */}
        <img
          src="/assets/login-paciente.png"
          alt="Ilustración Paciente"
          className="relative z-10 max-h-[65%] w-auto object-contain drop-shadow-xl"
        />
      </div>
    </main>
  );
}
