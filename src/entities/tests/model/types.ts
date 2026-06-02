// Domain types for the tests module

export type TipoPrueba = string;
export type EstadoPrueba = 'pagada' | 'pendiente' | 'pago-parcial';

export interface Grado {
  id: number;
  nombre: string;
}

export interface Periodo {
  id: number;
  nombre: string;
  fecha?: string;
}

export interface ComplementarioPrueba {
  id: number;
  nombre: string;
  valor: number;
  anio: number;
}

export interface PruebaAssignment {
  id: number;
  estudiante_id: number;
  complementario_id: number;
  tipo_prueba: string;
  estado: EstadoPrueba;
  valor_pagado: number;
  periodo_id?: number | null;
  created_at: string;

  // joined
  estudiante: { nombre: string; documento: string };
  complementario: { tipo_complementario: string; valor: number };
  periodo?: { id: number; nombre: string } | null;

  // computed on frontend
  documento?: string;
  estudianteNombre?: string;
  pruebaNombre?: string;
  valor?: number;
  valorStr?: string;
  valorPagadoStr?: string;
  saldoStr?: string;
  estadoStr?: string;
  periodoNombre?: string;
}

export interface EstudianteListItem {
  id: number;
  nombre: string;
  documento: string;
  grado_id: number;
}

export interface CreatePruebaRequest {
  estudiante_id: number;
  complementario_id: number;
  tipo_prueba: string;
  estado: EstadoPrueba;
  valor_pagado: number;
  periodo_id: number;
}

export interface MassiveAssignRequest {
  grado_id: number;
  complementario_id: number;
  tipo_prueba: string;
  periodo_id: number;
}
