/**
 * features/tests/hooks/useTests.ts
 * Central state hook for the tests module.
 * Components use this hook — they never call fetchApi directly.
 */
import { useState, useEffect, useCallback } from "react";
import { testsEntityApi } from "@/entities/tests/api/api";
import { testsFeatureApi } from "@/features/tests/api/testsApi";
import type {
  PruebaAssignment,
  ComplementarioPrueba,
  Grado,
  Periodo,
  EstudianteListItem,
  CreatePruebaRequest,
  MassiveAssignRequest,
} from "@/entities/tests/model/types";

export function useTests() {
  const [assignments, setAssignments] = useState<PruebaAssignment[]>([]);
  const [availableTests, setAvailableTests] = useState<ComplementarioPrueba[]>(
    [],
  );
  const [grados, setGrados] = useState<Grado[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    const [assign, tests, gradoList, periodoList, studentList] =
      await Promise.all([
        testsEntityApi.getAssignments(),
        testsEntityApi.getAvailableTests(),
        testsEntityApi.getGrados(),
        testsEntityApi.getPeriodos(),
        testsEntityApi.getEstudiantes(),
      ]);

    return { assign, tests, gradoList, periodoList, studentList };
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { assign, tests, gradoList, periodoList, studentList } =
        await loadAll();
      setAssignments(assign);
      setAvailableTests(tests);
      setGrados(gradoList);
      setPeriodos(periodoList);
      setEstudiantes(studentList);
    } catch (e) {
      setError("Error al cargar los datos del módulo de pruebas.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loadAll]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void refreshAll();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [refreshAll]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const assignIndividual = async (request: CreatePruebaRequest) => {
    const result = await testsFeatureApi.assignIndividual(request);
    if (result.success) await refreshAll();
    return result;
  };

  const assignMassive = async (request: MassiveAssignRequest) => {
    const result = await testsFeatureApi.assignMassive(request);
    if (result.assigned > 0) await refreshAll();
    return result;
  };

  const registerPayment = async (testId: number, monto: number) => {
    await testsFeatureApi.registerPayment(testId, monto);
    await refreshAll();
  };

  const deleteAssignment = async (id: number) => {
    await testsEntityApi.deleteAssignment(id);
    await refreshAll();
  };

  const deleteComplementary = async (id: number) => {
    await testsEntityApi.deleteComplementary(id);
    await refreshAll();
  };

  const updateComplementary = async (
    id: number,
    nombre: string,
    valor: number,
  ) => {
    await testsEntityApi.updateComplementary(id, nombre, valor);
    await refreshAll();
  };

  const createComplementary = async (nombre: string, valor: number) => {
    await testsEntityApi.createComplementary(nombre, valor);
    await refreshAll();
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const pendientes = assignments.filter(
    (a) => a.estado === "pendiente" || a.estado === "pago-parcial",
  ).length;
  const pagadas = assignments.filter((a) => a.estado === "pagada").length;
  const totalRecaudo = assignments.reduce((acc, a) => acc + a.valor_pagado, 0);
  const totalPendiente = assignments.reduce(
    (acc, a) => acc + Math.max(0, (a.valor ?? 0) - a.valor_pagado),
    0,
  );
  const moduloBloqueado = pendientes > 0;

  return {
    // state
    assignments,
    availableTests,
    grados,
    periodos,
    estudiantes,
    loading,
    error,
    // derived
    pendientes,
    pagadas,
    totalRecaudo,
    totalPendiente,
    moduloBloqueado,
    // actions
    loadAll: refreshAll,
    assignIndividual,
    assignMassive,
    registerPayment,
    deleteAssignment,
    deleteComplementary,
    updateComplementary,
    createComplementary,
  };
}
