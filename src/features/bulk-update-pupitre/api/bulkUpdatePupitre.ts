import { fetchApi } from '@/shared/api/apiClient';

// API to confirm payments by student IDs (original behavior)
interface BulkConfirmPayload {
  estudiante_ids: number[];
}

interface BulkConfirmResponse {
  statusCode: number;
  data: {
    total_actualizados: number;
    ids_no_encontrados?: number[];
  };
  message: string;
}

export const bulkUpdatePupitre = async (
  grado_id: number,
  payload: BulkConfirmPayload,
): Promise<BulkConfirmResponse> => {
  return fetchApi<BulkConfirmResponse>(`/classroom/pupitre/grado/${String(grado_id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

// API to update entire grade state (new behavior used by BulkUpdateForm)
interface BulkUpdateByGradePayload {
  estado: boolean;
  observacion?: string | null;
}

export const bulkUpdatePupitreByGrade = async (
  grado_id: number,
  payload: BulkUpdateByGradePayload,
) => {
  return fetchApi<{ statusCode: number; data: { total_actualizados: number }; message: string }>(
    `/classroom/pupitre/grado/${String(grado_id)}/estado`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
};
