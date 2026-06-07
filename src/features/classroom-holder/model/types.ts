// src/features/classroom-holder/model/types.ts

export type TipoIncidencia = 'danio_material' | 'otro' | 'inasistencia' | 'indisciplina';

export interface StudentInfo {
  id: number;
  nombre: string;
  documento: string;
  grado_id: number;
  grado_nombre: string;
  activo: boolean;
}

export interface EnrollmentBalanceResponse {
  estudiante: StudentInfo;
  anio: number;
  costo_base_matricula: number;
  total_complementarios: number;
  costo_total: number;
  total_pagado: number;
  total_pendiente: number;
  estado_matricula: string;
  matricula_registrada: boolean;
  pendiente_base: number;
}

export interface Incidencia {
  id: number;
  estudiante_id: number;
  docente_id: number;
  tipo_incidencia: TipoIncidencia;
  descripcion: string;
  fecha: string;
  esta_abierta: boolean;
  fecha_cierre: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncidenciaCreateRequest {
  estudiante_id: number;
  tipo_incidencia: TipoIncidencia;
  descripcion: string;
  fecha: string;
}

export interface PazYSalvoResponse {
  estudiante_id: number;
  cumple_paz_y_salvo: boolean;
  mensaje: string;
}

export interface IncidenciaConEstudiante extends Incidencia {
  estudiante_nombre: string;
  grado_nombre?: string;
}
