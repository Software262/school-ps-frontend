export interface ClassroomStudent {
  id: number;
  estudiante_id: number;
  nombre_estudiante: string;
  documento: string;
  grado: string;
  estado_pupitre: boolean;
  observacion: string | null;
}

export interface PupitreByStudentResponse {
  statusCode: number;
  data: ClassroomStudent;
  message: string;
  details: null;
}
