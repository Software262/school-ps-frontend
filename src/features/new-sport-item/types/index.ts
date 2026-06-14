export interface CreateSportItemPayload {
  tipo_inventario_id: number;
  nombre: string;
  cantidad_total: number;
  observacion?: string;
}

export interface CreateSportItemResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface NewSportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
