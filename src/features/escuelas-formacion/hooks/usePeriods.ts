import { useState, useEffect } from 'react';
import { getPeriods } from '../api/escuelasFormacionApi';
import type { Period } from '../model/types';

export const usePeriods = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeriods()
      .then((data) => {
        setPeriods(data);
        if (data.length > 0) {
          setSelectedPeriod(String(data[0].id));
        }
      })
      .catch(() => {
        setPeriods([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { periods, selectedPeriod, setSelectedPeriod, loading };
};
