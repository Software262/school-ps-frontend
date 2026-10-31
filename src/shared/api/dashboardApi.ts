import { fetchApi } from '@/shared/api/apiClient';

export interface DashboardStats {
  total_estudiantes: number;
  paz_y_salvo: number;
  pendientes: number;
  alertas: number;
}

interface DashboardStatsApiResponse {
  statusCode: number;
  success: boolean;
  data: DashboardStats;
  message: string;
  details: null;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetchApi<DashboardStatsApiResponse>('/peace-safe/dashboard/stats');
    return response.data;
  },
};
