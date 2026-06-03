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
