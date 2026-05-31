import type { Incidencia, IncidenciaCreateRequest, PazYSalvoResponse } from '../model/types';

// CAMBIA ESTO:
// const BASE_URL = 'http://127.0.0.1:8000/api/v1/classroom-holder';

// POR ESTO (Usa localhost para ser consistente con el origen):
const BASE_URL = 'http://localhost:8000/api/v1/classroom-holder';

export const classroomHolderApi = {
  crearIncidencia: async (data: IncidenciaCreateRequest): Promise<Incidencia> => {
    const response = await fetch(`${BASE_URL}/incidencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear incidencia');
    return response.json();
  },

  obtenerIncidenciasPorEstudiante: async (estudianteId: number): Promise<Incidencia[]> => {
    const response = await fetch(`${BASE_URL}/incidencias/estudiante/${estudianteId}`);
    if (!response.ok) throw new Error('Error al obtener incidencias');
    return response.json();
  },

  cerrarIncidencia: async (incidenciaId: number): Promise<Incidencia> => {
    const response = await fetch(`${BASE_URL}/incidencias/${incidenciaId}/cerrar`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Error al cerrar incidencia');
    return response.json();
  },

  verificarPazYSalvo: async (estudianteId: number): Promise<PazYSalvoResponse> => {
    const response = await fetch(`${BASE_URL}/paz-y-salvo/verificar/${estudianteId}`);
    if (!response.ok) throw new Error('Error al verificar paz y salvo');
    return response.json();
  },
};