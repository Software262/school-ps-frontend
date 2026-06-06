import type { Inventory } from '@/entities/inventory/model/types';

export interface EditSportItemPayload {
  nombre: string;
  cantidad: number;
  estado_objeto: string;
  observacion: string;
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
