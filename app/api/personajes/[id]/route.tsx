// app/api/personajes/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// GET: Obtener un personaje específico (cualquier usuario logueado puede verlo)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar que el usuario está logueado (opcional, pero recomendado)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver personajes' },
        { status: 401 }
      );
    }

    // Solo verificamos que el token es válido, no importa qué usuario sea
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    
    const personajeId = parseInt(id);

    // QUITAMOS la condición de usuario_id = $2
    // Ahora cualquier usuario logueado puede ver cualquier personaje activo
    const result = await query(
      `SELECT * FROM personajes 
       WHERE id = $1 AND activo = true`,
      [personajeId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Personaje no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ personaje: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener personaje:', error);
    return NextResponse.json(
      { error: 'Error al cargar personaje' },
      { status: 500 }
    );
  }
}

// DELETE: Solo el propietario puede eliminar su personaje
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    const personajeId = parseInt(id);

    // Verificar que el personaje pertenece al usuario (solo para DELETE)
    const verifyResult = await query(
      'SELECT id FROM personajes WHERE id = $1 AND usuario_id = $2',
      [personajeId, usuarioId]
    );

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este personaje' },
        { status: 403 }
      );
    }

    // Desactivar personaje (soft delete)
    await query(
      'UPDATE personajes SET activo = false WHERE id = $1',
      [personajeId]
    );

    return NextResponse.json({ message: 'Personaje desactivado' });
  } catch (error) {
    console.error('Error al desactivar personaje:', error);
    return NextResponse.json(
      { error: 'Error al desactivar personaje' },
      { status: 500 }
    );
  }
}