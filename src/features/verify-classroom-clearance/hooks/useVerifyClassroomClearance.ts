import { useCallback, useState } from 'react';
import { verifyClassroomClearance } from '../api/verify-clearance';
import type { PazYSalvoResponse } from '@/features/classroom-holder/model/types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useVerifyClassroomClearance = () => {
  const [clearance, setClearance] = useState<PazYSalvoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyClearance = useCallback(async (studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyClassroomClearance(studentId);
      setClearance(result);
    } catch (err) {
      setClearance(null);
      setError(getErrorMessage(err, 'Error al verificar paz y salvo.'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { clearance, loading, error, verifyClearance };
};
