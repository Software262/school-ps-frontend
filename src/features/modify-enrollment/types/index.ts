export interface ComplementaryConcept {
  id: number;
  tipo_complementario: string;
  anio: number;
  valor: number;
  estado_complemento: string;
  uso_matricula: boolean;
}

export interface CreateComplementaryPayload {
  tipo_complementario: string;
  anio: number;
  valor: number;
  estado_complemento: string;
  uso_matricula: boolean;
}

export interface ModifyEnrollmentResponse {
  mensaje: string;
  matricula_id: number;
  nuevo_valor_total: number;
  motivo_registrado: string;
  observaciones_registradas?: string | null;
}
