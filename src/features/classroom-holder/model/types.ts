export type TipoIncidencia = 'danio_material' | 'otro' | 'inasistencia' | 'indisciplina';

export interface StudentInfo {
  id: number;
  nombre: string;
  documento: string;
  grado_id: number;
  grado_nombre: string;
  activo: boolean;
}

export interface ComplementaryItem {
  detalle_id: number;
  complementario_id: number;
  tipo_complementario: string;
  valor: number;
  descuento: number;
  valor_completo: number;
  valor_pendiente: number;
}

export interface EnrollmentBalanceResponse {
  estudiante: StudentInfo;
  anio: number;
  costo_base_matricula: number;
  complementarios: ComplementaryItem[];
  total_complementarios: number;
  costo_total: number;
  total_pagado: number;
  total_pendiente: number;
  estado_matricula: string;
  matricula_registrada: boolean;
  pendiente_base: number;
  pagos_realizados: number;
  matricula_id: number | null;
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

export interface StudentSearchItem {
  estudiante_id: number;
  documento: string;
  nombre: string;
  grado_id: number;
  grado_nombre: string;
  anio: number;
  matricula_registrada: boolean;
  estado_matricula: string;
  pagos_realizados: number;
  saldo_pendiente: number;
  costo_total: number;
  total_pagado: number;
}

export interface StudentSearchListResponse {
  estudiantes: StudentSearchItem[];
  total_resultados: number;
}

export interface StudentSearchResult {
  id: number;
  nombre: string;
  documento: string;
  grado_nombre: string;
}
