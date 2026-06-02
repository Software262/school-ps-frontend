import { fetchApi } from '@/shared/api/apiClient';
import type { MassEnrollmentResponse } from '../types';

export const registerMassiveCsv = async (
  periodoId: number,
  anio: number,
  file: File,
): Promise<MassEnrollmentResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return fetchApi<MassEnrollmentResponse>(
    `/enrollment/register/massive/csv?periodo_id=${periodoId.toString()}&anio=${anio.toString()}`,
    {
      method: 'POST',
      body: formData,
    },
  );
};
