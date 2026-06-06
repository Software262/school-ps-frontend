import { fetchApi } from '@/shared/api/apiClient';

export interface StudentResult {
  id: number;
  nombre: string;
  documento: string;
}

interface EnrollmentStudent {
  estudiante_id: number;
  nombre: string;
  documento: string;
}

interface SearchStudentsResponse {
  estudiantes: EnrollmentStudent[];
  total_resultados: number;
}

export const searchStudents = async (query: string): Promise<StudentResult[]> => {
  if (!query.trim()) return [];
  const res = await fetchApi<SearchStudentsResponse>(
    `/enrollment/students?query=${encodeURIComponent(query)}`,
  );
  return res.estudiantes.map((s) => ({
    id: s.estudiante_id,
    nombre: s.nombre,
    documento: s.documento,
  }));
};
