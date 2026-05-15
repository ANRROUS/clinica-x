import { create } from 'zustand';
import type { UsuarioDTO } from '@/lib/api/types';

interface AuthStore {
  user: UsuarioDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UsuarioDTO, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: UsuarioDTO) => void;
}

const TOKEN_KEY = 'clinica_x_token';

function loadStoredAuth(): { user: UsuarioDTO | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem('clinica_x_user');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as UsuarioDTO;
      return { user, token };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('clinica_x_user');
      return { user: null, token: null };
    }
  }
  return { user: null, token: null };
}

export const useAuthStore = create<AuthStore>((set) => {
  const stored = loadStoredAuth();
  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token,
    setAuth: (user, token) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('clinica_x_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('clinica_x_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
    updateUser: (user) => {
      localStorage.setItem('clinica_x_user', JSON.stringify(user));
      set({ user });
    },
  };
});