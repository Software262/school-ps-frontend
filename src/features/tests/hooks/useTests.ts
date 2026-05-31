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
    setLoading(true);
    setError(null);
    try {
      const [assign, tests, gradoList, periodoList, studentList] =
        await Promise.all([
          testsEntityApi.getAssignments(),
          testsEntityApi.getAvailableTests(),
          testsEntityApi.getGrados(),
          testsEntityApi.getPeriodos(),
          testsEntityApi.getEstudiantes(),
        ]);
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
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const assignIndividual = async (request: CreatePruebaRequest) => {
    const result = await testsFeatureApi.assignIndividual(request);
    if (result.success) await loadAll();
    return result;
  };

  const assignMassive = async (request: MassiveAssignRequest) => {
    const result = await testsFeatureApi.assignMassive(request);
    if (result.assigned > 0) await loadAll();
    return result;
  };

  const registerPayment = async (testId: number, monto: number) => {
    await testsFeatureApi.registerPayment(testId, monto);
    await loadAll();
  };

  const deleteAssignment = async (id: number) => {
    await testsEntityApi.deleteAssignment(id);
    await loadAll();
  };

  const deleteComplementary = async (id: number) => {
    await testsEntityApi.deleteComplementary(id);
    await loadAll();
  };

  const updateComplementary = async (
    id: number,
    nombre: string,
    valor: number,
  ) => {
    await testsEntityApi.updateComplementary(id, nombre, valor);
    await loadAll();
  };

  const createComplementary = async (nombre: string, valor: number) => {
    await testsEntityApi.createComplementary(nombre, valor);
    await loadAll();
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
    loadAll,
    assignIndividual,
    assignMassive,
    registerPayment,
    deleteAssignment,
    deleteComplementary,
    updateComplementary,
    createComplementary,
  };
}
