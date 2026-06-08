import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';

const BASE = '/training-schools';

export async function getEnrollments(periodoId: number): Promise<Enrollment[]> {
  const res = await fetchApi<ApiResponse<Enrollment[]>>(`${BASE}/enrollments/${String(periodoId)}`);
  return Array.isArray(res.data) ? res.data : [];
}
