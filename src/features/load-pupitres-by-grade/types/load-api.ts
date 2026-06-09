export interface GradeInfo {
  id: number;
  nombre: string;
  docente_titular: string | null;
}

export interface PupitreByGrade {
  id: number;
  estudiante_id: number;
  nombre_estudiante: string;
  documento: string;
  grado: string;
  estado_pupitre: boolean;
  observacion: string | null;
}

export interface PupitresByGradeResponse {
  statusCode: number;
  data: PupitreByGrade[];
  message: string;
  details: null;
}
