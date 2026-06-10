import { fetchApi } from '@/shared/api/apiClient';
import type {
  ModifyEnrollmentResponse,
  ComplementaryConcept,
  CreateComplementaryPayload,
} from '../types';

export const modifyEnrollment = async (
  matriculaId: number,
  payload: {
    motivo: string;
    observaciones?: string;
    nuevo_costo_base?: number;
    complementarios?: {
      detalle_id: number;
      nuevo_valor_completo?: number;
    }[];
  },
): Promise<ModifyEnrollmentResponse> => {
  return fetchApi<ModifyEnrollmentResponse>(
    `/enrollment/students/${matriculaId.toString()}/matricula`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
};

export const deleteComplementaryDetail = async (
  detalleId: number,
): Promise<{ mensaje: string; detalle_id: number; matricula_id: number }> => {
  return fetchApi<{ mensaje: string; detalle_id: number; matricula_id: number }>(
    `/enrollment/details/${detalleId.toString()}`,
    {
      method: 'DELETE',
    },
  );
};

export const getComplementaryConcepts = async (year?: number): Promise<ComplementaryConcept[]> => {
  const query = year !== undefined ? `?year=${year.toString()}` : '';
  return fetchApi<ComplementaryConcept[]>(`/enrollment/complementary${query}`);
};

export const createComplementaryConcept = async (
  payload: CreateComplementaryPayload,
): Promise<{ mensaje: string; complementario_id: number }> => {
  return fetchApi<{ mensaje: string; complementario_id: number }>(`/enrollment/complementary`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const assignComplementaryConcept = async (
  studentId: number,
  payload: { complementario_id: number; descuento: number },
): Promise<{ mensaje: string; detalle_id: number }> => {
  return fetchApi<{ mensaje: string; detalle_id: number }>(
    `/enrollment/students/${studentId.toString()}/complementary/assign`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
};
