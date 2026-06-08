import { useState } from 'react';
import { clearCafeteriaDebts } from '../api/clear-debts';

export const useClearDebts = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const clear = async (registroIds: number[], usuarioId: number): Promise<void> => {
    setLoading(true);
    try {
      await clearCafeteriaDebts({ registro_ids: registroIds, usuario_id: usuarioId });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return { clear, loading };
};
