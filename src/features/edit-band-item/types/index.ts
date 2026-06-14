import type { Inventory } from '@/entities/inventory/model/types';

export interface EditItemPayload {
  tipo_inventario_id?: number;
  nombre?: string;
  cantidad_total?: number;
  observacion?: string;
  cantidad_disponible?: number;
  cantidad_mantenimiento?: number;
}

export interface EditItemResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface EditItemModalProps {
  isOpen: boolean;
  item: Inventory | null;
  onClose: () => void;
  onSuccess: () => void;
}
