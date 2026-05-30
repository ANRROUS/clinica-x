import { create } from 'zustand';
import type { UsuarioDTO } from '@/lib/api/types';
import { getMe } from '@/lib/api/auth.api';

const TOKEN_KEY = 'clinica_x_token';
const USER_KEY = 'clinica_x_user';
const AUTH_ROLE_COOKIE = 'auth_role';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';

interface AuthStore {
  user: UsuarioDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: UsuarioDTO, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: UsuarioDTO) => void;
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

function setTokenCookie(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    const safeToken = encodeURIComponent(token);
    document.cookie = `${TOKEN_KEY}=${safeToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  _hasHydrated: false,

  setUser: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setTokenCookie(token);
    setRoleCookie(user.rol as Rol);
    set({ user, token, isAuthenticated: true, _hasHydrated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setTokenCookie(null);
    setRoleCookie(null);
    set({ user: null, token: null, isAuthenticated: false, _hasHydrated: true });
  },

  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  hydrate: async () => {
    if (get()._hasHydrated) return;

    // 1. Hidratar desde localStorage inmediatamente
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UsuarioDTO;
        setTokenCookie(token);
        setRoleCookie(user.rol as Rol);
        set({ user, token, isAuthenticated: true, _hasHydrated: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        set({ user: null, token: null, isAuthenticated: false, _hasHydrated: true });
      }
    } else {
      set({ _hasHydrated: true });
    }

    // 2. Validar contra el backend con getMe()
    const currentToken = get().token;
    if (!currentToken) return;

    try {
      const res = await getMe();
      if (res.success && res.data) {
        const user = res.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setRoleCookie(user.rol as Rol);
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Si getMe() falla con 401, el interceptor de axios limpia el estado
    }
  },
}));
