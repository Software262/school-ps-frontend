import { useState, useCallback } from 'react';
import { getPupitreByStudent } from '../api/load-pupitre';
import type { ClassroomStudent } from '../types';

export const useLoadPupitreByStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estudiante, setEstudiante] = useState<ClassroomStudent | null>(null);

  const fetchPupitre = useCallback(async (documento: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPupitreByStudent(documento.trim());
      setEstudiante(response.data);
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al buscar');
      setEstudiante(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, estudiante, fetchPupitre };
};
