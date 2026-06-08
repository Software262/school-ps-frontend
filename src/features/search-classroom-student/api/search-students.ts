import { fetchApi } from '@/shared/api/apiClient';
import { getAuthHeaders, withTimeout } from '@/features/classroom-holder/api/request';
import type {
  StudentSearchListResponse,
  StudentSearchResult,
} from '@/features/classroom-holder/model/types';

export const searchClassroomStudents = async (query: string): Promise<StudentSearchResult[]> => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const params = new URLSearchParams();
  if (/^\d+$/.test(normalizedQuery)) {
    params.append('documento', normalizedQuery);
  } else {
    params.append('nombre', normalizedQuery);
  }

  const data = await withTimeout((signal) =>
    fetchApi<StudentSearchListResponse>(`/enrollment/students?${params.toString()}`, {
      headers: getAuthHeaders(),
      signal,
    }),
  );

  return data.estudiantes.map((student) => ({
    id: student.estudiante_id,
    nombre: student.nombre,
    documento: student.documento,
    grado_nombre: student.grado_nombre || 'Sin curso',
  }));
};
