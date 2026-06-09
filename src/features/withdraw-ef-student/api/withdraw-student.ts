import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { Enrollment, WithdrawStudentRequest } from '@/features/escuelas-formacion/model/types';

const BASE = '/training-schools';

export async function withdrawStudent(payload: WithdrawStudentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/withdraw`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al registrar retiro');
  return res.data;
}
