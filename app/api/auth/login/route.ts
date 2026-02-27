

// app/api/auth/login/route.ts (temporalmente)

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_temporal_cambiar_en_produccion';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login attempt:', { nombre_usuario: body.nombre_usuario });

    const { nombre_usuario, contrasena } = body;

    if (!nombre_usuario || !contrasena) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const result = await query(
      'SELECT * FROM usuarios WHERE nombre_usuario = $1 AND activo = true',
      [nombre_usuario]
    );

    console.log('Usuario encontrado:', result.rows.length > 0 ? 'Sí' : 'No');
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const usuario = result.rows[0];
    console.log('Hash en DB:', usuario.contrasena_hash);

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    
    if (!contrasenaValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Actualizar último acceso
    await query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
      [usuario.id]
    );

    // Crear token JWT
    const token = jwt.sign(
      { 
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rango: usuario.rango 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // No enviar el hash en la respuesta
    const { contrasena_hash, ...usuarioSinHash } = usuario;

    // Crear respuesta con cookie
    const response = NextResponse.json({
      message: 'Login exitoso',
      usuario: usuarioSinHash
    });

    // Guardar token en cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });

    console.log('Login exitoso para:', nombre_usuario);
    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
