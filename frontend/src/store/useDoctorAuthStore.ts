import { create } from 'zustand';
import type { UsuarioDTO } from '@/lib/api/types';

interface DoctorAuthStore {
  user: UsuarioDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UsuarioDTO, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: UsuarioDTO) => void;
}

const TOKEN_KEY = 'clinica_x_doctor_token';
const USER_KEY = 'clinica_x_doctor_user';

function loadStoredAuth(): { user: UsuarioDTO | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as UsuarioDTO;
      if (user.rol === 'MEDICO') {
        return { user, token };
      }
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return { user: null, token: null };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return { user: null, token: null };
    }
  }
  return { user: null, token: null };
}

export const useDoctorAuthStore = create<DoctorAuthStore>((set) => {
  const stored = loadStoredAuth();
  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token && stored.user?.rol === 'MEDICO',
    setAuth: (user, token) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      const safeToken = encodeURIComponent(token);
      document.cookie = `${TOKEN_KEY}=${safeToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
      set({ user: null, token: null, isAuthenticated: false });
    },
    updateUser: (user) => {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
    },
  };
});