import { fetchApi } from '@shared/api/apiClient';
import type {
  TuitionAccountResponse,
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '@/entities/tuition/model/types';

const ENDPOINT = '/v1/tuition';

export const getStudentTuitionByDocumento = (documento: string): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`${ENDPOINT}/student/documento/${documento}`);

export const getStudentTuition = (studentId: number): Promise<TuitionAccountResponse> =>
  fetchApi<TuitionAccountResponse>(`${ENDPOINT}/student/${studentId.toString()}`);

export const registerPayment = (
  request: PaymentCreateRequest,
): Promise<TuitionInstallmentResponse> =>
  fetchApi<TuitionInstallmentResponse>(`${ENDPOINT}/payment`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
