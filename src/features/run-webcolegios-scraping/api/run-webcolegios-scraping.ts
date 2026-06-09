import { fetchApi } from '@/shared/api/apiClient';
import type {
  WebcolegiosScrapingRequest,
  WebcolegiosScrapingRunMode,
  WebcolegiosScrapingRunResponse,
} from '../types';

const RUN_ENDPOINTS: Record<WebcolegiosScrapingRunMode, string> = {
  full: '/webcolegios-import/run',
  students: '/webcolegios-import/run/students',
  teachers: '/webcolegios-import/run/teachers',
};

export const runWebcolegiosScraping = (
  request: WebcolegiosScrapingRequest,
  mode: WebcolegiosScrapingRunMode = 'full',
): Promise<WebcolegiosScrapingRunResponse> =>
  fetchApi<WebcolegiosScrapingRunResponse>(RUN_ENDPOINTS[mode], {
    method: 'POST',
    body: JSON.stringify(request),
  });
