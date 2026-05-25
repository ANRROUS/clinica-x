'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { href: '/doctor/calendario', label: 'Calendario', icon: Calendar },
  { href: '/doctor/pacientes', label: 'Pacientes', icon: Users },
];

export default function DoctorHeader() {
  const { user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await clearAuth();
    router.push('/doctor/login');
  };

  const initials = user
    ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-6 w-6 text-brand-500" />
        <span className="text-lg font-bold text-gray-900">Portal Médico</span>
      </div>

      <nav className="flex items-center gap-1">
        {navItems.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700 underline decoration-2 underline-offset-4'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            Dr/a. {user?.nombre} {user?.apellido}
          </p>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
          {initials || '?'}
        </div>
      </div>
    </header>
  );
}
