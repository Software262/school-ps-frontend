// src/features/classroom-holder/model/types.ts

export type TipoIncidencia = 'danio_material' | 'indisciplina' | 'inasistencia' | 'otro';

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
