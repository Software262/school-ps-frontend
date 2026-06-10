import { useState, useCallback } from 'react';
import {
  getComplementaryConcepts,
  createComplementaryConcept,
  assignComplementaryConcept,
} from '../api/modifyApi';
import type { CreateComplementaryPayload } from '../types';

export const useAssignConcept = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConcepts = useCallback(async (year?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplementaryConcepts(year);
      return data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al obtener los conceptos complementarios',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createConcept = useCallback(async (payload: CreateComplementaryPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createComplementaryConcept(payload);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el concepto complementario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignConcept = useCallback(
    async (studentId: number, payload: { complementario_id: number; descuento: number }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await assignComplementaryConcept(studentId, payload);
        return data;
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Error al asignar el concepto complementario',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, fetchConcepts, createConcept, assignConcept };
};
