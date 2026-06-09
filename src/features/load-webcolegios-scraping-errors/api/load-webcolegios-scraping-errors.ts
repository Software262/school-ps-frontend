import { fetchApi } from '@/shared/api/apiClient';
import type { WebcolegiosClearResponse, WebcolegiosScrapingHistoryItem } from '../types';

export const loadWebcolegiosScrapingErrors = (): Promise<WebcolegiosScrapingHistoryItem[]> =>
  fetchApi<WebcolegiosScrapingHistoryItem[]>('/webcolegios-import/errors');

export const clearWebcolegiosScrapingErrors = (): Promise<WebcolegiosClearResponse> =>
  fetchApi<WebcolegiosClearResponse>('/webcolegios-import/errors', {
    method: 'DELETE',
  });
