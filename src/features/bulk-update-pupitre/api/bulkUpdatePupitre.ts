import { fetchApi } from '@/shared/api/apiClient';

interface BulkUpdatePayload {
  estado_pupitre: boolean;
  observacion: string | null;
}

interface BulkUpdateResponse {
  statusCode: number;
  data: {
    total_actualizados: number;
  };
  message: string;
}

export const bulkUpdatePupitre = async (
  grado_id: number,
  payload: BulkUpdatePayload,
): Promise<BulkUpdateResponse> => {
  return fetchApi<BulkUpdateResponse>(`/classroom/pupitre/grado/${String(grado_id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
