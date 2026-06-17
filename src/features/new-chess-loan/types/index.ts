export interface StudentResult {
  id: number;
  nombre: string;
  documento: string;
}

export interface NewChessLoanFormFields {
  estudiante_id: string;
  observacion: string;
}

export interface NewChessLoanFormErrors {
  estudiante_id?: string;
  general?: string;
}

export interface NewChessLoanModalProps {
  isOpen: boolean;
  item: { id: number; nombre: string; cantidad_total?: number; stocks?: { estado: string; cantidad: number }[] } | null;
  onClose: () => void;
  onSuccess: () => void;
}
