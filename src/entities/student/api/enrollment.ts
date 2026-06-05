export interface StudentSearchItem {
  estudiante_id: number;
  documento: string;
  nombre: string;
  grado_id: number;
  grado_nombre: string;
  anio: number;
  matricula_registrada: boolean;
  estado_matricula: 'sin_abono' | 'parcial' | 'paz_y_salvo' | 'sin_matricula';
  pagos_realizados: number;
  saldo_pendiente: number;
  costo_total: number;
  total_pagado: number;
}

export interface StudentSearchListResponse {
  estudiantes: StudentSearchItem[];
  total_resultados: number;
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

export interface StudentBalance {
  estudiante: {
    id: number;
    nombre: string;
    documento: string;
    grado_id: number;
    grado_nombre: string;
    activo: boolean;
  };
  anio: number;
  costo_base_matricula: number;
  complementarios: ComplementaryItem[];
  total_complementarios: number;
  costo_total: number;
  total_pagado: number;
  total_pendiente: number;
  estado_matricula: 'sin_abono' | 'parcial' | 'paz_y_salvo' | 'sin_matricula';
  matricula_registrada: boolean;
  pendiente_base: number;
  pagos_realizados: number;
  matricula_id?: number | null;
}

export interface PaymentDistribution {
  concepto: string;
  complementario_id?: number | null;
  monto_aplicado: number;
}

export interface PaymentResultResponse {
  pago_id: number;
  codigo_talonario: string;
  monto_total: number;
  monto_aplicado: number;
  distribuciones: PaymentDistribution[];
  saldo_restante: number;
  matricula_pagada: boolean;
  mensaje: string;
}

export interface ModifyEnrollmentResponse {
  mensaje: string;
  matricula_id: number;
  nuevo_valor_total: number;
  motivo_registrado: string;
  observaciones_registradas?: string | null;
}

import { fetchApi } from '@/shared/api/apiClient';

export const enrollmentApi = {
  searchStudents: async (params: {
    documento?: string;
    nombre?: string;
    year?: number;
  }): Promise<StudentSearchListResponse> => {
    const query = new URLSearchParams();
    if (params.documento) query.append('documento', params.documento);
    if (params.nombre) query.append('nombre', params.nombre);
    if (params.year) query.append('year', params.year.toString());

    return fetchApi<StudentSearchListResponse>(`/enrollment/students?${query.toString()}`);
  },

  getStudentBalance: async (
    studentId: number,
    year: number = new Date().getFullYear(),
  ): Promise<StudentBalance> => {
    return fetchApi<StudentBalance>(
      `/enrollment/students/${studentId.toString()}/balance?year=${year.toString()}`,
    );
  },

  registerDirectedPayment: async (payload: {
    matricula_id: number;
    asignaciones: {
      concepto: string;
      complementario_id?: number;
      detalle_id?: number;
      monto: number;
    }[];
    codigo_talonario: string;
    observacion?: string;
  }): Promise<PaymentResultResponse> => {
    return fetchApi<PaymentResultResponse>('/enrollment/payments/directed', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  modifyEnrollment: async (
    matriculaId: number,
    payload: {
      motivo: string;
      observaciones?: string;
      nuevo_costo_base?: number;
      complementarios?: {
        detalle_id: number;
        nuevo_valor_completo?: number;
      }[];
    },
  ): Promise<ModifyEnrollmentResponse> => {
    return fetchApi<ModifyEnrollmentResponse>(
      `/enrollment/students/${matriculaId.toString()}/matricula`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
  },
};
