// app/api/personajes/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    // Verificar usuario autenticado
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

    // Obtener personajes del usuario
    const result = await query(
      `SELECT * FROM personajes 
       WHERE usuario_id = $1 AND activo = true 
       ORDER BY fecha_creacion DESC`,
      [usuarioId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener personajes:', error);
    return NextResponse.json(
      { error: 'Error al cargar personajes' },
      { status: 500 }
    );
  }
}

// app/api/personajes/route.ts (añadir este POST)

export async function POST(request: Request) {
  try {
    // Verificar usuario autenticado
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
    const { nombre_personaje, raza, clase, nivel } = body;

    // Validaciones
    if (!nombre_personaje || !raza || !clase || !nivel) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (nivel < 1 || nivel > 60) {
      return NextResponse.json(
        { error: 'El nivel debe estar entre 1 y 60' },
        { status: 400 }
      );
    }

    // Verificar límite de personajes
    const countResult = await query(
      'SELECT COUNT(*) FROM personajes WHERE usuario_id = $1 AND activo = true',
      [usuarioId]
    );

    if (parseInt(countResult.rows[0].count) >= 10) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de 10 personajes' },
        { status: 400 }
      );
    }

    // Crear personaje
    const result = await query(
      `INSERT INTO personajes 
       (usuario_id, nombre_personaje, raza, clase, nivel, fecha_creacion) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING *`,
      [usuarioId, nombre_personaje, raza, clase, nivel]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear personaje:', error);
    return NextResponse.json(
      { error: 'Error al crear personaje' },
      { status: 500 }
    );
  }
}