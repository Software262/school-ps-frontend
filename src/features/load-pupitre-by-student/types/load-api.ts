export interface ClassroomStudent {
  id: number;
  estudiante_id: number;
  nombre_estudiante: string;
  documento: string;
  grado: string;
  docente_titular?: string;
  estado: string;
  observacion: string | null;
}

export interface PupitreByStudentResponse {
  statusCode: number;
  data: ClassroomStudent;
  message: string;
  details: null;
}
