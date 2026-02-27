import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada' });
  
  // Eliminar la cookie
  response.cookies.delete('token');
  
  return response;
}