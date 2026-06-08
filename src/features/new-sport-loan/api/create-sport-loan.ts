import { fetchApi } from '@/shared/api/apiClient';
import type { CreateSportLoanPayload, CreateSportLoanResponse } from '../types';

export const createSportLoan = async (
  payload: CreateSportLoanPayload,
): Promise<CreateSportLoanResponse> => {
  return fetchApi<CreateSportLoanResponse>('/sports/borrow', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
