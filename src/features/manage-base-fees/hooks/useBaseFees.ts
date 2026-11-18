import { useState, useEffect, useCallback } from 'react';
import { enrollmentApi, type BaseFeesListResponse } from '@/entities/student/api/enrollment';

export interface FeeEditRow {
  grado_id: number;
  matricula_valor: number;
  pension_valor: number;
  isModified: boolean;
}

export function useBaseFees(initialYear?: number) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear ?? new Date().getFullYear());
  const [data, setData] = useState<BaseFeesListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localRows, setLocalRows] = useState<Record<number, FeeEditRow>>({});

  useEffect(() => {
    let isMounted = true;
    enrollmentApi
      .getBaseFees(selectedYear)
      .then((res) => {
        if (!isMounted) return;
        setData(res);
        const rows: Record<number, FeeEditRow> = {};
        for (const item of res.tarifas) {
          rows[item.grado_id] = {
            grado_id: item.grado_id,
            matricula_valor: item.matricula_valor ?? 0,
            pension_valor: item.pension_valor ?? 0,
            isModified: false,
          };
        }
        setLocalRows(rows);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al cargar los costos base');
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  const loadFees = useCallback(async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await enrollmentApi.getBaseFees(year);
      setData(res);
      const rows: Record<number, FeeEditRow> = {};
      for (const item of res.tarifas) {
        rows[item.grado_id] = {
          grado_id: item.grado_id,
          matricula_valor: item.matricula_valor ?? 0,
          pension_valor: item.pension_valor ?? 0,
          isModified: false,
        };
      }
      setLocalRows(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los costos base');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRowValue = useCallback(
    (gradoId: number, field: 'matricula_valor' | 'pension_valor', value: number) => {
      setLocalRows((prev) => {
        const current = prev[gradoId] as FeeEditRow | undefined;
        if (!current) return prev;
        return {
          ...prev,
          [gradoId]: {
            ...current,
            [field]: Math.max(0, value),
            isModified: true,
          },
        };
      });
    },
    [],
  );

  const modifiedCount = Object.values(localRows).filter((r) => r.isModified).length;

  const saveAll = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const payloadTarifas = Object.values(localRows).map((r) => ({
        grado_id: r.grado_id,
        matricula_valor: r.matricula_valor,
        pension_valor: r.pension_valor,
      }));
      const res = await enrollmentApi.upsertBaseFees({
        anio: selectedYear,
        tarifas: payloadTarifas,
      });
      setData(res);
      const updatedRows: Record<number, FeeEditRow> = {};
      for (const item of res.tarifas) {
        updatedRows[item.grado_id] = {
          grado_id: item.grado_id,
          matricula_valor: item.matricula_valor ?? 0,
          pension_valor: item.pension_valor ?? 0,
          isModified: false,
        };
      }
      setLocalRows(updatedRows);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los costos';
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [localRows, selectedYear]);

  const saveSingle = useCallback(
    async (gradoId: number) => {
      const row = localRows[gradoId] as FeeEditRow | undefined;
      if (!row) return;
      setSaving(true);
      setError(null);
      try {
        const updated = await enrollmentApi.updateSingleGradeFee(gradoId, {
          anio: selectedYear,
          matricula_valor: row.matricula_valor,
          pension_valor: row.pension_valor,
        });
        setLocalRows((prev) => ({
          ...prev,
          [gradoId]: {
            ...(prev[gradoId] as FeeEditRow),
            isModified: false,
          },
        }));
        setData((prev) => {
          if (prev === null) return null;
          const newTarifas = prev.tarifas.map((t) => (t.grado_id === gradoId ? updated : t));
          const totalConfig = newTarifas.filter((t) => t.configurado).length;
          return {
            ...prev,
            total_configurados: totalConfig,
            tarifas: newTarifas,
          };
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al guardar el grado';
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [localRows, selectedYear],
  );

  const initializeDefaults = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await enrollmentApi.initializeDefaultBaseFees(selectedYear);
      setData(res);
      const rows: Record<number, FeeEditRow> = {};
      for (const item of res.tarifas) {
        rows[item.grado_id] = {
          grado_id: item.grado_id,
          matricula_valor: item.matricula_valor ?? 0,
          pension_valor: item.pension_valor ?? 0,
          isModified: false,
        };
      }
      setLocalRows(rows);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar los valores sugeridos';
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [selectedYear]);

  const copyFromYear = useCallback(
    async (sourceYear: number, targetYear: number, incrementPct = 0) => {
      setSaving(true);
      setError(null);
      try {
        const res = await enrollmentApi.copyBaseFees({
          anio_origen: sourceYear,
          anio_destino: targetYear,
          incremento_porcentaje: incrementPct,
        });
        setSelectedYear(targetYear);
        setData(res);
        const rows: Record<number, FeeEditRow> = {};
        for (const item of res.tarifas) {
          rows[item.grado_id] = {
            grado_id: item.grado_id,
            matricula_valor: item.matricula_valor ?? 0,
            pension_valor: item.pension_valor ?? 0,
            isModified: false,
          };
        }
        setLocalRows(rows);
        return res;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al copiar los costos';
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const applyMassivePercentage = useCallback((pct: number) => {
    const factor = 1 + pct / 100;
    setLocalRows((prev) => {
      const updated: Record<number, FeeEditRow> = {};
      for (const [idStr, row] of Object.entries(prev)) {
        const gId = Number(idStr);
        const newMat = Math.round((row.matricula_valor * factor) / 1000) * 1000;
        const newPen = Math.round((row.pension_valor * factor) / 1000) * 1000;
        updated[gId] = {
          ...row,
          matricula_valor: Math.max(0, newMat),
          pension_valor: Math.max(0, newPen),
          isModified: true,
        };
      }
      return updated;
    });
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    data,
    loading,
    saving,
    error,
    localRows,
    modifiedCount,
    loadFees,
    updateRowValue,
    saveAll,
    saveSingle,
    initializeDefaults,
    copyFromYear,
    applyMassivePercentage,
  };
}
