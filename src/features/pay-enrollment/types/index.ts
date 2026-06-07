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

export interface Asign {
  concepto: string;
  monto: number;
  complementario_id?: number;
  detalle_id?: number;
}
