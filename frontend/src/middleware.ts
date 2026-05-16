import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOCTOR_TOKEN_KEY = 'clinica_x_doctor_token';

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawToken = request.cookies.get(DOCTOR_TOKEN_KEY)?.value;

  if (pathname.startsWith('/doctor')) {
    if (pathname === '/doctor/login') {
      if (rawToken) {
        const safeToken = decodeURIComponent(rawToken);
        const payload = decodeJwtPayload(safeToken);
        if (payload?.role === 'MEDICO') {
          return NextResponse.redirect(new URL('/doctor/calendario', request.url));
        }
      }
      return NextResponse.next();
    }

    if (!rawToken) {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }

    const safeToken = decodeURIComponent(rawToken);
    const payload = decodeJwtPayload(safeToken);
    if (payload?.role !== 'MEDICO') {
      const response = NextResponse.redirect(new URL('/doctor/login', request.url));
      response.cookies.delete(DOCTOR_TOKEN_KEY);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/doctor/:path*'],
};
