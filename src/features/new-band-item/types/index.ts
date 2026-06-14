export interface CreateItemPayload {
  tipo_inventario_id: number;
  nombre: string;
  cantidad_total: number;
  observacion?: string;
}

export interface CreateItemResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface InventoryTypeData {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTypeResponse {
  statusCode: number;
  data: InventoryTypeData;
  message: string;
}

export interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
