import { fetchApi } from '@/shared/api/apiClient';
import type { WebcolegiosScrapingRunResponse, WebcolegiosSingleLoadRequest } from '../types';

export const singleLoadWebcolegios = (
  request: WebcolegiosSingleLoadRequest,
): Promise<WebcolegiosScrapingRunResponse> =>
  fetchApi<WebcolegiosScrapingRunResponse>('/webcolegios-import/carga-individual', {
    method: 'POST',
    body: JSON.stringify(request),
  });
