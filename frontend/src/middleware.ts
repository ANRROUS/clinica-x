import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_KEYS = {
  paciente: 'clinica_x_token',
  medico: 'clinica_x_doctor_token',
  admin: 'clinica_x_admin_token',
} as const;

const HOME = {
  paciente: '/perfil',
  medico: '/doctor/calendario',
  admin: '/admin/dashboard',
} as const;

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

function decodeJwtPayload(token: string): { rol?: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getPayloadFromCookie(
  request: NextRequest,
  cookieKey: string,
): { rol?: string } | null {
  const raw = request.cookies.get(cookieKey)?.value;
  if (!raw) return null;
  return decodeJwtPayload(decodeURIComponent(raw));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── DOCTOR ────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/doctor')) {
    const payload = getPayloadFromCookie(request, TOKEN_KEYS.medico);

    if (pathname === '/doctor/login') {
      if (payload?.rol === 'MEDICO') {
        return NextResponse.redirect(new URL(HOME.medico, request.url));
      }
      return NextResponse.next();
    }

    if (payload?.rol !== 'MEDICO') {
      const response = NextResponse.redirect(new URL('/doctor/login', request.url));
      response.cookies.delete(TOKEN_KEYS.medico);
      return response;
    }
    return NextResponse.next();
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const payload = getPayloadFromCookie(request, TOKEN_KEYS.admin);

    if (pathname === '/admin/login') {
      if (payload?.rol === 'ADMIN') {
        return NextResponse.redirect(new URL(HOME.admin, request.url));
      }
      return NextResponse.next();
    }

    if (payload?.rol !== 'ADMIN') {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(TOKEN_KEYS.admin);
      return response;
    }
    return NextResponse.next();
  }

  // ── PACIENTE — rutas públicas de auth (login, register, forgot-password, reset-password)
  // Si ya está autenticado como paciente, redirigir al perfil
  if (AUTH_ROUTES.includes(pathname)) {
    const payload = getPayloadFromCookie(request, TOKEN_KEYS.paciente);
    if (payload?.rol === 'PACIENTE') {
      return NextResponse.redirect(new URL(HOME.paciente, request.url));
    }
    return NextResponse.next();
  }

  // ── PACIENTE — rutas protegidas ───────────────────────────────────────────
  if (pathname === '/perfil' || pathname.startsWith('/perfil/') ||
      pathname === '/reservar-cita' || pathname.startsWith('/reservar-cita/')) {
    const payload = getPayloadFromCookie(request, TOKEN_KEYS.paciente);
    if (payload?.rol !== 'PACIENTE') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(TOKEN_KEYS.paciente);
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
    '/register',
    '/forgot-password',
    '/reset-password',
    '/perfil',
    '/perfil/:path*',
    '/reservar-cita',
    '/reservar-cita/:path*',
  ],
};
