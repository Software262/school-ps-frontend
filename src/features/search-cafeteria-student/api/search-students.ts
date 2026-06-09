import { fetchApi } from '@/shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { GeneralStudent } from '@/features/cafeteria/model/types';

export const searchCafeteriaStudents = async (
  query: string,
  gradoId?: number,
): Promise<GeneralStudent[]> => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (gradoId) params.append('grado_id', String(gradoId));
  const res = await fetchApi<ApiResponse<GeneralStudent[]>>(
    `/cafeteria/search-students?${params.toString()}`,
  );
  return Array.isArray(res.data) ? res.data : [];
};
