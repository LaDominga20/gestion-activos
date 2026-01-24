import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD_SECRETA = "RRHH123.";

// Usamos 'export default' en lugar de 'export function'
export default function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const authCookie = request.cookies.get('auth_token');

  // Si no tiene cookie y no está en login -> Redirigir
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si TIENE cookie y ESTÁ en login -> Redirigir a Home
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}