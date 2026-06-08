import { useEffect, useState, useCallback } from 'react';
import type { DebtorRow, Grade } from '@/features/cafeteria/model/types';
import { loadDebtors, loadGrades } from '../api/load-debtors';

export const useLoadDebtors = () => {
  const [debtors, setDebtors] = useState<DebtorRow[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    Promise.all([loadDebtors(1), loadGrades()])
      .then(([debtorData, gradeData]) => {
        setDebtors(debtorData);
        setGrades(gradeData);
      })
      .catch(() => {
        setDebtors([]);
        setGrades([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  return { debtors, grades, loading, refetch };
};
