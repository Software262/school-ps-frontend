import { useState } from 'react';
import { searchStudents } from '../api/searchApi';
import type { StudentSearchListResponse } from '../types';

export const useSearchStudents = () => {
  const [data, setData] = useState<StudentSearchListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (params: { documento?: string; nombre?: string; year?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchStudents(params);
      setData(response);
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al buscar estudiantes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchStudents };
};
