// lib/utils/tokens.ts
import { randomBytes } from 'crypto';

export function generarTokenUnico(): string {
  const prefix = 'MAGIOS';
  const random = randomBytes(4).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generarTokens(cantidad: number): string[] {
  return Array.from({ length: cantidad }, () => generarTokenUnico());
}