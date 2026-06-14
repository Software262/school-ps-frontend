export interface InventoryStock {
  estado: 'disponible' | 'prestado' | 'mantenimiento';
  cantidad: number;
}

export interface Inventory {
  id: number;
  tipo_inventario_id: number;
  nombre: string;
  cantidad_total: number;
  observacion: string | null;
  stocks: InventoryStock[];
}

export const getStockCantidad = (
  stocks: InventoryStock[],
  estado: InventoryStock['estado'],
): number => stocks.find((s) => s.estado === estado)?.cantidad ?? 0;
