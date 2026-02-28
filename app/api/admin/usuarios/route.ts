import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verificarToken } from '@/lib/auth';

export async function GET() {
  try {
    const { payload, error } = await verificarToken();
    
    if (!payload) {
      return NextResponse.json(
        { error: error || 'No autorizado' },
        { status: 401 }
      );
    }

    // Solo Generales pueden ver todos los usuarios
    if (payload.rango !== 'General') {
      return NextResponse.json(
        { error: 'No tienes permisos para ver esta información' },
        { status: 403 }
      );
    }

    const result = await query(`
      SELECT 
        u.id,
        u.nombre_usuario,
        u.email,
        u.rango,
        u.fecha_registro,
        u.ultimo_acceso,
        u.activo,
        COUNT(p.id) as total_personajes
      FROM usuarios u
      LEFT JOIN personajes p ON u.id = p.usuario_id AND p.activo = true
      GROUP BY u.id
      ORDER BY 
        CASE 
          WHEN u.rango = 'General' THEN 1
          WHEN u.rango = 'Oficial' THEN 2
          WHEN u.rango = 'Miembro' THEN 3
          ELSE 4
        END,
        u.nombre_usuario
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { payload, error } = await verificarToken();
    
    if (!payload) {
      return NextResponse.json(
        { error: error || 'No autorizado' },
        { status: 401 }
      );
    }

    if (payload.rango !== 'General') {
      return NextResponse.json(
        { error: 'Solo los Generales pueden cambiar rangos' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { usuarioId, nuevoRango } = body;

    if (!usuarioId || !nuevoRango) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // No permitir cambiar el propio rango
    if (usuarioId === payload.id) {
      return NextResponse.json(
        { error: 'No puedes cambiar tu propio rango' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE usuarios SET rango = $1 WHERE id = $2',
      [nuevoRango, usuarioId]
    );

    return NextResponse.json({ message: 'Rango actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar rango:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el rango' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { payload, error } = await verificarToken();
    
    if (!payload) {
      return NextResponse.json(
        { error: error || 'No autorizado' },
        { status: 401 }
      );
    }

    if (payload.rango !== 'General') {
      return NextResponse.json(
        { error: 'Solo los Generales pueden eliminar usuarios' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('id');

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // No permitir eliminarse a sí mismo
    if (parseInt(usuarioId) === payload.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      );
    }

    // Soft delete (desactivar usuario)
    await query(
      'UPDATE usuarios SET activo = false WHERE id = $1',
      [usuarioId]
    );

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}