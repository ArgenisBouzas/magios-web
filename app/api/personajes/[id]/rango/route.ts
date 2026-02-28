// app/api/personajes/[id]/rango/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener el ID de los parámetros (Next.js 15 requiere await)
    const { id } = await params;
    
    // Verificar autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definido');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    // Verificar que el usuario tiene rango General
    if (payload.rango !== 'General') {
      return NextResponse.json(
        { error: 'Solo los Generales pueden cambiar rangos' },
        { status: 403 }
      );
    }

    // Obtener el nuevo rango del body
    const body = await request.json();
    const { nuevoRango } = body;

    if (!nuevoRango) {
      return NextResponse.json(
        { error: 'El nuevo rango es requerido' },
        { status: 400 }
      );
    }

    // Validar que el rango sea válido
    const rangosValidos = ['General', 'Oficial', 'Miembro', 'Aspirante'];
    if (!rangosValidos.includes(nuevoRango)) {
      return NextResponse.json(
        { error: 'Rango no válido' },
        { status: 400 }
      );
    }

    // Verificar que el personaje existe
    const personajeResult = await query(
      'SELECT id FROM personajes WHERE id = $1',
      [id]
    );

    if (personajeResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Personaje no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el rango del personaje
    await query(
      'UPDATE personajes SET rango = $1 WHERE id = $2',
      [nuevoRango, id]
    );

    return NextResponse.json({ 
      message: 'Rango actualizado correctamente',
      nuevoRango 
    });

  } catch (error) {
    console.error('Error al actualizar rango:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el rango' },
      { status: 500 }
    );
  }
}