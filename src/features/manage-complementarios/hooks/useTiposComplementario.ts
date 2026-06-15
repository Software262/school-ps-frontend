import { useCallback, useEffect, useState } from 'react';
import {
  createTipoComplementario,
  deleteTipoComplementario,
  getTiposComplementario,
  updateTipoComplementario,
} from '../api/complementariosApi';
import type {
  CreateTipoComplementarioRequest,
  TipoComplementario,
  UpdateTipoComplementarioRequest,
} from '../model/types';

export const useTiposComplementario = () => {
  const [tipos, setTipos] = useState<TipoComplementario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    getTiposComplementario()
      .then((data) => {
        setTipos(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar los tipos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refetchKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchKey((k) => k + 1);
  }, []);

  async function create(payload: CreateTipoComplementarioRequest) {
    await createTipoComplementario(payload);
    refetch();
  }

  async function update(id: number, payload: UpdateTipoComplementarioRequest) {
    await updateTipoComplementario(id, payload);
    refetch();
  }

  async function remove(id: number) {
    await deleteTipoComplementario(id);
    refetch();
  }

  return { tipos, loading, error, refetch, create, update, remove };
};
