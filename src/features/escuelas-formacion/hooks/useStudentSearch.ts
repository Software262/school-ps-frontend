import { useState } from 'react';
import { searchStudents } from '../api/escuelasFormacionApi';
import type { Student } from '../model/types';

export const useStudentSearch = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  async function search(input: string) {
    if (input.trim().length < 2) return;
    setQuery(input.trim());
    setError(null);
    setLoading(true);
    try {
      const data = await searchStudents(input.trim());
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setStudents([]);
    setQuery('');
    setError(null);
  }

  return { students, loading, error, query, search, clear };
};
