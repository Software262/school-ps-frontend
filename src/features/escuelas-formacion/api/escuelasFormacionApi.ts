import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type { Period, Program, Student } from '../model/types';

const BASE = '/training-schools';

// programs and their price (valor) are configured in the matrícula module as
// "complementario" records (POST /enrollment/complementary). this module reads
// them read-only; there is no price editing here by design.
export async function getPrograms(): Promise<Program[]> {
  const res = await fetchApi<ApiResponse<Program[]>>(`${BASE}/programs`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function getPeriods(): Promise<Period[]> {
  const res = await fetchApi<ApiResponse<Period[]>>(`${BASE}/periods`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function searchStudents(query: string): Promise<Student[]> {
  const res = await fetchApi<ApiResponse<Student[]>>(
    `${BASE}/students/search?q=${encodeURIComponent(query)}`,
  );
  return Array.isArray(res.data) ? res.data : [];
}
