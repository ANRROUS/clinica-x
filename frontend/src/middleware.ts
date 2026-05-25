import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Rol = 'PACIENTE' | 'MEDICO' | 'ADMIN';

const AUTH_ROLE_COOKIE = 'auth_role';

const HOME: Record<Rol, string> = {
  PACIENTE: '/perfil',
  MEDICO: '/doctor/calendario',
  ADMIN: '/admin/dashboard',
};

function getRolFromCookie(request: NextRequest): Rol | null {
  const raw = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  if (raw === 'PACIENTE' || raw === 'MEDICO' || raw === 'ADMIN') return raw;
  return null;
}

function redirectToRoleHome(rol: Rol, request: NextRequest) {
  return NextResponse.redirect(new URL(HOME[rol], request.url));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rol = getRolFromCookie(request);

  // ── DOCTOR ────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/doctor')) {
    if (pathname === '/doctor/login') {
      if (rol === 'MEDICO') {
        return redirectToRoleHome('MEDICO', request);
      }
      if (rol) {
        return redirectToRoleHome(rol, request);
      }
      return NextResponse.next();
    }
    if (rol !== 'MEDICO') {
      const redirect = rol ? HOME[rol] : '/doctor/login';
      const response = NextResponse.redirect(new URL(redirect, request.url));
      response.cookies.delete(AUTH_ROLE_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (rol === 'ADMIN') {
        return redirectToRoleHome('ADMIN', request);
      }
      if (rol) {
        return redirectToRoleHome(rol, request);
      }
      return NextResponse.next();
    }
    if (rol !== 'ADMIN') {
      const redirect = rol ? HOME[rol] : '/admin/login';
      const response = NextResponse.redirect(new URL(redirect, request.url));
      response.cookies.delete(AUTH_ROLE_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  // ── PACIENTE — login ──────────────────────────────────────────────────────
  if (pathname === '/login') {
    if (rol === 'PACIENTE') {
      return redirectToRoleHome('PACIENTE', request);
    }
    if (rol) {
      return redirectToRoleHome(rol, request);
    }
    return NextResponse.next();
  }

  // ── PACIENTE — rutas protegidas ───────────────────────────────────────────
  if (pathname.startsWith('/perfil') || pathname.startsWith('/reservar-cita')) {
    if (rol !== 'PACIENTE') {
      const redirect = rol ? HOME[rol] : '/login';
      const response = NextResponse.redirect(new URL(redirect, request.url));
      response.cookies.delete(AUTH_ROLE_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/doctor/:path*',
    '/admin/:path*',
    '/login',
    '/perfil/:path*',
    '/reservar-cita/:path*',
  ],
};
