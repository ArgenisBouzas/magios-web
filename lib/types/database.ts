// lib/types/database.ts
export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  token_invitacion_id: number;
  fecha_registro: Date;
  ultimo_acceso: Date | null;
  activo: boolean;
}

export interface Personaje {
  id: number;
  usuario_id: number;
  nombre_personaje: string;
  raza: string;
  clase: string;
  nivel: number;
  rango: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface SlotArmadura {
  id: number;
  nombre_slot: string;
  posicion: number;
  descripcion: string;
  icono: string | null;
}

export interface Item {
  id: number;
  nombre_item: string;
  slot_id: number;
  calidad: string;
  nivel_requerido: number;
  descripcion: string | null;
  stats: any;
}

export interface Equipamiento {
  id: number;
  personaje_id: number;
  slot_id: number;
  item_id: number;
  fecha_equipado: Date;
}

export interface TokenInvitacion {
  id: number;
  token: string;
  email_destino: string | null;
  usado: boolean;
  usado_por: number | null;
  fecha_creacion: Date;
  fecha_expiracion: Date | null;
}