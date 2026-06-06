import { useState } from 'react';
import {
  getStudentTuitionByDocumento,
  registerPayment,
} from '@/features/manage-tuition/api/tuitionApi';
import type {
  TuitionAccountResponse,
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '@/entities/tuition/model/types';

export const useTuition = () => {
  const [accountData, setAccountData] = useState<TuitionAccountResponse | null>(null);
  const [lastDocumento, setLastDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStudentData = async (documento: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getStudentTuitionByDocumento(documento);
      data.installments.sort((a, b) => a.mes - b.mes);
      setAccountData(data);
      setLastDocumento(documento);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Error desconocido al cargar datos.');
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  };

  const submitPayment = async (
    request: PaymentCreateRequest,
  ): Promise<TuitionInstallmentResponse> => {
    return registerPayment(request);
  };

  const clearData = () => {
    setAccountData(null);
    setErrorMsg('');
  };

  return {
    accountData,
    lastDocumento,
    loading,
    errorMsg,
    fetchStudentData,
    submitPayment,
    clearData,
    refetch: () => fetchStudentData(lastDocumento),
  };
};
