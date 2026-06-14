import { fetchApi } from './apiClient';

export interface InventoryStatsData {
  total_items: number;
  total_disponibles: number;
  total_prestados: number;
  total_mantenimiento: number;
}

interface InventoryStatsResponse {
  statusCode: number;
  success: boolean;
  data: InventoryStatsData;
  message: string;
}

export const fetchInventoryStats = async (typeName: string): Promise<InventoryStatsData | null> => {
  const res = await fetchApi<InventoryStatsResponse>(
    `/inventory/stats?type_name=${encodeURIComponent(typeName)}`,
  );
  if (res.statusCode !== 200) return null;
  return res.data;
};
