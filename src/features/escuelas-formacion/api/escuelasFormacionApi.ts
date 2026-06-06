import { fetchApi } from '@shared/api/apiClient';
import type { ApiResponse } from '@shared/types/api';
import type {
  Enrollment,
  EnrollStudentRequest,
  PazYSalvoStatus,
  Period,
  Program,
  RegisterPaymentRequest,
  Student,
  WithdrawStudentRequest,
} from '../model/types';

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

export async function getEnrollments(periodoId: number): Promise<Enrollment[]> {
  const res = await fetchApi<ApiResponse<Enrollment[]>>(`${BASE}/enrollments/${String(periodoId)}`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function enrollStudent(payload: EnrollStudentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/enroll`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al inscribir');
  return res.data;
}

export async function registerPayment(payload: RegisterPaymentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/payment`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al registrar pago');
  return res.data;
}

export async function withdrawStudent(payload: WithdrawStudentRequest): Promise<Enrollment> {
  const res = await fetchApi<ApiResponse<Enrollment>>(`${BASE}/withdraw`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error(res.message || 'Error al registrar retiro');
  return res.data;
}

export async function getPazYSalvo(estudianteId: number): Promise<PazYSalvoStatus> {
  const res = await fetchApi<ApiResponse<PazYSalvoStatus>>(
    `${BASE}/paz-y-salvo/${String(estudianteId)}`,
  );
  if (!res.data) throw new Error(res.message || 'Error al consultar paz y salvo');
  return res.data;
}
