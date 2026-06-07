import { useCallback, useState } from 'react';
import { searchClassroomStudents } from '../api/search-students';
import type { StudentSearchResult } from '@/features/classroom-holder/model/types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useSearchClassroomStudent = () => {
  const [studentResults, setStudentResults] = useState<StudentSearchResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchResult | null>(null);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  const [studentSearchError, setStudentSearchError] = useState<string | null>(null);

  const searchStudents = useCallback(async (query: string) => {
    const normalizedQuery = query.trim();
    setStudentSearchError(null);

    if (normalizedQuery.length < 2) {
      setStudentResults([]);
      return;
    }

    setIsSearchingStudents(true);
    try {
      const results = await searchClassroomStudents(normalizedQuery);
      setStudentResults(results);
    } catch (err) {
      setStudentResults([]);
      setStudentSearchError(getErrorMessage(err, 'Error al buscar estudiantes.'));
    } finally {
      setIsSearchingStudents(false);
    }
  }, []);

  const selectStudent = useCallback((student: StudentSearchResult) => {
    setSelectedStudent(student);
    setStudentResults([]);
  }, []);

  const clearStudentResults = useCallback(() => {
    setStudentResults([]);
    setStudentSearchError(null);
  }, []);

  return {
    selectedStudent,
    studentResults,
    isSearchingStudents,
    studentSearchError,
    searchStudents,
    selectStudent,
    clearStudentResults,
  };
};
