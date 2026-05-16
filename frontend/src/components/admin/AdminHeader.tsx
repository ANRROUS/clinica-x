'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UserPlus, LogOut } from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/doctors/new', label: 'Nuevo Doctor', icon: UserPlus },
];

export default function AdminHeader() {
  const { user, clearAuth } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  const initials = user
    ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase()
    : 'A';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-bold text-teal-700">
            <span className="text-xl">🩺</span>
            Portal Admin
          </Link>
          <nav className="hidden sm:flex sm:items-center sm:gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/admin/dashboard'
                ? pathname === '/admin/dashboard'
                : pathname.startsWith('/admin/doctors');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user?.nombre} {user?.apellido}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}