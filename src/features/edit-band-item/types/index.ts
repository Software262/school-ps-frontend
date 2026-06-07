import type { Inventory } from '@/entities/inventory/model/types';

export interface EditItemPayload {
  nombre: string;
  cantidad: number;
  estado_objeto: string;
  observacion: string;
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
