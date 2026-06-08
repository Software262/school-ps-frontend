import { useState } from 'react';
import type { ManualBlockRequest } from '@/features/cafeteria/model/types';
import { createCafeteriaDebt } from '../api/add-debt';

export const useAddDebt = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const submit = async (data: ManualBlockRequest): Promise<void> => {
    setLoading(true);
    try {
      await createCafeteriaDebt(data);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};
