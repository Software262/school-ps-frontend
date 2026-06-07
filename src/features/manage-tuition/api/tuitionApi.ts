import { fetchApi } from '@shared/api/apiClient';
import type {
  TuitionAccountResponse,
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '@/entities/tuition/model/types';

export const getStudentTuitionByDocumento = (documento: string): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`/tuition/student/documento/${documento}`);

export const getStudentTuition = (studentId: number): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`/tuition/student/${studentId.toString()}`);

export const registerPayment = (
  request: PaymentCreateRequest,
): Promise<TuitionInstallmentResponse> =>
  fetchApi<TuitionInstallmentResponse>(`/tuition/payment`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
