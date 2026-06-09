import { useState, useEffect } from 'react';
import { enrollStudent } from '../api/enroll-student';
import { RESPONSABLE_USUARIO_ID } from '@/features/escuelas-formacion/model/constants';
import type { Program, Period, Student } from '@/features/escuelas-formacion/model/types';
import type { EnrollFormState } from '../types';

const INITIAL_FORM: EnrollFormState = {
  complementarioId: '',
  periodoId: '',
  mes: '',
  observaciones: '',
  valorAcordado: '',
  numeroComprobante: '',
};

export const useEnrollStudent = (
  student: Student | null,
  programs: Program[],
  periods: Period[],
  isOpen: boolean,
  onSuccess: (enrollmentId: number) => void,
) => {
  const [form, setForm] = useState<EnrollFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProgram = programs.find((p) => p.id === Number(form.complementarioId));
  const valorNum = Number(form.valorAcordado);
  const isGratis = valorNum === 0;
  const canSubmit = !!form.complementarioId && !!form.periodoId && !!form.mes;

  function handleProgramChange(value: string) {
    const prog = programs.find((p) => p.id === Number(value));
    setForm((prev) => ({
      ...prev,
      complementarioId: value,
      valorAcordado: prog ? String(prog.valor) : '',
    }));
  }

  function handleChange(field: keyof EnrollFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // auto-select first period when the modal opens
  useEffect(() => {
    if (!isOpen || periods.length === 0 || form.periodoId) return;
    const t = setTimeout(() => {
      setForm((prev) => ({ ...prev, periodoId: String(periods[0].id) }));
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [isOpen, periods, form.periodoId]);

  function reset() {
    setForm(INITIAL_FORM);
    setError(null);
  }

  async function handleSubmit() {
    if (!student || !canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const created = await enrollStudent({
        estudiante_id: student.id,
        complementario_id: Number(form.complementarioId),
        periodo_id: Number(form.periodoId),
        mes: form.mes,
        usuario_id: RESPONSABLE_USUARIO_ID,
        observaciones: form.observaciones.trim() || undefined,
        valor_acordado: valorNum,
        numero_comprobante: form.numeroComprobante.trim() || undefined,
      });
      reset();
      onSuccess(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al inscribir el estudiante');
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    selectedProgram,
    isGratis,
    canSubmit,
    handleProgramChange,
    handleChange,
    handleSubmit,
    reset,
  };
};
