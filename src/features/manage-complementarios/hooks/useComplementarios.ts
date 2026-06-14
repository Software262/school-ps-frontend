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

  const fetchComplementarios = useCallback(
    () =>
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
        }),
    [],
  );

  useEffect(() => {
    void fetchComplementarios();
  }, [fetchComplementarios]);

  async function create(payload: CreateComplementarioRequest) {
    await createComplementario(payload);
    await fetchComplementarios();
  }

  async function update(id: number, payload: UpdateComplementarioRequest) {
    await updateComplementario(id, payload);
    await fetchComplementarios();
  }

  async function remove(id: number) {
    await deleteComplementario(id);
    await fetchComplementarios();
  }

  return {
    complementarios,
    loading,
    error,
    refetch: fetchComplementarios,
    create,
    update,
    remove,
  };
};
