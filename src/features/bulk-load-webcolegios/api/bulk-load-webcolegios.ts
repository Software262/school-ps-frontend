import { fetchApi } from '@/shared/api/apiClient';
import type { WebcolegiosBulkLoadRequest, WebcolegiosScrapingRunResponse } from '../types';

export const bulkLoadWebcolegios = (
  request: WebcolegiosBulkLoadRequest,
): Promise<WebcolegiosScrapingRunResponse> =>
  fetchApi<WebcolegiosScrapingRunResponse>('/webcolegios-import/carga-masiva', {
    method: 'POST',
    body: JSON.stringify(request),
  });
