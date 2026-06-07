import { fetchApi } from '@/shared/api/apiClient';

interface UpdatePupitrePayload {
  estado_pupitre: boolean;
  observacion: string | null;
}

interface UpdatePupitreResponse {
  statusCode: number;
  data: {
    id: number;
    estudiante_id: number;
    estado_pupitre: boolean;
    observacion: string | null;
  };
  message: string;
}

export const updatePupitre = async (
  estudiante_id: number,
  payload: UpdatePupitrePayload,
): Promise<UpdatePupitreResponse> => {
  return fetchApi<UpdatePupitreResponse>(`/classroom/pupitre/${String(estudiante_id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
