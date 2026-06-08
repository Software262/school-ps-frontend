import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { Enrollment, EnrollStudentRequest } from '@/features/escuelas-formacion/model/types';

const BASE = '/training-schools';

export async function enrollStudent(payload: EnrollStudentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/enroll`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al inscribir');
  return res.data;
}
