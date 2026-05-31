import { useState } from 'react';
import { classroomHolderApi } from '../api/classroomHolderApi';
import type { Incidencia, IncidenciaCreateRequest, PazYSalvoResponse } from '../model/types';

export const useClassroomHolder = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [pazYSalvoStatus, setPazYSalvoStatus] = useState<PazYSalvoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarEstudiante = async (estudianteId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [incidenciasData, statusData] = await Promise.all([
        classroomHolderApi.obtenerIncidenciasPorEstudiante(estudianteId),
        classroomHolderApi.verificarPazYSalvo(estudianteId),
      ]);
      setIncidencias(incidenciasData);
      setPazYSalvoStatus(statusData);
    } catch (err) {
      setError('Error al cargar los datos del estudiante.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const registrarIncidencia = async (data: IncidenciaCreateRequest) => {
    setIsLoading(true);
    try {
      await classroomHolderApi.crearIncidencia(data);
      await buscarEstudiante(data.estudiante_id); // Recargar datos para actualizar la tabla
    } catch (err) {
      setError('Error al registrar la incidencia.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resolverIncidencia = async (incidenciaId: number, estudianteId: number) => {
    setIsLoading(true);
    try {
      await classroomHolderApi.cerrarIncidencia(incidenciaId);
      await buscarEstudiante(estudianteId); // Recargar datos para actualizar Paz y Salvo
    } catch (err) {
      setError('Error al resolver la incidencia.');
      console.error(err);
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
    registrarIncidencia,
    resolverIncidencia,
  };
};