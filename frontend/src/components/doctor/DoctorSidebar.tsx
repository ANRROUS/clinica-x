'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, Calendar, Users, LogOut, Activity } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';

const navItems = [
  { href: '/doctor/calendario', label: 'Calendario', icon: Calendar },
  { href: '/doctor/pacientes', label: 'Pacientes', icon: Users },
];

export default function DoctorSidebar() {
  const { user, clearAuth } = useDoctorAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/doctor/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <Stethoscope className="h-6 w-6 text-indigo-600" />
        <span className="text-lg font-bold text-gray-900">Clínica X</span>
      </div>

      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Dr/a. {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}