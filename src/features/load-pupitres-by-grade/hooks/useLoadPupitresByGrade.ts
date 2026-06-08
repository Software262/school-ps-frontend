import { useState, useCallback, useEffect } from 'react';
import { getAllGrades, getPupitresByGrade } from '../api/load-pupitre-by-grade';
import type { GradeInfo, PupitreByGrade } from '../types';

export const useLoadPupitresByGrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grados, setGrados] = useState<GradeInfo[]>([]);
  const [pupitres, setPupitres] = useState<PupitreByGrade[]>([]);

  // Carga los grados al montar el componente
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllGrades();
        setGrados(data);
      } catch (err: unknown) {
        console.error('Error cargando grados:', err);
      }
    };
    void fetchGrades();
  }, []);

  // Busca los pupitres de un grado
  const fetchPupitresByGrade = useCallback(async (grado_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPupitresByGrade(grado_id);
      setPupitres(response.data);
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al buscar');
      setPupitres([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, grados, pupitres, fetchPupitresByGrade };
};
