import { useCallback, useEffect, useState } from 'react';
import {
  createComplementario,
  deleteComplementario,
  getComplementarios,
  updateComplementario,
} from '../api/complementariosApi';
import type {
  Complementario,
  CreateComplementarioRequest,
  UpdateComplementarioRequest,
} from '../model/types';

export const useComplementarios = () => {
  const [complementarios, setComplementarios] = useState<Complementario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    getComplementarios()
      .then((data) => {
        setComplementarios(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar los complementarios');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  async function create(payload: CreateComplementarioRequest) {
    await createComplementario(payload);
    refetch();
  }

  async function update(id: number, payload: UpdateComplementarioRequest) {
    await updateComplementario(id, payload);
    refetch();
  }

  async function remove(id: number) {
    await deleteComplementario(id);
    refetch();
  }

  return {
    complementarios,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
};
