import { useCallback, useState } from 'react';
import type { GeneralStudent } from '@/features/cafeteria/model/types';
import { searchCafeteriaStudents } from '../api/search-students';

export const useSearchCafeteriaStudent = () => {
  const [results, setResults] = useState<GeneralStudent[]>([]);

  const search = useCallback(async (query: string, gradoId?: number) => {
    if (!query.trim() && !gradoId) {
      setResults([]);
      return;
    }
    try {
      const data = await searchCafeteriaStudents(query, gradoId);
      setResults(data);
    } catch {
      setResults([]);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return { results, search, clear };
};
