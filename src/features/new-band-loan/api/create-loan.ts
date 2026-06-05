import { fetchApi } from '@/shared/api/apiClient';
import type { CreateLoanPayload, CreateLoanResponse } from '../types';

export const createLoan = async (payload: CreateLoanPayload): Promise<CreateLoanResponse> => {
  return fetchApi<CreateLoanResponse>('/musical-band/borrowings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
