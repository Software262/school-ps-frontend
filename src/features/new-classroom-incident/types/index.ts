import type { TipoIncidencia } from '@/features/classroom-holder/model/types';

export interface NewIncidentFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export interface IncidentFormFields {
  estudiante_id: string;
  curso_grupo: string;
  tipo_incidencia: TipoIncidencia | '';
  fecha: string;
  descripcion: string;
}

export interface IncidentFormErrors {
  estudiante_id?: string;
  tipo_incidencia?: string;
  fecha?: string;
  descripcion?: string;
  general?: string;
}
