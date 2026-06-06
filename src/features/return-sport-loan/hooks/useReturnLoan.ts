import { useState } from 'react';
import type { LoanFormatted } from '@/entities/loan/model/loan-utils';
import { returnLoan } from '../api/return-loan';

export const useReturnLoan = (onSuccess: () => void) => {
  const [selectedLoan, setSelectedLoan] = useState<LoanFormatted | null>(null);
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectLoan = (loan: LoanFormatted) => {
    setSelectedLoan(loan);
    setObservacion(loan.observacion); // pre-llena con la observación existente
    setError(null);
  };

  const handleObservacionChange = (value: string) => {
    setObservacion(value);
    setError(null);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedLoan) {
      setError('Selecciona un préstamo de la lista para continuar.');
      return;
    }

    setLoading(true);
    try {
      await returnLoan(selectedLoan.id, {
        inventario_id: selectedLoan.inventario_id,
        estudiante_id: selectedLoan.estudiante_id,
        cantidad: selectedLoan.cantidad,
        observacion,
      });
      reset();
      onSuccess();
    } catch {
      setError('No se pudo registrar la devolución. Verifica la conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedLoan(null);
    setObservacion('');
    setError(null);
  };

  return {
    selectedLoan,
    observacion,
    loading,
    error,
    handleSelectLoan,
    handleObservacionChange,
    handleSubmit,
    reset,
  };
};
