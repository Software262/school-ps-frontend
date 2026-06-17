import { fetchApi } from '@shared/api/apiClient';
import type {
  TuitionAccountResponse,
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '@/entities/tuition/model/types';
import type { StudentSearchItem } from '@/entities/student/model/types';

export const getStudentTuitionByDocumento = (documento: string): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`/tuition/student/documento/${documento}`);

export const searchTuitionStudents = (
  query: string,
): Promise<{ estudiantes: StudentSearchItem[] }> =>
  fetchApi<{ estudiantes: StudentSearchItem[] }>(`/tuition/search?q=${encodeURIComponent(query)}`);

export const getStudentTuition = (studentId: number): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`/tuition/student/${studentId.toString()}`);

export const registerPayment = (
  request: PaymentCreateRequest,
): Promise<TuitionInstallmentResponse> =>
  fetchApi<TuitionInstallmentResponse>(`/tuition/payment`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
