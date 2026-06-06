import { useState, type SubmitEvent, type ChangeEvent } from 'react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { manualEnrollment } from '../api/manualApi';
import { searchStudents } from '../../search-student/api/searchApi';
import type { ManualEnrollmentPayload } from '../types';

interface ManualEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: number) => void;
}

const GRADES = [
  'Preescolar',
  'Primero',
  'Segundo',
  'Tercero',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
  'Octavo',
  'Noveno',
  'Décimo',
  'Once',
];

export const ManualEnrollmentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ManualEnrollmentModalProps) => {
  const [formData, setFormData] = useState<ManualEnrollmentPayload>(() => ({
    documento: '',
    nombre: '',
    grado: GRADES[0],
    nombre_acudiente: '',
    periodo_id: 1,
    anio: new Date().getFullYear(),
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border)',
              backgroundColor: '#fff',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-container">
            <label className="input-label">Periodo Académico *</label>
            <select
              value={formData.periodo_id}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFormData((s: ManualEnrollmentPayload) => ({
                  ...s,
                  periodo_id: Number(e.target.value),
                }));
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--border)',
                backgroundColor: '#fff',
                fontSize: '1rem',
                color: 'var(--text-main)',
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
            >
              {[1, 2, 3, 4].map((p) => (
                <option key={p} value={p}>
                  Periodo {p}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Año Lectivo *"
            type="number"
            required
            value={formData.anio}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormData((s: ManualEnrollmentPayload) => ({ ...s, anio: Number(e.target.value) }));
            }}
            disabled={loading}
          />
        </div>

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
