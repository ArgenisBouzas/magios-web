// app/api/personajes/[id]/nivel/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const usuarioId = payload.id;

    const body = await request.json();
    const { nivel } = body;

    if (!nivel || nivel < 1 || nivel > 60) {
      return NextResponse.json(
        { error: 'El nivel debe estar entre 1 y 60' },
        { status: 400 }
      );
    }

    // Verificar permisos: 
    // - El propietario del personaje
    // - Generales y Oficiales pueden editar cualquier personaje
    if (payload.rango === 'General' || payload.rango === 'Oficial') {
      // Es General u Oficial - puede editar cualquier personaje
      await query(
        'UPDATE personajes SET nivel = $1 WHERE id = $2',
        [nivel, id]
      );
    } else {
      // No es admin - verificar que sea el propietario
      const verifyResult = await query(
        'SELECT id FROM personajes WHERE id = $1 AND usuario_id = $2',
        [id, usuarioId]
      );

      if (verifyResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'No tienes permiso para editar este personaje' },
          { status: 403 }
        );
      }

      await query(
        'UPDATE personajes SET nivel = $1 WHERE id = $2',
        [nivel, id]
      );
    }

    return NextResponse.json({ message: 'Nivel actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar nivel:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el nivel' },
      { status: 500 }
    );
  }
}