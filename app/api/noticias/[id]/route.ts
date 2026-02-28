import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Incrementar vistas
    await query(
      'UPDATE noticias SET vistas = vistas + 1 WHERE id = $1',
      [id]
    );

    const result = await query(
      `SELECT 
         n.*,
         u.nombre_usuario as autor_nombre,
         u.rango as autor_rango,
         p.nombre_usuario as publicado_por_nombre,
         r.nombre_usuario as rechazado_por_nombre,
         COALESCE(
           json_agg(
             DISTINCT jsonb_build_object(
               'id', c.id,
               'nombre', c.nombre,
               'tipo', c.tipo,
               'color', c.color
             )
           ) FILTER (WHERE c.id IS NOT NULL),
           '[]'::json
         ) as categorias
       FROM noticias n
       LEFT JOIN usuarios u ON n.autor_id = u.id
       LEFT JOIN usuarios p ON n.publicado_por = p.id
       LEFT JOIN usuarios r ON n.rechazado_por = r.id
       LEFT JOIN noticia_categorias nc ON n.id = nc.noticia_id
       LEFT JOIN categorias_noticias c ON nc.categoria_id = c.id
       WHERE n.id = $1
       GROUP BY n.id, u.nombre_usuario, u.rango, p.nombre_usuario, r.nombre_usuario`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al cargar noticia:', error);
    return NextResponse.json(
      { error: 'Error al cargar la noticia' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const { titulo, contenido, categorias, imagen_destacada } = body;

    // Verificar permisos
    const noticiaResult = await query(
      'SELECT autor_id, estado FROM noticias WHERE id = $1',
      [id]
    );

    if (noticiaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    const noticia = noticiaResult.rows[0];
    const esAutor = noticia.autor_id === payload.id;
    const esAdmin = payload.rango === 'General' || payload.rango === 'Oficial';

    if (!esAutor && !esAdmin) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar esta noticia' },
        { status: 403 }
      );
    }

    // Solo se puede editar si es borrador, pendiente o rechazado
    if (noticia.estado === 'publicado' && !esAdmin) {
      return NextResponse.json(
        { error: 'No puedes editar una noticia ya publicada' },
        { status: 403 }
      );
    }

    await query('BEGIN');

    try {
      // Actualizar noticia
      await query(
        `UPDATE noticias 
         SET titulo = $1, contenido = $2, imagen_destacada = $3, fecha_actualizacion = NOW()
         WHERE id = $4`,
        [titulo, contenido, imagen_destacada || null, id]
      );

      // Actualizar categorías
      await query('DELETE FROM noticia_categorias WHERE noticia_id = $1', [id]);
      
      if (categorias && categorias.length > 0) {
        for (const catId of categorias) {
          await query(
            'INSERT INTO noticia_categorias (noticia_id, categoria_id) VALUES ($1, $2)',
            [id, catId]
          );
        }
      }

      await query('COMMIT');

      return NextResponse.json({ message: 'Noticia actualizada correctamente' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la noticia' },
      { status: 500 }
    );
  }
}

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

    // Solo admins pueden eliminar
    if (payload.rango !== 'General') {
      return NextResponse.json(
        { error: 'Solo los Generales pueden eliminar noticias' },
        { status: 403 }
      );
    }

    await query('DELETE FROM noticias WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la noticia' },
      { status: 500 }
    );
  }
}