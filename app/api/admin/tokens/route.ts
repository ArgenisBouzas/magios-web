import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generarTokenUnico } from '@/lib/utils/tokens';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface TokenInvitacion {
  id: number;
  token: string;
  email_destino: string | null;
  usado: boolean;
  usado_por: number | null;
  fecha_creacion: Date;
  fecha_expiracion: Date | null;
  nombre_usuario?: string;
}

// Función para verificar si el usuario es admin
async function verificarAdmin(): Promise<{ autorizado: boolean; error?: Response }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { 
        autorizado: false, 
        error: NextResponse.json(
          { error: 'No autorizado - Token no encontrado' },
          { status: 401 }
        )
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definido');
      return { 
        autorizado: false, 
        error: NextResponse.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        )
      };
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.rango !== 'General' && payload.rango !== 'Oficial') {
      return { 
        autorizado: false, 
        error: NextResponse.json(
          { error: 'Se requieren permisos de administrador' },
          { status: 403 }
        )
      };
    }

    return { autorizado: true };
  } catch (error) {
    console.error('Error verificando admin:', error);
    return { 
      autorizado: false, 
      error: NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    };
  }
}

// GET: Obtener todos los tokens
export async function GET() {
  try {
    const verificado = await verificarAdmin();
    if (!verificado.autorizado) {
      return verificado.error;
    }

    const result = await query(`
      SELECT 
        t.*,
        u.nombre_usuario
      FROM tokens_invitacion t
      LEFT JOIN usuarios u ON t.usado_por = u.id
      ORDER BY t.fecha_creacion DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    return NextResponse.json(
      { error: 'Error al obtener los tokens' },
      { status: 500 }
    );
  }
}

// POST: Generar nuevos tokens
export async function POST(request: Request) {
  try {
    const verificado = await verificarAdmin();
    if (!verificado.autorizado) {
      return verificado.error;
    }

    const body = await request.json();
    const { cantidad = 1, email_destino = null, dias_expiracion = 7 } = body;

    if (cantidad > 50) {
      return NextResponse.json(
        { error: 'No se pueden generar más de 50 tokens a la vez' },
        { status: 400 }
      );
    }

    const tokens: TokenInvitacion[] = [];

    for (let i = 0; i < cantidad; i++) {
      const token = generarTokenUnico();
      const result = await query(
        `INSERT INTO tokens_invitacion (token, email_destino, fecha_expiracion)
         VALUES ($1, $2, NOW() + $3::interval)
         RETURNING *`,
        [token, email_destino, `${dias_expiracion} days`]
      );
      tokens.push(result.rows[0]);
    }

    return NextResponse.json(tokens, { status: 201 });
  } catch (error) {
    console.error('Error al generar tokens:', error);
    return NextResponse.json(
      { error: 'Error al generar los tokens' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar tokens
export async function DELETE(request: Request) {
  try {
    const verificado = await verificarAdmin();
    if (!verificado.autorizado) {
      return verificado.error;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const eliminarExpirados = searchParams.get('expirados') === 'true';

    if (id) {
      await query('DELETE FROM tokens_invitacion WHERE id = $1', [id]);
      return NextResponse.json({ message: 'Token eliminado correctamente' });
    } else if (eliminarExpirados) {
      const result = await query(
        `DELETE FROM tokens_invitacion 
         WHERE usado = false 
         AND fecha_expiracion < NOW()
         RETURNING id`
      );
      return NextResponse.json({ 
        message: `${result.rowCount} tokens expirados eliminados` 
      });
    }

    return NextResponse.json(
      { error: 'Especifica qué tokens eliminar' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error al eliminar tokens:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tokens' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar un token
export async function PATCH(request: Request) {
  try {
    const verificado = await verificarAdmin();
    if (!verificado.autorizado) {
      return verificado.error;
    }

    const body = await request.json();
    const { id, dias_expiracion, email_destino } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de token requerido' },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    if (dias_expiracion) {
      updates.push(`fecha_expiracion = NOW() + $${paramCounter}::interval`);
      values.push(`${dias_expiracion} days`);
      paramCounter++;
    }

    if (email_destino !== undefined) {
      updates.push(`email_destino = $${paramCounter}`);
      values.push(email_destino);
      paramCounter++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      );
    }

    values.push(id);
    const result = await query(
      `UPDATE tokens_invitacion 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCounter}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar token:', error);
    return NextResponse.json(
      { error: 'Error al actualizar token' },
      { status: 500 }
    );
  }
}