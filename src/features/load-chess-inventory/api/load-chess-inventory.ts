import { fetchApi } from '@shared/api/apiClient';
import type { ChessInventory } from '@/features/chess/model/types';

const PIEZAS_PREFIX = '[PIEZAS:';

function parsePiezasTotales(observacion: string | null): number {
  if (!observacion || !observacion.startsWith(PIEZAS_PREFIX)) {
    return 32;
  }
  try {
    const parts = observacion.split(']', 2);
    const numPart = parts[0].replace(PIEZAS_PREFIX, '').trim();
    const parsed = Number(numPart);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 32;
  } catch {
    return 32;
  }
}

function cleanObservacion(observacion: string | null): string | null {
  if (!observacion || !observacion.startsWith(PIEZAS_PREFIX)) {
    return observacion;
  }
  const parts = observacion.split(']', 2);
  return parts[1]?.trim() || null;
}

export const getChessInventory = (page = 1, limit = 50) =>
  fetchApi<{
    statusCode: number;
    data: {
      items: ChessInventory[];
      current_page: number;
      page_size: number;
      total: number;
      total_pages: number;
      previous: boolean;
      next: boolean;
    };
    message: string;
    details: unknown;
  }>(`/chess/items?page=${String(page)}&limit=${String(limit)}`).then((res) => ({
    ...res.data,
    items: res.data.items.map((item) => ({
      ...item,
      piezas_totales: parsePiezasTotales(item.observacion),
      observacion: cleanObservacion(item.observacion),
    })),
  }));
