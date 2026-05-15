'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, LogOut, User, Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const isPatient = user?.rol === 'PACIENTE';
  const showPatientNav = isAuthenticated && isPatient;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <Stethoscope className="h-6 w-6" />
          Clínica X
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <nav
          className={`${
            mobileOpen ? 'flex' : 'hidden'
          } md:flex absolute left-0 right-0 top-[65px] flex-col gap-2 border-b border-gray-200 bg-white p-4 md:static md:flex-row md:items-center md:gap-3 md:border-0 md:p-0`}
        >
          {showPatientNav ? (
            <>
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => setMobileOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/reservar-cita"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => setMobileOpen(false)}
              >
                <span className="hidden md:inline">Reservar Cita</span>
                <span className="md:hidden">Reservar Cita</span>
              </Link>
              <Link
                href="/perfil"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => setMobileOpen(false)}
              >
                Mi Perfil
              </Link>
              <div className="flex items-center gap-2 md:ml-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {user?.nombre?.[0]}{user?.apellido?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="md:hidden">Cerrar sesión</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-brand-500 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}