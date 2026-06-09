import { fetchApi } from '@/shared/api/apiClient';
import type {
  WebcolegiosClearResponse,
  WebcolegiosScrapingHistoryItem,
  WebcolegiosScrapingStatusResponse,
} from '../types';

export const loadWebcolegiosScrapingHistory = (): Promise<WebcolegiosScrapingHistoryItem[]> =>
  fetchApi<WebcolegiosScrapingHistoryItem[]>('/webcolegios-import/history');

export const loadWebcolegiosScrapingStatus = (): Promise<WebcolegiosScrapingStatusResponse> =>
  fetchApi<WebcolegiosScrapingStatusResponse>('/webcolegios-import/status');

export const clearWebcolegiosScrapingHistory = (): Promise<WebcolegiosClearResponse> =>
  fetchApi<WebcolegiosClearResponse>('/webcolegios-import/history', {
    method: 'DELETE',
  });
