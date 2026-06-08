import { fetchApi } from '@/shared/api/apiClient';
import type { PaymentResultResponse } from '../types';

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
  return fetchApi<PaymentResultResponse>('/enrollment/payments/directed', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
