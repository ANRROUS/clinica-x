'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, LogOut, User, Calendar, Menu, X, ClipboardList, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

type ActiveRole = 'PACIENTE' | 'MEDICO' | 'ADMIN' | null;

function getActiveRole(
  patientAuth: boolean, patientUser: { rol?: string } | null,
  doctorAuth: boolean, doctorUser: { rol?: string } | null,
  adminAuth: boolean, adminUser: { rol?: string } | null,
): { role: ActiveRole; user: { nombre?: string; apellido?: string; rol?: string } | null; token: string | null } {
  if (adminAuth && adminUser?.rol === 'ADMIN') {
    return { role: 'ADMIN', user: adminUser, token: null };
  }
  if (doctorAuth && doctorUser?.rol === 'MEDICO') {
    return { role: 'MEDICO', user: doctorUser, token: null };
  }
  if (patientAuth && patientUser?.rol === 'PACIENTE') {
    return { role: 'PACIENTE', user: patientUser, token: null };
  }
  return { role: null, user: null, token: null };
}

export default function Header() {
  const { user: patientUser, isAuthenticated: patientAuth, clearAuth: clearPatientAuth } = useAuthStore();
  const { user: doctorUser, isAuthenticated: doctorAuth, clearAuth: clearDoctorAuth } = useDoctorAuthStore();
  const { user: adminUser, isAuthenticated: adminAuth, clearAuth: clearAdminAuth } = useAdminAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { role, user } = getActiveRole(
    patientAuth, patientUser,
    doctorAuth, doctorUser,
    adminAuth, adminUser,
  );

  const handleLogout = () => {
    clearPatientAuth();
    clearDoctorAuth();
    clearAdminAuth();
    router.push('/');
  };

  const isDoctorArea = pathname.startsWith('/doctor');
  const isAdminArea = pathname.startsWith('/admin');

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
          {role === 'PACIENTE' && !isDoctorArea && !isAdminArea && (
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
          )}
          {role === 'MEDICO' && isDoctorArea && (
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
          {role === 'ADMIN' && isAdminArea && (
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
                href="/admin/medicos"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setMobileOpen(false)}
              >
                <User className="inline h-4 w-4 mr-1 md:hidden" />
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
          {!role && (
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