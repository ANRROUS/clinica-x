'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Calendar, Menu, X, ClipboardList, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = user?.rol ?? null;

  const handleLogout = async () => {
    await clearAuth();
    router.push('/');
  };

  const isDoctorArea = pathname.startsWith('/doctor');
  const isAdminArea = pathname.startsWith('/admin');

  const patientLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/reservar-cita', label: 'Reservar cita' },
    { href: '/perfil', label: 'Mi Perfil' },
  ];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-[#003F86]">
          Clínica X
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>

        <nav
          className={`${
            mobileOpen ? 'flex' : 'hidden'
          } md:flex absolute left-0 right-0 top-[65px] z-50 flex-col gap-2 border-b border-gray-100 bg-white p-4 md:static md:flex-row md:items-center md:gap-8 md:border-0 md:p-0 md:shadow-none shadow-lg`}
        >
          {mounted && (
            <>
              {isAuthenticated && role === 'PACIENTE' && !isDoctorArea && !isAdminArea && (
                <>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    {patientLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`text-sm font-medium transition ${
                            isActive ? 'text-[#003F86]' : 'text-gray-600 hover:text-[#003F86]'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 md:ml-8">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-900">{user?.nombre}</span>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-gray-500 hover:text-[#003F86] transition"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008585] text-sm font-bold text-white">
                      {user?.nombre?.[0]}
                    </div>
                  </div>
                </>
              )}
              {isAuthenticated && role === 'MEDICO' && isDoctorArea && (
                <>
                  <Link
                    href="/doctor/calendario"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Calendar className="inline h-4 w-4 mr-1 md:hidden" />
                    <span className="hidden md:inline">Calendario</span>
                    <span className="md:hidden">Calendario</span>
                  </Link>
                  <Link
                    href="/doctor/pacientes"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ClipboardList className="inline h-4 w-4 mr-1 md:hidden" />
                    <span className="hidden md:inline">Pacientes</span>
                    <span className="md:hidden">Pacientes</span>
                  </Link>
                  <div className="flex items-center gap-2 md:ml-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                      {user?.nombre?.[0]}{user?.apellido?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Dr. {user?.nombre} {user?.apellido}
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
              )}
              {isAuthenticated && role === 'ADMIN' && isAdminArea && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="inline h-4 w-4 mr-1 md:hidden" />
                    <span className="hidden md:inline">Dashboard</span>
                    <span className="md:hidden">Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="inline h-4 w-4 mr-1 md:hidden" />
                    <span className="hidden md:inline">Médicos</span>
                    <span className="md:hidden">Médicos</span>
                  </Link>
                  <div className="flex items-center gap-2 md:ml-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
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
              )}
              {!isAuthenticated && (
                <>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <Link
                      href="/"
                      className={`text-sm font-medium transition ${pathname === '/' ? 'text-[#003F86]' : 'text-gray-600 hover:text-[#003F86]'}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Inicio
                    </Link>
                    <Link
                      href="/reservar-cita"
                      className={`text-sm font-medium transition ${pathname === '/reservar-cita' ? 'text-[#003F86]' : 'text-gray-600 hover:text-[#003F86]'}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Reservar cita
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 md:ml-2">
                    <Link
                      href="/login"
                      className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-md bg-[#008585] px-5 py-2 text-sm font-medium text-white hover:bg-[#007070]"
                    >
                      Registrarse
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
