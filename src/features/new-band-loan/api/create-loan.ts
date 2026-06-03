import { fetchApi } from '@/shared/api/apiClient';
import type { CreateLoanPayload, CreateLoanResponse } from '../types';

export const createLoan = async (payload: CreateLoanPayload): Promise<CreateLoanResponse> => {
  return fetchApi<CreateLoanResponse>('/inventory/borrow', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
