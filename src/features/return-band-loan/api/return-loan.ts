import { fetchApi } from '@/shared/api/apiClient';

export interface ReturnLoanPayload {
  inventario_id: number;
  estudiante_id: number;
  cantidad: number;
  observacion: string;
}

export interface ReturnLoanResponse {
  statusCode: number;
  message: string;
  details?: string | null;
}

export const returnLoan = async (
  loanId: number,
  payload: ReturnLoanPayload,
): Promise<ReturnLoanResponse> => {
  return fetchApi<ReturnLoanResponse>(`/musical-band/borrowings/${String(loanId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
