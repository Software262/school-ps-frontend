import { fetchApi } from '@/shared/api/apiClient';
import type { PupitreByStudentResponse } from '../types';

export const getPupitreByStudent = async (documento: string): Promise<PupitreByStudentResponse> => {
  return fetchApi<PupitreByStudentResponse>(`/classroom/pupitre/${documento.trim()}`);
};
