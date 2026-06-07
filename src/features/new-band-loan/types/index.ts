import type { Inventory } from '@/entities/inventory/model/types';

export interface CreateLoanPayload {
  inventario_id: number;
  estudiante_id: number;
  fecha_salida: string;
  cantidad: number;
  observacion: string;
}

export interface CreateLoanResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export interface NewLoanModalProps {
  isOpen: boolean;
  inventory: Inventory[];
  onClose: () => void;
  onSuccess: () => void;
}

export interface FormFields {
  inventario_id: string;
  estudiante_id: string;
  fecha_salida: string;
  cantidad: string;
  observacion: string;
}

export interface FormErrors {
  inventario_id?: string;
  estudiante_id?: string;
  fecha_salida?: string;
  cantidad?: string;
  general?: string;
}

export interface StudentResult {
  id: number;
  nombre: string;
  documento: string;
}

interface EnrollmentStudent {
  estudiante_id: number;
  nombre: string;
  documento: string;
}

export interface SearchStudentsResponse {
  estudiantes: EnrollmentStudent[];
  total_resultados: number;
}
