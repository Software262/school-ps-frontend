import { fetchApi } from '@/shared/api/apiClient';
import type { StudentResult } from '../types';

interface EnrollmentStudent {
  estudiante_id: number;
  nombre: string;
  documento: string;
}

interface SearchStudentsResponse {
  estudiantes?: EnrollmentStudent[];
  total_resultados: number;
}

export const searchStudents = async (query: string): Promise<StudentResult[]> => {
  if (!query.trim()) return [];

  const params = new URLSearchParams();
  if (Number(query)) {
    params.append('documento', encodeURIComponent(query));
  } else {
    params.append('nombre', encodeURIComponent(query));
  }

  const res = await fetchApi<SearchStudentsResponse>(`/enrollment/students?${params}`);

  return (res.estudiantes ?? []).map((s) => ({
    id: s.estudiante_id,
    nombre: s.nombre,
    documento: s.documento,
  }));
};
