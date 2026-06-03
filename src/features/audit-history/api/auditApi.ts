import { fetchApi } from '@/shared/api/apiClient';
import type { PaymentHistoryItem, PaymentReceiptResponse } from '../types';

export const getPaymentHistory = async (
  studentId: number,
  year?: number,
): Promise<PaymentHistoryItem[]> => {
  const query = year ? `?year=${year.toString()}` : '';
  return fetchApi<PaymentHistoryItem[]>(
    `/enrollment/students/${studentId.toString()}/payments${query}`,
  );
};

export const getPaymentReceipt = async (pagoId: number): Promise<PaymentReceiptResponse> => {
  return fetchApi<PaymentReceiptResponse>(`/enrollment/payments/${pagoId.toString()}/receipt`);
};
