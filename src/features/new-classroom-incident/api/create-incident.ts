import { fetchApi } from '@/shared/api/apiClient';
import { getAuthHeaders, withTimeout } from '@/features/classroom-holder/api/request';
import type { Incidencia, IncidenciaCreateRequest } from '@/features/classroom-holder/model/types';

export const createIncident = async (payload: IncidenciaCreateRequest): Promise<Incidencia> => {
  return withTimeout((signal) =>
    fetchApi<Incidencia>('/classroom-holder/incidencias', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      signal,
    }),
  );
};
