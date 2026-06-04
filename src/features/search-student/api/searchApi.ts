import { fetchApi } from '@/shared/api/apiClient';
import type { StudentSearchListResponse } from '../types';

export const searchStudents = async (
  params: { documento?: string; nombre?: string; year?: number },
  signal?: AbortSignal,
): Promise<StudentSearchListResponse> => {
  const query = new URLSearchParams();
  if (params.documento) query.append('documento', params.documento);
  if (params.nombre) query.append('nombre', params.nombre);
  if (params.year) query.append('year', params.year.toString());

  return fetchApi<StudentSearchListResponse>(`/enrollment/students?${query.toString()}`, {
    signal,
  });
};
