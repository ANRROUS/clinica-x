import { create } from 'zustand';
import type { UsuarioDTO } from '@/lib/api/types';

interface AuthStore {
  user: UsuarioDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: UsuarioDTO, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: UsuarioDTO) => void;
  hydrate: () => void;
}

const TOKEN_KEY = 'clinica_x_token';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  _hasHydrated: false,
  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('clinica_x_user', JSON.stringify(user));
    const safeToken = encodeURIComponent(token);
    document.cookie = `${TOKEN_KEY}=${safeToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('clinica_x_user');
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    localStorage.setItem('clinica_x_user', JSON.stringify(user));
    set({ user });
  },
  hydrate: () => {
    if (get()._hasHydrated) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem('clinica_x_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UsuarioDTO;
        if (user.rol === 'PACIENTE') {
          set({ user, token, isAuthenticated: true, _hasHydrated: true });
          return;
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('clinica_x_user');
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('clinica_x_user');
      }
    }
    set({ _hasHydrated: true });
  },
}));