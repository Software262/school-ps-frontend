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

  const fetchTipos = useCallback(
    () =>
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
        }),
    [],
  );

  useEffect(() => {
    void fetchTipos();
  }, [fetchTipos]);

  async function create(payload: CreateTipoComplementarioRequest) {
    await createTipoComplementario(payload);
    await fetchTipos();
  }

  async function update(id: number, payload: UpdateTipoComplementarioRequest) {
    await updateTipoComplementario(id, payload);
    await fetchTipos();
  }

  async function remove(id: number) {
    await deleteTipoComplementario(id);
    await fetchTipos();
  }

  return { tipos, loading, error, refetch: fetchTipos, create, update, remove };
};
