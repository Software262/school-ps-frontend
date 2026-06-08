import { fetchApi } from '@/shared/api/apiClient';
import { getAuthHeaders, withTimeout } from '@/features/classroom-holder/api/request';
import type {
  EnrollmentBalanceResponse,
  Incidencia,
  IncidenciaConEstudiante,
  StudentInfo,
} from '@/features/classroom-holder/model/types';

const loadStudent = async (studentId: number): Promise<StudentInfo> => {
  const balance = await withTimeout((signal) =>
    fetchApi<EnrollmentBalanceResponse>(`/enrollment/students/${String(studentId)}/balance`, {
      headers: getAuthHeaders(),
      signal,
    }),
  );
  return balance.estudiante;
};

const enrichIncidents = async (items: Incidencia[]): Promise<IncidenciaConEstudiante[]> => {
  const students = await Promise.all(
    items.map(async (incident) => {
      try {
        return await loadStudent(incident.estudiante_id);
      } catch {
        return null;
      }
    }),
  );

  return items.map((incident, index) => {
    const student = students[index];
    return {
      ...incident,
      estudiante_nombre: student?.nombre ?? `Estudiante #${String(incident.estudiante_id)}`,
      grado_nombre: student?.grado_nombre,
    };
  });
};

export const loadClassroomIncidents = async (): Promise<IncidenciaConEstudiante[]> => {
  const incidents = await withTimeout((signal) =>
    fetchApi<Incidencia[]>('/classroom-holder/incidencias', {
      headers: getAuthHeaders(),
      signal,
    }),
  );
  return enrichIncidents(incidents);
};
