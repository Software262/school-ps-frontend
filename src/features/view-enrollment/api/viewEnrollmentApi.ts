import { fetchApi } from '@/shared/api/apiClient';
import type { StudentBalance } from '@/entities/student/model/types';

export const getStudentBalance = async (
  studentId: number,
  year: number = new Date().getFullYear(),
): Promise<StudentBalance> => {
  return fetchApi<StudentBalance>(
    `/enrollment/students/${studentId.toString()}/balance?year=${year.toString()}`,
  );
};
