import { fetchApi } from '@/shared/api/apiClient';

interface ComplementarioPupitre {
  id: number;
  nombre: string;
  valor: number;
  anio: number;
}

interface ComplementarioResponse {
  statusCode: number;
  data: ComplementarioPupitre;
  message: string;
}

export const getPupitreComplementario = async (): Promise<ComplementarioResponse> => {
  return fetchApi<ComplementarioResponse>('/classroom/pupitre/complementario');
};
