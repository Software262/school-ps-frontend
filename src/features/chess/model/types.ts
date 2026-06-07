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
  fecha_salida: string;
  fecha_devolucion?: string | null;
  estado_prestamo: boolean;
  novedad_pendiente: boolean;
  cantidad: number;
  observacion?: string | null;
}

export interface CreateChessBorrowRequest {
  inventario_id: number;
  estudiante_id: number;
  fecha_salida: string;
  cantidad: number;
  observacion?: string;
}

export interface ReturnChessRequest {
  conteo_piezas: number;
  observacion: string;
}

export interface ReturnChessResponse {
  id: number;
  estado_prestamo: boolean;
  novedad_creada: boolean;
  mensaje: string;
}

export interface ResolveBorrowNoveltyRequest {
  notas_resolucion: string;
  usuario_auditoria_id: number;
}

export interface ChessStats {
  totalItems: number;
  availableItems: number;
  borrowedItems: number;
  damagedItems: number;
}
