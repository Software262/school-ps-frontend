export interface CreateObservationRequest {
  docente_id: number;
  periodo_id: number;
  id_usuario: number;
  descripcion: string;
  tipo_observacion: string;
}

export interface CreateStatusRequest {
  docente_id: number;
  periodo_id: number;
  id_usuario: number;
  motivo_estado: string;
}

export interface UpdateStatusRequest {
  id_usuario: number;
  motivo_estado: string;
}
