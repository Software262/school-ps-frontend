import { fetchApi } from '@/shared/api/apiClient';
import { getAuthHeaders, withTimeout } from '@/features/classroom-holder/api/request';
import type { Incidencia } from '@/features/classroom-holder/model/types';

export const closeClassroomIncident = async (incidentId: number): Promise<Incidencia> => {
  return withTimeout((signal) =>
    fetchApi<Incidencia>(`/classroom-holder/incidencias/${String(incidentId)}/cerrar`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      signal,
    }),
  );
};
