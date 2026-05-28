/* eslint-disable */
import type { Teacher } from '../../../entities/teacher/model/types';
import type {
  CreateObservationRequest,
  CreateStatusRequest,
  UpdateStatusRequest,
} from '../model/types';
import type { ApiResponse } from '../../../shared/types/api';


interface RawTeacher {
  id: number;
  nombre: string;
  correo?: string;
  estados_administrativos?: any[];
  observaciones?: any[];
}

const BASE_URL = 'http://localhost:8000/api/v1/principal';

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof json.details === 'string'
        ? json.details
        : (json.message ?? `Error ${res.status}`)
    );
  }
  return json.data as T;
}

/** Fetch all teachers with their statuses and observations */
export async function getTeachers(): Promise<Teacher[]> {
  const res = await fetch(`${BASE_URL}/teachers`);
   
  const json: ApiResponse<RawTeacher[] | Record<string, never>> = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);

  // Handle edge case: backend returns {} when empty
  if (!Array.isArray(json.data)) return [];

  // Map backend keys to our frontend entity
  return json.data.map((item) => {
    // Backend returns a list of status, we take the last one or null
    const statusList = item.estados_administrativos || [];
    const currentStatus = statusList.length > 0 ? statusList[statusList.length - 1] : null;

    return {
      id: item.id,
      nombre: item.nombre,
      correo: item.correo || '', // correo is missing from backend, fallback to empty
      status: currentStatus,
      observations: item.observaciones || [],
    };
  });
}

/** Create a new administrative observation for a teacher */
export async function createObservation(
  data: CreateObservationRequest
): Promise<void> {
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
export async function updateStatus(
  statusId: number,
  data: UpdateStatusRequest
): Promise<void> {
  const res = await fetch(`${BASE_URL}/status/${String(statusId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await handleResponse<unknown>(res);
}
