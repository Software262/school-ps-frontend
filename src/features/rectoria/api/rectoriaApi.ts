import { fetchApi } from '@/shared/api/apiClient';
import type { Teacher, TeacherObservation, TeacherStatus } from '@/entities/teacher/model/types';
import type { CreateObservationRequest, CreateStatusRequest, UpdateStatusRequest } from '../types';
import type { ApiResponse } from '@/shared/types/api';

interface RawTeacher {
  id: number;
  nombre: string;
  correo?: string;
  estados_administrativos?: TeacherStatus[];
  observaciones?: TeacherObservation[];
}

/** Fetch all teachers with their statuses and observations */
export async function getTeachers(): Promise<Teacher[]> {
  const json =
    await fetchApi<ApiResponse<RawTeacher[] | Record<string, never>>>('/principal/teachers');

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
  await fetchApi('/principal/observations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Assign a new administrative status (paz y salvo) to a teacher */
export async function createStatus(data: CreateStatusRequest): Promise<void> {
  await fetchApi('/principal/status', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Update an existing administrative status */
export async function updateStatus(statusId: number, data: UpdateStatusRequest): Promise<void> {
  await fetchApi(`/principal/status/${String(statusId)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
