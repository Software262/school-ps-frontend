import { useState } from 'react';
import { registerPayment } from '../api/pay-enrollment';
import { getSessionUser } from '@/shared/auth';
import type { Enrollment } from '@/features/escuelas-formacion/model/types';

export const usePayEnrollment = (
  enrollment: Enrollment | null,
  onSuccess: (enrollmentId: number) => void,
) => {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const montoNum = Number(monto);
  const saldo = enrollment?.saldo_pendiente ?? 0;
  const exceeds = montoNum > saldo;

  function reset() {
    setMonto('');
    setError(null);
  }

  async function handleSubmit() {
    if (!enrollment) return;
    const user = getSessionUser();
    if (!user) {
      setError('No hay una sesión activa. Inicie sesión nuevamente.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await registerPayment({
        enrollment_id: enrollment.id,
        monto: montoNum,
        usuario_id: user.id,
      });
      reset();
      onSuccess(enrollment.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  }

  return { monto, setMonto, loading, error, montoNum, saldo, exceeds, handleSubmit, reset };
};
