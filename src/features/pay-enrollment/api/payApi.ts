import type { PaymentResultResponse } from '../types';

const API_BASE = '/api/v1/enrollment';

export const registerDirectedPayment = async (payload: {
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
  const response = await fetch(`${API_BASE}/payments/directed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al registrar el pago');
  return response.json() as Promise<PaymentResultResponse>;
};
