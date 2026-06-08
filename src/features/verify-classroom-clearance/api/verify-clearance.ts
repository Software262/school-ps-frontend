import { fetchApi } from '@/shared/api/apiClient';
import { getAuthHeaders, withTimeout } from '@/features/classroom-holder/api/request';
import type { PazYSalvoResponse } from '@/features/classroom-holder/model/types';

export const verifyClassroomClearance = async (studentId: number): Promise<PazYSalvoResponse> => {
  return withTimeout((signal) =>
    fetchApi<PazYSalvoResponse>(`/classroom-holder/paz-y-salvo/verificar/${String(studentId)}`, {
      headers: getAuthHeaders(),
      signal,
    }),
  );
};
