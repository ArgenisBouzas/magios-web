// lib/auth.ts
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface JWTPayload {
  id: number;
  nombre_usuario: string;
  rango: string;
}

export async function verificarToken(): Promise<{ payload: JWTPayload | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { payload: null, error: 'No hay token de autenticación' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no está definido');
      return { payload: null, error: 'Error de configuración del servidor' };
    }

    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    
    return { 
      payload: payload as unknown as JWTPayload, 
      error: null 
    };
  } catch (error) {
    console.error('Error verificando token:', error);
    return { payload: null, error: 'Token inválido o expirado' };
  }
}