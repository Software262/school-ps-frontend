export interface WebcolegiosScrapingRequest {
  url: string;
  usuario: string;
  contrasena: string;
}

export interface WebcolegiosScrapingRunResponse {
  total_estudiantes_scrapeados: number;
  total_docentes_scrapeados: number;
  estudiantes_insertados: number;
  estudiantes_actualizados: number;
  estudiantes_omitidos: number;
  estudiantes_pendientes: number;
  docentes_insertados: number;
  docentes_omitidos: number;
  errores: number;
  detalle: unknown[];
}

export interface WebcolegiosScrapingHistoryItem {
  id: number | null;
  tipo_entidad: string;
  documento_identidad: string;
  nombre?: string | null;
  estado: WebcolegiosScrapingImportState;
  fecha_ingreso: string;
  observacion: string;
}

export interface WebcolegiosScrapingStatusResponse {
  total_registros: number;
  ultimo_estado: WebcolegiosScrapingImportState | null;
  ultima_fecha: string | null;
  recientes: WebcolegiosScrapingHistoryItem[];
}

export interface WebcolegiosClearResponse {
  deleted: number;
  message: string;
}

export type WebcolegiosRobotStatus =
  | 'no_connected'
  | 'connecting'
  | 'running'
  | 'syncing'
  | 'finished'
  | 'error';

export type WebcolegiosScrapingState = WebcolegiosRobotStatus;

export type WebcolegiosScrapingImportState =
  | 'INSERTADO'
  | 'ACTUALIZADO'
  | 'OMITIDO_EXISTENTE'
  | 'PENDIENTE_DATOS'
  | 'ERROR';

export type WebcolegiosScrapingRunMode = 'full' | 'students' | 'teachers';

export type WebcolegiosManualLoadType = 'estudiante' | 'docente';

export interface WebcolegiosManualStudentRecord {
  documento: string;
  nombre: string;
  grado: string;
  curso?: string;
  jornada?: string;
  sede?: string;
  titular?: string;
  acudiente_nombre?: string;
  acudiente_telefono?: string;
  acudiente_correo?: string;
}

export interface WebcolegiosManualTeacherRecord {
  documento: string;
  nombre: string;
  grado_titular?: string;
  curso_titular?: string;
  asignatura?: string;
}

export type WebcolegiosManualRecord =
  | WebcolegiosManualStudentRecord
  | WebcolegiosManualTeacherRecord
  | Record<string, string | number | boolean | null | undefined>;

export interface WebcolegiosBulkLoadRequest {
  tipo: WebcolegiosManualLoadType;
  datos: WebcolegiosManualRecord[];
}

export interface WebcolegiosSingleLoadRequest {
  tipo: WebcolegiosManualLoadType;
  datos: WebcolegiosManualRecord;
}

export interface WebcolegiosScrapingFormFields {
  url: string;
  usuario: string;
  contrasena: string;
}

export type WebcolegiosScrapingFormErrors = Partial<
  Record<keyof WebcolegiosScrapingFormFields | 'general', string>
>;
