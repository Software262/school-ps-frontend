import type { StudentSearchItem } from '@/entities/student/model/types';

export interface StudentSearchListResponse {
  estudiantes: StudentSearchItem[];
  total_resultados: number;
}
