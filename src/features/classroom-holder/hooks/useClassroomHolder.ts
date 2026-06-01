import { useState } from 'react';
import { classroomHolderApi } from '../api/classroomHolderApi';
import type {
  Incidencia,
  IncidenciaConEstudiante,
  IncidenciaCreateRequest,
  PazYSalvoResponse,
  StudentInfo,
} from '../model/types';

export const useClassroomHolder = () => {
  const [incidencias, setIncidencias] = useState<IncidenciaConEstudiante[]>([]);
  const [pazYSalvoStatus, setPazYSalvoStatus] = useState<PazYSalvoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEstudiante = async (estudianteId: number): Promise<StudentInfo> => {
    const balance = await classroomHolderApi.obtenerBalanceEstudiante(estudianteId);
    return balance.estudiante;
  };

  const enriquecerIncidencias = async (items: Incidencia[]): Promise<IncidenciaConEstudiante[]> => {
    const estudiantes = await Promise.all(
      items.map(async (incidencia) => {
        try {
          return await cargarEstudiante(incidencia.estudiante_id);
        } catch {
          return null;
        }
      }),
    );

    return items.map((incidencia, index) => {
      const estudiante = estudiantes[index];
      return {
        ...incidencia,
        estudiante_nombre: estudiante?.nombre ?? `Estudiante #${incidencia.estudiante_id}`,
        grado_nombre: estudiante?.grado_nombre,
      };
    });
  };

  const buscarEstudiante = async (estudianteId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [incidenciasData, statusData] = await Promise.all([
        classroomHolderApi.obtenerIncidenciasPorEstudiante(estudianteId),
        classroomHolderApi.verificarPazYSalvo(estudianteId),
      ]);
      const incidenciasConEstudiante = await enriquecerIncidencias(incidenciasData);
      setIncidencias(incidenciasConEstudiante);
      setPazYSalvoStatus(statusData);
    } catch (err) {
      setError('Error al cargar los datos del estudiante.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const registrarIncidencia = async (data: IncidenciaCreateRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await classroomHolderApi.crearIncidencia(data);
      await buscarEstudiante(data.estudiante_id); // Recargar datos para actualizar la tabla
      return true;
    } catch (err) {
      setError('Error al registrar la incidencia.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resolverIncidencia = async (incidenciaId: number, estudianteId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await classroomHolderApi.cerrarIncidencia(incidenciaId);
      await buscarEstudiante(estudianteId); // Recargar datos para actualizar Paz y Salvo
      return true;
    } catch (err) {
      setError('Error al resolver la incidencia.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    incidencias,
    pazYSalvoStatus,
    isLoading,
    error,
    buscarEstudiante,
    cargarEstudiante,
    registrarIncidencia,
    resolverIncidencia,
  };
};
