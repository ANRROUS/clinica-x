'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HeartPulse } from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/doctors/new', label: 'Nuevo Doctor' },
  { href: '/admin/test-ocr', label: 'Test OCR' },
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
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold" style={{ color: '#008585' }}>
          <span>Portal Admin</span>
          <HeartPulse className="h-6 w-6" />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-10">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === '/admin/dashboard'
                ? pathname === '/admin/dashboard'
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="text-base font-medium transition-colors"
                style={{ color: isActive ? '#003F86' : '#9CA3AF' }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Admin</p>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cerrar sesión
            </button>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#9C27B0' }}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}