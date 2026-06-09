import { fetchApi } from '@/shared/api/apiClient';
import type { GradeInfo, PupitresByGradeResponse } from '../types';

export const getAllGrades = async (): Promise<GradeInfo[]> => {
  const response = await fetchApi<{ data: GradeInfo[] }>('/classroom/pupitre/grades');
  return response.data;
};

export const getPupitresByGrade = async (grado_id: number): Promise<PupitresByGradeResponse> => {
  return fetchApi<PupitresByGradeResponse>(`/classroom/pupitre/grado/${String(grado_id)}`);
};
