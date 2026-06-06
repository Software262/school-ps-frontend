import { fetchApi } from '@/shared/api/apiClient';
import type { StudentResult, SearchStudentsResponse } from '../types';

export const searchStudents = async (query: string): Promise<StudentResult[]> => {
  if (!query.trim()) return [];

  const res = await fetchApi<SearchStudentsResponse>(`/enrollment/students?${query}`);

  return res.estudiantes.map((s) => ({
    id: s.estudiante_id,
    nombre: s.nombre,
    documento: s.documento,
  }));
};
