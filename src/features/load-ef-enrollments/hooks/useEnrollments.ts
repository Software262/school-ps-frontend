import { useState, useCallback } from 'react';
import { getEnrollments } from '../api/get-enrollments';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = useCallback(async (periodoId: string): Promise<Enrollment[]> => {
    if (!periodoId) return [];
    setLoading(true);
    try {
      const data = await getEnrollments(Number(periodoId));
      setEnrollments(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { enrollments, loading, fetchEnrollments };
};
