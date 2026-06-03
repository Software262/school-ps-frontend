// a program is a "complementario" owned by the matrícula module; its price
// (valor) is configured there, not in escuelas de formación.
export interface Program {
  id: number;
  tipo_complementario: string;
  anio: number;
  valor: number;
  estado_complemento: string;
  uso_matricula: boolean;
}

export interface Student {
  id: number;
  nombre: string;
  documento: string;
  activo: boolean;
}

export interface Period {
  id: number;
  periodo_electivo: string;
  estado: boolean;
}

export interface Enrollment {
  id: number;
  complementario_id: number;
  estudiante_id: number;
  estudiante_nombre: string;
  estudiante_documento: string;
  estudiante_grado: string;
  periodo_id: number | null;
  usuario_id: number | null;
  fecha_registro: string;
  mes: string;
  activo: boolean;
  estado_escuela: boolean;
  saldo_pendiente: number;
  motivo_retiro: string | null;
  observaciones: string | null;
  valor_acordado: number;
  numero_comprobante: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EnrollStudentRequest {
  estudiante_id: number;
  complementario_id: number;
  periodo_id: number;
  mes: string;
  usuario_id: number;
  observaciones?: string;
  valor_acordado?: number;
  numero_comprobante?: string;
}

export interface RegisterPaymentRequest {
  enrollment_id: number;
  monto: number;
  usuario_id: number;
}

export interface WithdrawStudentRequest {
  enrollment_id: number;
  motivo: string;
  usuario_id: number;
}

export interface PazYSalvoStatus {
  estudiante_id: number;
  paz_y_salvo: boolean;
}
