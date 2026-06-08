import { useState } from 'react';
import { withdrawStudent } from '../api/withdraw-student';
import { RESPONSABLE_USUARIO_ID } from '@/features/escuelas-formacion/model/constants';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';

export const MOTIVOS = [
  'Retiro voluntario',
  'Cambio de institución',
  'Motivos económicos',
  'Bajo rendimiento o desempeño',
  'Motivos de salud',
  'Finalización del programa',
  'Otro',
];

export const useWithdrawStudent = (
  enrollment: Enrollment | null,
  onSuccess: () => void,
  onClose: () => void,
) => {
  const [motivoReason, setMotivoReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoy] = useState(() =>
    new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
  );

  const isOtro = motivoReason === 'Otro';
  const baseReason = isOtro ? customReason.trim() : motivoReason;
  const finalMotivo = observaciones.trim() ? `${baseReason} — ${observaciones.trim()}` : baseReason;
  const canSubmit = baseReason.length >= 5 && finalMotivo.length >= 5;

  function reset() {
    setMotivoReason('');
    setCustomReason('');
    setObservaciones('');
    setError(null);
  }

  async function handleSubmit() {
    if (!enrollment || !canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await withdrawStudent({
        enrollment_id: enrollment.id,
        motivo: finalMotivo,
        usuario_id: RESPONSABLE_USUARIO_ID,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el retiro');
    } finally {
      setLoading(false);
    }
  }

  return {
    motivoReason,
    setMotivoReason,
    customReason,
    setCustomReason,
    observaciones,
    setObservaciones,
    loading,
    error,
    isOtro,
    canSubmit,
    hoy,
    handleSubmit,
    reset,
  };
};
