export interface CreateChessItemPayload {
  tipo_inventario_id: number;
  nombre: string;
  cantidad_total: number;
  observacion?: string;
}

export interface CreateChessItemResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface NewChessItemModalProps {
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

export interface ChessItemFormFields {
  nombre: string;
  cantidad_total: string;
  piezas_totales: string;
  observacion: string;
}

export interface ChessItemFormErrors {
  nombre?: string;
  cantidad_total?: string;
  piezas_totales?: string;
  general?: string;
}

