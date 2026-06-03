import { fetchApi } from '@/shared/api/apiClient';
import type { ManualEnrollmentPayload } from '../types';

export const manualEnrollment = async (
  payload: ManualEnrollmentPayload,
): Promise<{ mensaje: string; matricula_id: number }> => {
  return fetchApi<{ mensaje: string; matricula_id: number }>(`/enrollment/students/manual`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
