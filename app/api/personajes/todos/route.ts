// app/api/personajes/todos/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    // Opcional: verificar que el usuario está logueado
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver los miembros' },
        { status: 401 }
      );
    }

    // Solo verificamos token, no importa qué usuario
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // Obtenemos TODOS los personajes activos
    const result = await query(
      `SELECT 
         id,
         nombre_personaje,
         raza,
         clase,
         nivel,
         rango,
         activo,
         fecha_creacion,
         usuario_id
       FROM personajes 
       WHERE activo = true 
       ORDER BY 
         CASE 
           WHEN rango = 'General' THEN 1
           WHEN rango = 'Oficial' THEN 2
           WHEN rango = 'Miembro' THEN 3
           WHEN rango = 'Aspirante' THEN 4
           ELSE 5
         END,
         nombre_personaje`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener personajes:', error);
    return NextResponse.json(
      { error: 'Error al cargar los personajes' },
      { status: 500 }
    );
  }
}