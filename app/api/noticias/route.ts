// app/api/noticias/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const estado = searchParams.get('estado'); // Para el panel de admin
    const pagina = parseInt(searchParams.get('pagina') || '1');
    const limite = 9;
    const offset = (pagina - 1) * limite;

    let sql = `
      SELECT 
        n.*,
        u.nombre_usuario as autor_nombre,
        u.rango as autor_rango,
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
      LEFT JOIN noticia_categorias nc ON n.id = nc.noticia_id
      LEFT JOIN categorias_noticias c ON nc.categoria_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // Filtrar por estado si se especifica
    if (estado) {
      params.push(estado);
      sql += ` AND n.estado = $${params.length}`;
    } else {
      // Por defecto, solo mostrar publicadas
      sql += ` AND n.estado = 'publicado'`;
    }

    // Filtrar por categoría
    if (categoria) {
      params.push(categoria);
      sql += ` AND c.nombre = $${params.length}`;
    }

    sql += `
      GROUP BY n.id, u.nombre_usuario, u.rango
      ORDER BY n.destacada DESC, n.fecha_publicacion DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limite, offset);

    const result = await query(sql, params);
    
    // Obtener total para paginación
    let countSql = 'SELECT COUNT(*) FROM noticias WHERE 1=1';
    const countParams: any[] = [];
    
    if (estado) {
      countParams.push(estado);
      countSql += ` AND estado = $${countParams.length}`;
    } else {
      countSql += ` AND estado = 'publicado'`;
    }
    
    const totalResult = await query(countSql, countParams);

    return NextResponse.json({
      noticias: result.rows,
      total: parseInt(totalResult.rows[0].count),
      pagina,
      totalPaginas: Math.ceil(parseInt(totalResult.rows[0].count) / limite)
    });
  } catch (error) {
    console.error('Error al cargar noticias:', error);
    return NextResponse.json(
      { error: 'Error al cargar noticias' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { titulo, contenido, categorias, imagen_destacada } = body;

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Determinar estado inicial según rango
    let estadoInicial = 'pendiente';
    if (payload.rango === 'General' || payload.rango === 'Oficial') {
      estadoInicial = 'publicado';
    }

    // Iniciar transacción
    await query('BEGIN');

    try {
      // Insertar noticia
      const noticiaResult = await query(
        `INSERT INTO noticias 
         (titulo, contenido, autor_id, estado, imagen_destacada, fecha_publicacion) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [titulo, contenido, payload.id, estadoInicial, imagen_destacada || null,
         estadoInicial === 'publicado' ? new Date() : null]
      );

      const noticiaId = noticiaResult.rows[0].id;

      // Insertar categorías
      if (categorias && categorias.length > 0) {
        for (const catId of categorias) {
          await query(
            'INSERT INTO noticia_categorias (noticia_id, categoria_id) VALUES ($1, $2)',
            [noticiaId, catId]
          );
        }
      }

      await query('COMMIT');

      return NextResponse.json(
        { 
          message: 'Noticia creada exitosamente',
          noticia: noticiaResult.rows[0],
          estado: estadoInicial
        },
        { status: 201 }
      );

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { error: 'Error al crear la noticia' },
      { status: 500 }
    );
  }
}