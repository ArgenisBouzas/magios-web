import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      );
    }

    // Buscar token válido (no usado y no expirado)
    const result = await query(
      `SELECT id, token, email_destino, fecha_expiracion 
       FROM tokens_invitacion 
       WHERE token = $1 
         AND usado = false 
         AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    const tokenData = result.rows[0];
    
    return NextResponse.json({ 
      valido: true, 
      token_id: tokenData.id,
      email_destino: tokenData.email_destino,
      expiracion: tokenData.fecha_expiracion
    });

  } catch (error) {
    console.error('Error validando token:', error);
    return NextResponse.json(
      { error: 'Error al validar token' },
      { status: 500 }
    );
  }
}