import { useState, useEffect } from 'react';
import { getPrograms } from '../api/escuelasFormacionApi';
import type { Program } from '../model/types';

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(() => {
        setPrograms([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { programs, loading };
};
