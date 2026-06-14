import type { Inventory } from '@/entities/inventory/model/types';

export interface EditSportItemPayload {
  tipo_inventario_id?: number;
  nombre?: string;
  cantidad_total?: number;
  observacion?: string;
  cantidad_disponible?: number;
  cantidad_mantenimiento?: number;
}

export interface EditSportItemResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface EditSportItemModalProps {
  isOpen: boolean;
  item: Inventory | null;
  onClose: () => void;
  onSuccess: () => void;
}
