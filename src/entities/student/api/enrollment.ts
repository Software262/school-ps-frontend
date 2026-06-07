import { fetchApi } from '@/shared/api/apiClient';

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

export interface MassEnrollmentResponse {
  status: 'success' | 'partial' | 'error';
  processed: number;
  success: number;
  errors: number;
  error_details: string[];
}

export interface ManualEnrollmentPayload {
  documento: string;
  nombre: string;
  grado: string;
  nombre_acudiente: string;
  periodo_id: number;
  anio: number;
}

export interface PaymentHistoryItem {
  id: number;
  codigo_talonario: string;
  monto_total: number;
  fecha_pago: string;
  observacion: string | null;
}

export interface PaymentReceiptResponse {
  pago_id: number;
  codigo_talonario: string;
  monto_total: number;
  fecha_pago: string;
  observacion: string | null;
  estudiante: {
    id: number;
    nombre: string;
    documento: string;
    grado: string;
  };
  acudiente: {
    nombre: string;
  };
  distribuciones: {
    concepto: string;
    complementario_id?: number | null;
    monto_aplicado: number;
  }[];
}

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

  registerMassiveCsv: async (
    periodoId: number,
    anio: number,
    file: File,
  ): Promise<MassEnrollmentResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetchApi<MassEnrollmentResponse>(
      `/enrollment/register/massive/csv?periodo_id=${periodoId.toString()}&anio=${anio.toString()}`,
      {
        method: 'POST',
        body: formData,
      },
    );
  },

  manualEnrollment: async (
    payload: ManualEnrollmentPayload,
  ): Promise<{ mensaje: string; matricula_id: number }> => {
    return fetchApi<{ mensaje: string; matricula_id: number }>('/enrollment/students/manual', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getPaymentHistory: async (studentId: number, year?: number): Promise<PaymentHistoryItem[]> => {
    const query = year ? `?year=${year.toString()}` : '';
    return fetchApi<PaymentHistoryItem[]>(
      `/enrollment/students/${studentId.toString()}/payments${query}`,
    );
  },

  getPaymentReceipt: async (pagoId: number): Promise<PaymentReceiptResponse> => {
    return fetchApi<PaymentReceiptResponse>(`/enrollment/payments/${pagoId.toString()}/receipt`);
  },

  deleteComplementaryDetail: async (
    detalleId: number,
  ): Promise<{ mensaje: string; detalle_id: number; matricula_id: number }> => {
    return fetchApi<{ mensaje: string; detalle_id: number; matricula_id: number }>(
      `/enrollment/details/${detalleId.toString()}`,
      {
        method: 'DELETE',
      },
    );
  },

  getComplementaryConcepts: async (year?: number): Promise<ComplementaryConcept[]> => {
    const query = year !== undefined ? `?year=${year.toString()}` : '';
    return fetchApi<ComplementaryConcept[]>(`/enrollment/complementary${query}`);
  },

  createComplementaryConcept: async (
    payload: CreateComplementaryPayload,
  ): Promise<{ mensaje: string; complementario_id: number }> => {
    return fetchApi<{ mensaje: string; complementario_id: number }>('/enrollment/complementary', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  assignComplementaryConcept: async (
    matriculaId: number,
    payload: { complementario_id: number; descuento: number },
  ): Promise<{ mensaje: string; detalle_id: number }> => {
    return fetchApi<{ mensaje: string; detalle_id: number }>(
      `/enrollment/${matriculaId.toString()}/complementary/assign`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },
};
