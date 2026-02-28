// app/api/noticias/[id]/estado/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener el ID de los parámetros de la URL
    const { id } = await context.params;
    
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

    // Solo oficiales y generales pueden cambiar estados
    if (payload.rango !== 'General' && payload.rango !== 'Oficial') {
      return NextResponse.json(
        { error: 'No tienes permiso para moderar noticias' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { estado, motivo_rechazo } = body;

    if (!['publicado', 'rechazado'].includes(estado)) {
      return NextResponse.json(
        { error: 'Estado no válido' },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const noticiaResult = await query(
      'SELECT id, estado FROM noticias WHERE id = $1',
      [id]
    );

    if (noticiaResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    let sql = '';
    const params: any[] = [];

    if (estado === 'publicado') {
      sql = `UPDATE noticias 
             SET estado = $1, publicado_por = $2, fecha_publicacion = NOW()
             WHERE id = $3
             RETURNING *`;
      params.push(estado, payload.id, id);
    } else if (estado === 'rechazado') {
      if (!motivo_rechazo) {
        return NextResponse.json(
          { error: 'Debes proporcionar un motivo de rechazo' },
          { status: 400 }
        );
      }
      sql = `UPDATE noticias 
             SET estado = $1, rechazado_por = $2, motivo_rechazo = $3
             WHERE id = $4
             RETURNING *`;
      params.push(estado, payload.id, motivo_rechazo, id);
    }

    const result = await query(sql, params);

    return NextResponse.json({ 
      message: `Noticia ${estado === 'publicado' ? 'publicada' : 'rechazada'} correctamente`,
      noticia: result.rows[0]
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado de la noticia' },
      { status: 500 }
    );
  }
}