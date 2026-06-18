'use client';

import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { login } from '@/lib/api/auth.api';
import { getErrorMessage } from '@/lib/api/error-utils';
import { toast } from 'sonner';

export function useDoctorAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useDoctorAuthStore();
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
          setAuth(res.data.usuario, res.data.token);
          router.push('/doctor/calendario');
          return true;
        }
        toast.error('Usuario o contraseña incorrectos');
        return false;
      } catch (err) {
        toast.error(getErrorMessage(err));
        return false;
      }
    },
    [setAuth, router]
  );

  const handleLogout = useCallback(() => {
    clearAuth();
    router.push('/doctor/login');
  }, [clearAuth, router]);

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
}
