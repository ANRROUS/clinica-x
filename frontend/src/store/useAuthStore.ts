import { create } from 'zustand';
import type { UsuarioDTO } from '@/lib/api/types';
import { getMe, logoutApi } from '@/lib/api/auth.api';

const USER_KEY = 'clinica_x_user';
const AUTH_ROLE_COOKIE = 'auth_role';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';

interface AuthStore {
  user: UsuarioDTO | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: UsuarioDTO) => void;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

function setRoleCookie(rol: Rol | null) {
  if (typeof window === 'undefined') return;
  if (rol) {
    document.cookie = `${AUTH_ROLE_COOKIE}=${rol}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  _hasHydrated: false,

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setRoleCookie(user.rol as Rol);
    set({ user, isAuthenticated: true, _hasHydrated: true });
  },

  clearAuth: async () => {
    try {
      await logoutApi();
    } catch {
      // el endpoint de logout limpia la cookie httpOnly; ignoramos errores
    }
    localStorage.removeItem(USER_KEY);
    setRoleCookie(null);
    set({ user: null, isAuthenticated: false, _hasHydrated: true });
  },

  hydrate: async () => {
    if (get()._hasHydrated) return;

    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as UsuarioDTO;
        set({ user, isAuthenticated: true, _hasHydrated: true });
      } catch {
        localStorage.removeItem(USER_KEY);
        set({ user: null, isAuthenticated: false, _hasHydrated: true });
      }
    } else {
      set({ _hasHydrated: true });
    }

    try {
      const res = await getMe();
      if (res.success && res.data) {
        const user = res.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setRoleCookie(user.rol as Rol);
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Si getMe() falla, mantenemos el estado de localStorage
      // El interceptor 401 de axios maneja tokens expirados
    }
  },
}));
