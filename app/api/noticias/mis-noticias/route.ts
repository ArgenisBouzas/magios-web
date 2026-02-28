import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
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

    const result = await query(
      `SELECT 
         n.*,
         COALESCE(
           json_agg(
             DISTINCT jsonb_build_object(
               'id', c.id,
               'nombre', c.nombre,
               'color', c.color
             )
           ) FILTER (WHERE c.id IS NOT NULL),
           '[]'::json
         ) as categorias
       FROM noticias n
       LEFT JOIN noticia_categorias nc ON n.id = nc.noticia_id
       LEFT JOIN categorias_noticias c ON nc.categoria_id = c.id
       WHERE n.autor_id = $1
       GROUP BY n.id
       ORDER BY n.fecha_creacion DESC`,
      [payload.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al cargar mis noticias:', error);
    return NextResponse.json(
      { error: 'Error al cargar tus noticias' },
      { status: 500 }
    );
  }
}