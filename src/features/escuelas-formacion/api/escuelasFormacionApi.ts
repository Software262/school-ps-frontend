import { env } from '@/shared/config';
import type { ApiResponse } from '@/shared/types/api';
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

const BASE = `${env.baseApi}/training-schools`;

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) {
    const detail =
      typeof json.details === 'string' && json.details.length > 0 ? json.details : json.message;
    throw new Error(detail || `Error ${String(res.status)}`);
  }
  return json.data as T;
}

// programs and their price (valor) are configured in the matrícula module as
// "complementario" records (POST /enrollment/complementary). this module reads
// them read-only; there is no price editing here by design.
export async function getPrograms(): Promise<Program[]> {
  const res = await fetch(`${BASE}/programs`);
  const data = await handleResponse<Program[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function getPeriods(): Promise<Period[]> {
  const res = await fetch(`${BASE}/periods`);
  const data = await handleResponse<Period[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function searchStudents(query: string): Promise<Student[]> {
  const res = await fetch(`${BASE}/students/search?q=${encodeURIComponent(query)}`);
  const data = await handleResponse<Student[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function getEnrollments(periodoId: number): Promise<Enrollment[]> {
  const res = await fetch(`${BASE}/enrollments/${String(periodoId)}`);
  const data = await handleResponse<Enrollment[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function enrollStudent(payload: EnrollStudentRequest): Promise<Enrollment> {
  const res = await fetch(`${BASE}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Enrollment>(res);
}

export async function registerPayment(payload: RegisterPaymentRequest): Promise<Enrollment> {
  const res = await fetch(`${BASE}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Enrollment>(res);
}

export async function withdrawStudent(payload: WithdrawStudentRequest): Promise<Enrollment> {
  const res = await fetch(`${BASE}/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Enrollment>(res);
}

export async function getPazYSalvo(estudianteId: number): Promise<PazYSalvoStatus> {
  const res = await fetch(`${BASE}/paz-y-salvo/${String(estudianteId)}`);
  return handleResponse<PazYSalvoStatus>(res);
}
