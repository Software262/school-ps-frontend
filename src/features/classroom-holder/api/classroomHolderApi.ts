import type {
  EnrollmentBalanceResponse,
  Incidencia,
  IncidenciaCreateRequest,
  PazYSalvoResponse,
} from '../model/types';

const API_URL = 'http://localhost:8000/api/v1';
const CLASSROOM_HOLDER_URL = `${API_URL}/classroom-holder`;
const ENROLLMENT_URL = `${API_URL}/enrollment`;

export const classroomHolderApi = {
  crearIncidencia: async (data: IncidenciaCreateRequest): Promise<Incidencia> => {
    const response = await fetch(`${CLASSROOM_HOLDER_URL}/incidencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear incidencia');
    return response.json();
  },

  obtenerIncidenciasPorEstudiante: async (estudianteId: number): Promise<Incidencia[]> => {
    const response = await fetch(`${CLASSROOM_HOLDER_URL}/incidencias/estudiante/${estudianteId}`);
    if (!response.ok) throw new Error('Error al obtener incidencias');
    return response.json();
  },

  cerrarIncidencia: async (incidenciaId: number): Promise<Incidencia> => {
    const response = await fetch(`${CLASSROOM_HOLDER_URL}/incidencias/${incidenciaId}/cerrar`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Error al cerrar incidencia');
    return response.json();
  },

  verificarPazYSalvo: async (estudianteId: number): Promise<PazYSalvoResponse> => {
    const response = await fetch(`${CLASSROOM_HOLDER_URL}/paz-y-salvo/verificar/${estudianteId}`);
    if (!response.ok) throw new Error('Error al verificar paz y salvo');
    return response.json();
  },

  obtenerBalanceEstudiante: async (estudianteId: number): Promise<EnrollmentBalanceResponse> => {
    const response = await fetch(`${ENROLLMENT_URL}/students/${estudianteId}/balance`);
    if (!response.ok) throw new Error('Error al obtener el estudiante');
    return response.json();
  },

  // 🌟 NUEVA FUNCIÓN: Llama a tu propio backend para buscar por nombre
  buscarEstudiantes: async (query: string): Promise<Array<{id: number, nombre: string, grado_nombre: string}>> => {
    if (!query) return [];
    const response = await fetch(`${CLASSROOM_HOLDER_URL}/buscar-estudiantes?q=${query}`);
    if (!response.ok) return [];
    return response.json();
  },
};