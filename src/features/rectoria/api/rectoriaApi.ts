import { env } from '@/shared/config';
import type { Teacher, TeacherObservation, TeacherStatus } from '@/entities/teacher/model/types';
import type {
  CreateObservationRequest,
  CreateStatusRequest,
  UpdateStatusRequest,
} from '../model/types';
import type { ApiResponse } from '@/shared/types/api';

interface RawTeacher {
  id: number;
  nombre: string;
  correo?: string;
  estados_administrativos?: TeacherStatus[];
  observaciones?: TeacherObservation[];
}

const BASE_URL = `${env.baseApi}/principal`;

async function handleResponse<T>(res: Response): Promise<T> {
  const raw: unknown = await res.json();
  const json = raw as ApiResponse<T>;

  if (!res.ok) {
    const fallbackMessage = `Error ${String(res.status)}`;
    const message = json.message.trim().length > 0 ? json.message : fallbackMessage;

    throw new Error(typeof json.details === 'string' ? json.details : message);
  }

  return json.data as T;
}

/** Fetch all teachers with their statuses and observations */
export async function getTeachers(): Promise<Teacher[]> {
  const res = await fetch(`${BASE_URL}/teachers`);

  const raw: unknown = await res.json();
  const json = raw as ApiResponse<RawTeacher[] | Record<string, never>>;

  if (!res.ok) {
    const fallbackMessage = `Error ${String(res.status)}`;
    const message = json.message.trim().length > 0 ? json.message : fallbackMessage;
    throw new Error(message);
  }

  // Handle edge case: backend returns {} when empty
  if (!Array.isArray(json.data)) return [];

  // Map backend keys to our frontend entity
  return json.data.map((item) => {
    // Backend returns a list of status, we take the last one or null
    const statusList = item.estados_administrativos ?? [];
    const currentStatus = statusList.at(-1) ?? null;

    return {
      id: item.id,
      nombre: item.nombre,
      correo: item.correo ?? '', // correo is missing from backend, fallback to empty
      status: currentStatus,
      observations: item.observaciones ?? [],
    };
  });
}

/** Create a new administrative observation for a teacher */
export async function createObservation(data: CreateObservationRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/observations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse<unknown>(res);
}

/** Assign a new administrative status (paz y salvo) to a teacher */
export async function createStatus(data: CreateStatusRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse<unknown>(res);
}

/** Update an existing administrative status */
export async function updateStatus(statusId: number, data: UpdateStatusRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/status/${String(statusId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse<unknown>(res);
}
