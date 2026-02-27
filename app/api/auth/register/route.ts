import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registro attempt:', { nombre_usuario: body.nombre_usuario, email: body.email });

    const { token, token_id, nombre_usuario, email, contrasena } = body;

    // Validaciones básicas
    if (!token || !token_id || !nombre_usuario || !email || !contrasena) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validar longitud contraseña
    if (contrasena.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar que el token existe y no ha sido usado
    const tokenResult = await query(
      `SELECT id FROM tokens_invitacion 
       WHERE id = $1 AND token = $2 AND usado = false 
       AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())`,
      [token_id, token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token de invitación inválido o ya usado' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT id FROM usuarios WHERE nombre_usuario = $1 OR email = $2',
      [nombre_usuario, email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'El nombre de usuario o email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(contrasena, salt);

    // Iniciar transacción
    await query('BEGIN');

    try {
      // Insertar nuevo usuario
      const userResult = await query(
        `INSERT INTO usuarios 
         (nombre_usuario, email, contrasena_hash, token_invitacion_id, fecha_registro, activo) 
         VALUES ($1, $2, $3, $4, NOW(), true) 
         RETURNING id, nombre_usuario, email`,
        [nombre_usuario, email, contrasena_hash, token_id]
      );

      const usuario = userResult.rows[0];

      // Marcar token como usado
      await query(
        'UPDATE tokens_invitacion SET usado = true, usado_por = $1 WHERE id = $2',
        [usuario.id, token_id]
      );

      // Commit transacción
      await query('COMMIT');

      console.log('Usuario registrado exitosamente:', usuario.nombre_usuario);

      return NextResponse.json({
        message: 'Usuario registrado exitosamente',
        usuario: {
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          email: usuario.email
        }
      }, { status: 201 });

    } catch (error) {
      // Rollback en caso de error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}