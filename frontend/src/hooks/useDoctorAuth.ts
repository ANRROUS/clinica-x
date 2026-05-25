'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { login } from '@/lib/api/auth.api';
import { toast } from 'sonner';

export function useDoctorAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await login({ email, password });
        if (res.success && res.data) {
          if (res.data.usuario.rol !== 'MEDICO') {
            toast.error('Credenciales inválidas');
            return false;
          }
          setUser(res.data.usuario);
          router.push('/doctor/calendario');
          return true;
        }
        toast.error('Usuario o contraseña incorrectos');
        return false;
      } catch {
        toast.error('Error de conexión. Intenta de nuevo.');
        return false;
      }
    },
    [setUser, router]
  );

  const handleLogout = useCallback(async () => {
    await clearAuth();
    router.push('/doctor/login');
  }, [clearAuth, router]);

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
}
