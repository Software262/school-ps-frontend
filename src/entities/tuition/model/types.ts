export interface TuitionInstallmentResponse {
  id: number;
  mes: number;
  cuota: number;
  valor_total: number;
  valor_pagado: number;
  total_pagado_mes: number;
  saldo_pendiente: number;
  fecha_pago: string | null;
  faltante: boolean;
}

export interface TuitionAccountResponse {
  estudiante_id: number;
  valor_total_anual: number;
  estado_pension_general: boolean;
  installments: TuitionInstallmentResponse[];
}

export interface PaymentCreateRequest {
  estudiante_id: number;
  mes: number;
  valor_pagado: number;
}
