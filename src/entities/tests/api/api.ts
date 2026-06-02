/**
 * entities/tests/api/api.ts
 * Low-level data access for the tests entity.
 * Only pure CRUD — no business logic here.
 */
import { fetchApi } from '@/shared/api/apiClient';
import type {
  PruebaAssignment,
  ComplementarioPrueba,
  Grado,
  Periodo,
  EstudianteListItem,
} from '../model/types';

export const testsEntityApi = {
  /** Get paginated assignment list */
  getAssignments: async (): Promise<PruebaAssignment[]> => {
    const res = await fetchApi<{ data?: { items?: unknown[] } | unknown[] }>(
      '/tests/details?page=1&limit=100',
    );
    const rawData = res.data ?? [];
    const items = Array.isArray(rawData) ? rawData : (rawData.items ?? []);

    return items.map((itemObj: unknown): PruebaAssignment => {
      const item = itemObj as Record<string, unknown>;
      const estudiante = item.estudiante as Record<string, unknown>;
      const complementario = item.complementario as Record<string, unknown>;
      const periodo = item.periodo as Record<string, unknown> | undefined;
      const valorPagado = (item.valor_pagado as number | undefined) ?? 0;
      const valor = (complementario.valor as number | undefined) ?? 0;

      return {
        ...(item as unknown as PruebaAssignment),
        estadoStr: item.estado as string,
        documento: estudiante.documento as string,
        estudianteNombre: estudiante.nombre as string,
        pruebaNombre: complementario.tipo_complementario as string,
        valor,
        valorStr: `$${valor.toLocaleString()}`,
        valorPagadoStr: `$${valorPagado.toLocaleString()}`,
        saldoStr: `$${(valor - valorPagado).toLocaleString()}`,
        periodoNombre: typeof periodo?.nombre === 'string' ? periodo.nombre : '—',
      };
    });
  },

  /** Get available tests (complementarios for pruebas) */
  getAvailableTests: async (): Promise<ComplementarioPrueba[]> => {
    const res = await fetchApi<{ data?: ComplementarioPrueba[] }>('/tests/available-tests');
    return res.data ?? [];
  },

  /** Get grades list */
  getGrados: async (): Promise<Grado[]> => {
    const res = await fetchApi<{ data?: Grado[] }>('/tests/grados');
    return res.data ?? [];
  },

  /** Get active periods */
  getPeriodos: async (): Promise<Periodo[]> => {
    const res = await fetchApi<{ data?: Periodo[] }>('/tests/periodos');
    return res.data ?? [];
  },

  /** Get all active students */
  getEstudiantes: async (): Promise<EstudianteListItem[]> => {
    const res = await fetchApi<{ data?: EstudianteListItem[] }>('/tests/estudiantes');
    return res.data ?? [];
  },

  /** Delete a single assignment */
  deleteAssignment: async (id: number): Promise<void> => {
    await fetchApi(`/tests/details/${id.toString()}`, { method: 'DELETE' });
  },

  /** Delete a complementario (test type) and its assignments */
  deleteComplementary: async (id: number): Promise<void> => {
    await fetchApi(`/tests/complementary/${id.toString()}`, {
      method: 'DELETE',
    });
  },

  /** Update a complementario */
  updateComplementary: async (id: number, nombre: string, valor: number): Promise<void> => {
    await fetchApi(`/tests/complementary/${id.toString()}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre, valor }),
    });
  },

  /** Create a new complementario (test type) */
  createComplementary: async (nombre: string, valor: number): Promise<void> => {
    await fetchApi('/enrollment/complementary', {
      method: 'POST',
      body: JSON.stringify({
        tipo_complementario: nombre,
        anio: new Date().getFullYear(),
        valor,
        estado_complemento: 'Activo',
        uso_matricula: false,
      }),
    });
  },
};
