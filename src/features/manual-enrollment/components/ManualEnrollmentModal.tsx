import { useState, useEffect, type SubmitEvent, type ChangeEvent } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { manualEnrollment } from '../api/manualApi';
import { searchStudents } from '../../search-student/api/searchApi';
import type { ManualEnrollmentPayload } from '../types';
import { enrollmentApi } from '@/entities/student/api/enrollment';

interface ManualEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: number) => void;
}

export const ManualEnrollmentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ManualEnrollmentModalProps) => {
  const [grades, setGrades] = useState<{ id: number; nombre: string }[]>([]);
  const [periods, setPeriods] = useState<
    { id: number; periodo_electivo: string; estado: boolean }[]
  >([]);
  const [formData, setFormData] = useState<ManualEnrollmentPayload>(() => ({
    documento: '',
    nombre: '',
    grado: '',
    nombre_acudiente: '',
    periodo_id: 0,
    anio: new Date().getFullYear(),
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    Promise.all([enrollmentApi.getGrades(), enrollmentApi.getPeriods()])
      .then(([gradesData, periodsData]) => {
        if (isMounted) {
          setGrades(gradesData);
          setPeriods(periodsData);

          if (gradesData.length > 0 && periodsData.length > 0) {
            const activePeriod = periodsData.find((p) => p.estado) ?? periodsData[0];
            setFormData((prev) => ({
              ...prev,
              grado: gradesData[0].nombre,
              periodo_id: activePeriod.id,
              anio: new Date(activePeriod.periodo_electivo).getFullYear(),
            }));
          }
        }
      })
      .catch((err: unknown) => {
        console.error('Error loading manual enrollment metadata:', err);
        if (isMounted) {
          setError('Error al cargar la información de grados y períodos lectivos.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await manualEnrollment(formData);

      // 2. Fetch the newly created student by document to get their student ID
      const searchRes = await searchStudents({
        documento: formData.documento.trim(),
        year: formData.anio,
      });

      const matchedStudent = searchRes.estudiantes.find(
        (s) => s.documento.trim() === formData.documento.trim(),
      );

      if (matchedStudent) {
        onSuccess(matchedStudent.estudiante_id);
      } else {
        if (searchRes.estudiantes.length > 0) {
          onSuccess(searchRes.estudiantes[0].estudiante_id);
        } else {
          throw new Error(
            'Estudiante matriculado, pero no se pudo encontrar en la base de datos para redirección.',
          );
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado al matricular al estudiante.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Matrícula Manual Individual" width={520}>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--status-red-bg)',
              color: 'var(--status-red)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <Input
          label="Documento de Identidad *"
          placeholder="Ej: 100293847"
          required
          value={formData.documento}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormData((s: ManualEnrollmentPayload) => ({ ...s, documento: e.target.value }));
          }}
          disabled={loading}
        />

        <Input
          label="Nombre Completo del Estudiante *"
          placeholder="Ej: Juan Sebastián Pérez López"
          required
          value={formData.nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormData((s: ManualEnrollmentPayload) => ({ ...s, nombre: e.target.value }));
          }}
          disabled={loading}
        />

        <div className="input-container">
          <label className="input-label">Grado *</label>
          <select
            value={formData.grado}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setFormData((s: ManualEnrollmentPayload) => ({ ...s, grado: e.target.value }));
            }}
            disabled={loading}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            {grades.map((g) => (
              <option key={g.id.toString()} value={g.nombre}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label className="input-label">Periodo Académico *</label>
          <select
            value={formData.periodo_id}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const pId = Number(e.target.value);
              const selectedPeriod = periods.find((p) => p.id === pId);
              setFormData((s: ManualEnrollmentPayload) => ({
                ...s,
                periodo_id: pId,
                anio: selectedPeriod
                  ? new Date(selectedPeriod.periodo_electivo).getFullYear()
                  : s.anio,
              }));
            }}
            disabled={loading}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            {periods.map((p) => {
              const yr = new Date(p.periodo_electivo).getFullYear();
              return (
                <option key={p.id.toString()} value={p.id}>
                  Año Lectivo {yr.toString()} {p.estado ? '(Activo)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <Input
          label="Nombre del Acudiente *"
          placeholder="Ej: María Clara López (Madre)"
          required
          value={formData.nombre_acudiente}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormData((s: ManualEnrollmentPayload) => ({
              ...s,
              nombre_acudiente: e.target.value,
            }));
          }}
          disabled={loading}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Matriculando...' : 'Matricular Estudiante'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
