import type {
  TuitionAccountResponse,
  TuitionInstallmentResponse,
  PaymentCreateRequest,
} from '../model/types';

const API_BASE_URL = 'http://localhost:8000/api/v1/tuition';

export const tuitionService = {
  async getStudentTuitionByDocumento(documento: string): Promise<TuitionAccountResponse> {
    const response = await fetch(`${API_BASE_URL}/student/documento/${documento}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No se encontró ningún estudiante con esa cédula.');
      }
      throw new Error('Error al conectar con el servidor.');
    }
    return (await response.json()) as TuitionAccountResponse;
  },

  async getStudentTuition(studentId: number): Promise<TuitionAccountResponse> {
    const response = await fetch(`${API_BASE_URL}/student/${studentId.toString()}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No se encontró cuenta de pensión para el estudiante.');
      }
      throw new Error('Error al conectar con el servidor.');
    }
    return (await response.json()) as TuitionAccountResponse;
  },

  async registerPayment(
    request: PaymentCreateRequest
  ): Promise<TuitionInstallmentResponse> {
    const response = await fetch(`${API_BASE_URL}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as { detail?: string } | null;
      throw new Error(errorData?.detail ?? 'Error al registrar el pago.');
    }
    return (await response.json()) as TuitionInstallmentResponse;
  },
};
