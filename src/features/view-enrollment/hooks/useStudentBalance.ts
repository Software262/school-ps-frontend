import { useState, useCallback } from 'react';
import { getStudentBalance } from '../api/viewEnrollmentApi';
import type { StudentBalance } from '@/entities/student/model/types';

export const useStudentBalance = () => {
  const [balance, setBalance] = useState<StudentBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentBalance(id);
      setBalance(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching balance');
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { balance, loading, error, fetchBalance };
};
