/**
 * Author: Danilo Castillejo
 * Role: Developer of the cafeteria module
 */
import type {
  ManualBlockRequest,
  BulkRemoveBlockRequest,
  CafeteriaRecord,
  GeneralStudent,
  Grade,
} from '../model/types';

interface ApiResponse<T> {
  data: T;
  message: string;
  status_code: number;
}

// Corregimos el tipo para que el operador ?? sea válido
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1/cafeteria';

export const cafeteriaApi = {
  fetchDebtors: async (periodoId: number): Promise<ApiResponse<CafeteriaRecord[]>> => {
    const res = await fetch(`${API_URL}/list/${String(periodoId)}`);
    if (!res.ok) throw new Error('Error al obtener deudores');
    return res.json() as Promise<ApiResponse<CafeteriaRecord[]>>;
  },

  searchGeneral: async (
    query: string,
    gradoId?: number,
  ): Promise<ApiResponse<GeneralStudent[]>> => {
    const url = new URL(`${API_URL}/search-students`);
    if (query) url.searchParams.append('query', query);
    if (gradoId) url.searchParams.append('grado_id', String(gradoId));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Error en la búsqueda');
    return res.json() as Promise<ApiResponse<GeneralStudent[]>>;
  },

  addDebt: async (data: ManualBlockRequest): Promise<ApiResponse<CafeteriaRecord>> => {
    const res = await fetch(`${API_URL}/add-debt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar deuda');
    return res.json() as Promise<ApiResponse<CafeteriaRecord>>;
  },

  clearDebts: async (data: BulkRemoveBlockRequest): Promise<ApiResponse<number>> => {
    const res = await fetch(`${API_URL}/clear-debts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al limpiar deudas');
    return res.json() as Promise<ApiResponse<number>>;
  },

  getGrades: async (): Promise<ApiResponse<Grade[]>> => {
    const res = await fetch(`${API_URL}/grades`);
    if (!res.ok) throw new Error('Error al obtener la lista de grados');
    return res.json() as Promise<ApiResponse<Grade[]>>;
  },

  exportReport: async (periodoId: number): Promise<{ data: Blob }> => {
    const res = await fetch(`${API_URL}/export/${String(periodoId)}`);
    if (!res.ok) throw new Error('Error al generar el reporte CSV');
    const blob = await res.blob();
    return { data: blob };
  },
};
