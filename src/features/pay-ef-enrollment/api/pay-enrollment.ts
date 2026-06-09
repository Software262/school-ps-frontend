import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { Enrollment, RegisterPaymentRequest } from '@/features/escuelas-formacion/model/types';

const BASE = '/training-schools';

export async function registerPayment(payload: RegisterPaymentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/payment`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al registrar pago');
  return res.data;
}
