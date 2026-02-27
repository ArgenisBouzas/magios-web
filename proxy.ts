// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/validar-token'];
const adminPaths = ['/admin', '/api/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Permitir rutas públicas
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. Si no hay token y no es ruta pública, redirigir a login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callback', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 3. Verificar rutas de admin
    if (adminPaths.some(path => pathname.startsWith(path))) {
      if (payload.rango !== 'General' && payload.rango !== 'Oficial') {
        // Si no es admin, redirigir al inicio
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // 4. Añadir info del usuario a headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id as string);
    requestHeaders.set('x-user-rango', payload.rango as string);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });

  } catch (error) {
    // Token inválido - redirigir a login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};