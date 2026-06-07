import type { Inventory } from '@/entities/inventory/model/types';

export interface ChessInventory extends Inventory {
  tipo_inventario_id: number;
}

export interface ChessLoan {
  id: number;
  inventario_id: number;
  estudiante_id: number;
  nombre_articulo: string;
  nombre_estudiante: string;
  fecha_salida: number;
  fecha_devolucion?: number | null;
  estado_prestamo: boolean;
  cantidad: number;
  observacion?: string | null;
}

export interface CreateChessBorrowRequest {
  inventario_id: number;
  estudiante_id: number;
  cantidad: number;
  observacion?: string;
}

export interface ReturnChessRequest {
  inventario_id: number;
  estudiante_id: number;
  piezas_devueltas: number;
  reloj_funciona: boolean;
  observacion: string;
}

export interface ReturnChessResponse {
  id: number;
  estado_prestamo: boolean;
  novedad_creada: boolean;
  mensaje: string;
}

export interface ChessStats {
  totalItems: number;
  availableItems: number;
  borrowedItems: number;
  damagedItems: number;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: T[];
  message: string;
  details: string | null;
  pagination: {
    current_page: number;
    page_size: number;
    total: number;
    total_pages: number;
    previous: boolean;
    next: boolean;
  };
}
