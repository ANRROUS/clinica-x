'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, CreditCard, User, Phone, X } from 'lucide-react';
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

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
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
        setUser(res.data.usuario);
        toast.success('Cuenta creada correctamente');
        const returnUrl = sessionStorage.getItem('returnUrl') || '/perfil';
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
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
    `group flex items-center gap-3 rounded-full bg-white/10 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 border ${
      focusedField === fieldName
        ? 'border-white/40 bg-white/15 shadow-lg shadow-black/10'
        : 'border-transparent hover:border-white/20'
    } ${hasError ? 'border-red-300/50 ring-1 ring-red-300/30' : ''}`;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#31b9ad]">
      {/* Close Button */}
      <Link
        href="/"
        className="absolute top-8 right-8 z-50 rounded-full bg-white/15 p-1.5 transition-colors hover:bg-white/30 sm:top-8 sm:right-8 sm:p-2 md:top-10 md:right-10 md:p-2.5"
      >
        <X className="h-6 w-6 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" />
      </Link>

      {/* Central Container */}
      <div className="flex w-full max-w-5xl">
        {/* Left side - Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:w-1/2">
          <div className="mb-2">
            <h1 className="text-3xl font-light tracking-wide text-white/90 md:text-4xl lg:text-5xl">
              Regístrate en
            </h1>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Clínica X
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-3">
          {/* Row 1: Nombre | Apellido */}
          <div className="grid grid-cols-2 gap-3 ">
            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Nombre
              </label>
              <div className={inputWrapper('nombre', !!errors.nombre)}>
                <User className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type="text"
                  placeholder="Juan"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('nombre')}
                  onFocus={() => setFocusedField('nombre')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.nombre && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Apellido
              </label>
              <div className={inputWrapper('apellido', !!errors.apellido)}>
                <User className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type="text"
                  placeholder="Pérez"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('apellido')}
                  onFocus={() => setFocusedField('apellido')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.apellido && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: DNI | Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                DNI
              </label>
              <div className={inputWrapper('dni', !!errors.dni)}>
                <CreditCard className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="12345678"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('dni', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                    },
                  })}
                  onFocus={() => setFocusedField('dni')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.dni && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.dni.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Teléfono <span className="text-white/50">(opc.)</span>
              </label>
              <div className={inputWrapper('telefono', !!errors.telefono)}>
                <Phone className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="999888777"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('telefono', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    },
                  })}
                  onFocus={() => setFocusedField('telefono')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.telefono && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.telefono.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Email (full width) */}
          <div className="space-y-1">
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
              <p className="ml-1 text-xs font-medium text-red-700/80">{errors.email.message}</p>
            )}
          </div>

          {/* Row 4: Contraseña | Confirmar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Contraseña
              </label>
              <div className={inputWrapper('password', !!errors.password)}>
                <Lock className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8+ chars"
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
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-xs font-medium uppercase tracking-wider text-white">
                Confirmar
              </label>
              <div className={inputWrapper('confirmPassword', !!errors.confirmPassword)}>
                <Lock className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-white/80" />
                <input
                  type="password"
                  placeholder="Repite"
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  {...register('confirmPassword')}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.confirmPassword && (
                <p className="ml-1 text-xs font-medium text-red-700/80">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-[#008585] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-white/70">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-white/80"
            >
              Ingresar
            </Link>
          </p>
          </form>
        </div>

        {/* Right side - Illustration */}
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
