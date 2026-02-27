// app/api/auth/actualizar-perfil/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function PUT(request: Request) {
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
    const usuarioId = payload.id;

    const body = await request.json();
    const { email, contrasena_actual, nueva_contrasena } = body;

    // Validar email
    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar que el email no esté en uso por otro usuario
    const emailCheck = await query(
      'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
      [email, usuarioId]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está en uso por otro usuario' },
        { status: 400 }
      );
    }

    // Si quiere cambiar la contraseña
    if (nueva_contrasena) {
      if (!contrasena_actual) {
        return NextResponse.json(
          { error: 'Debes proporcionar tu contraseña actual' },
          { status: 400 }
        );
      }

      if (nueva_contrasena.length < 6) {
        return NextResponse.json(
          { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }

      // Verificar contraseña actual
      const userResult = await query(
        'SELECT contrasena_hash FROM usuarios WHERE id = $1',
        [usuarioId]
      );

      const contrasenaValida = await bcrypt.compare(
        contrasena_actual,
        userResult.rows[0].contrasena_hash
      );

      if (!contrasenaValida) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        );
      }

      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const nueva_hash = await bcrypt.hash(nueva_contrasena, salt);

      // Actualizar email y contraseña
      await query(
        'UPDATE usuarios SET email = $1, contrasena_hash = $2 WHERE id = $3',
        [email, nueva_hash, usuarioId]
      );
    } else {
      // Solo actualizar email
      await query(
        'UPDATE usuarios SET email = $1 WHERE id = $2',
        [email, usuarioId]
      );
    }

    // Obtener usuario actualizado
    const result = await query(
      'SELECT id, nombre_usuario, email, rango, fecha_registro FROM usuarios WHERE id = $1',
      [usuarioId]
    );

    return NextResponse.json({
      message: 'Perfil actualizado correctamente',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}