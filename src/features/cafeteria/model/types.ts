/**
 * Author: Danilo Castillejo
 * Role: Developer of the cafeteria module
 */

export interface CafeteriaRecord {
  id: number;
  estudiante_id: number;
  periodo_id: number;
  usuario_id: number;
  estado_cafeteria: boolean;
  observaciones: string | null;
  updated_at: string;
}

export interface GeneralStudent {
  id: number;
  nombre: string;
  documento: string;
  grado?: string; // Opcional porque en la búsqueda general a veces se aplana
}

/**
 * Interfaz para el filtro de Grados (Cursos)
 */
export interface Grade {
  id: number;
  nombre: string;
}

export interface ManualBlockRequest {
  estudiante_id: number;
  periodo_id: number;
  usuario_id: number;
  observaciones: string;
}

export interface BulkRemoveBlockRequest {
  registro_ids: number[];
  usuario_id: number;
}

export interface DebtorRow {
  id: number;
  estudiante_id: number;
  nombre: string;
  documento: string;
  grado: string;
  estado_cafeteria: boolean;
  observaciones: string | null;
}
