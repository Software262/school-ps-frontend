export interface TeacherStatus {
  id: number;
  docente_id: number;
  periodo_id: number;
  motivo_estado: string;
  fecha_actualizacion: string;
}

export interface TeacherObservation {
  id: number;
  docente_id: number;
  periodo_id: number;
  descripcion: string;
  tipo_observacion: string;
  fecha: string;
}

export interface Teacher {
  id: number;
  nombre: string;
  correo: string;
  /** Assigned administrative status, if any */
  status: TeacherStatus | null;
  /** List of administrative observations */
  observations: TeacherObservation[];
}
