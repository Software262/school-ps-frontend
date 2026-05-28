/**
 * features/tests/api/testsApi.ts
 * Feature-level API: business operations (assign, pay).
 * Consumes entity-level api for data, adds business rules.
 */
import { fetchApi } from "../../../shared/api/apiClient";
import type { CreatePruebaRequest, MassiveAssignRequest } from "../../../entities/tests/model/types";

export const testsFeatureApi = {
  /** Assign a test to a single student. Returns error message if duplicate. */
  assignIndividual: async (request: CreatePruebaRequest): Promise<{ success: boolean; message: string }> => {
    const res = await fetchApi<{ details?: { duplicate?: boolean }, status_code?: number, data?: { id?: number }, message?: string }>("/tests/assign-individual", {
      method: "POST",
      body: JSON.stringify(request),
    });
    
    if (res.details?.duplicate || res.status_code === 409) {
      return { success: false, message: "Este estudiante ya tiene esta prueba asignada." };
    }
    if (res.data?.id || res.status_code === 201) {
      return { success: true, message: "Prueba asignada exitosamente." };
    }
    return { success: false, message: res.message ?? "Error al asignar." };
  },

  /** Assign a test to all active students in a grade, skipping duplicates. */
  assignMassive: async (request: MassiveAssignRequest): Promise<{ success: boolean; assigned: number; skipped: number; message: string }> => {
    const res = await fetchApi<{ data?: unknown[], details?: { skipped?: number }, message?: string }>("/tests/assign-massive", {
      method: "POST",
      body: JSON.stringify(request),
    });
    
    const assigned = res.data?.length ?? 0;
    const skipped = res.details?.skipped ?? 0;
    return {
      success: assigned > 0,
      assigned,
      skipped,
      message: res.message ?? `Se asignaron ${assigned.toString()} prueba(s).`,
    };
  },

  /** Register a payment (full or partial) for an assignment. */
  registerPayment: async (testId: number, monto: number): Promise<void> => {
    await fetchApi(`/tests/${testId.toString()}/pay`, {
      method: "POST",
      body: JSON.stringify({ monto }),
    });
  },
};




