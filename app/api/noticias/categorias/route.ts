import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM categorias_noticias WHERE activo = true ORDER BY tipo, nombre'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    return NextResponse.json(
      { error: 'Error al cargar categorías' },
      { status: 500 }
    );
  }
}