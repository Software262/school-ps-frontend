import { useEffect, useState, useCallback, type SubmitEvent } from 'react';
import { Plus, Minus, Loader, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { useAssignConcept } from '../hooks/useAssignConcept';
import type { ComplementaryConcept } from '../types';

interface AssignComplementaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  matriculaId: number;
  year: number;
  onSuccess: () => Promise<void>;
}

export const AssignComplementaryModal = ({
  isOpen,
  onClose,
  matriculaId,
  year,
  onSuccess,
}: AssignComplementaryModalProps) => {
  const [concepts, setConcepts] = useState<ComplementaryConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchConcepts, createConcept, assignConcept } = useAssignConcept();

  // Inline creation state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptValue, setNewConceptValue] = useState('');
  const [newConceptUsoMatricula, setNewConceptUsoMatricula] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const loadConcepts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchConcepts(year);
      setConcepts(data);
      if (data.length > 0) {
        setSelectedConceptId(data[0].id.toString());
      }
    } catch (err: unknown) {
      console.error(err);
      setError('No se pudieron cargar los conceptos complementarios.');
    } finally {
      setLoading(false);
    }
  }, [year, fetchConcepts]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        void loadConcepts();
        setShowCreateForm(false);
        setDescuento(0);
        setNewConceptName('');
        setNewConceptValue('');
        setNewConceptUsoMatricula(false);
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, loadConcepts]);

  const handleCreateConcept = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!newConceptName.trim() || !newConceptValue) return;

    try {
      setCreateLoading(true);
      setError(null);
      const parsedValue = parseInt(newConceptValue, 10);
      if (isNaN(parsedValue) || parsedValue < 0) {
        throw new Error('El valor del concepto debe ser un número entero mayor o igual a 0.');
      }
      const res = await createConcept({
        tipo_complementario: newConceptName.trim(),
        anio: year,
        valor: parsedValue,
        estado_complemento: 'Activo',
        uso_matricula: newConceptUsoMatricula,
      });

      const newConcept: ComplementaryConcept = {
        id: res.complementario_id,
        tipo_complementario: newConceptName.trim(),
        anio: year,
        valor: parsedValue,
        estado_complemento: 'Activo',
        uso_matricula: newConceptUsoMatricula,
      };

      setConcepts((prev) => [...prev, newConcept]);
      setSelectedConceptId(res.complementario_id.toString());
      setShowCreateForm(false);
      setNewConceptName('');
      setNewConceptValue('');
      setNewConceptUsoMatricula(false);
      alert('Concepto complementario creado exitosamente en el catálogo');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al crear el concepto complementario.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAssign = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!selectedConceptId) return;

    try {
      setLoading(true);
      setError(null);

      const targetConcept = concepts.find((c) => c.id.toString() === selectedConceptId);
      if (targetConcept && descuento > targetConcept.valor) {
        throw new Error(
          `El descuento ($${descuento.toString()}) no puede superar el valor del concepto ($${targetConcept.valor.toString()}).`,
        );
      }

      await assignConcept(matriculaId, {
        complementario_id: Number(selectedConceptId),
        descuento: descuento,
      });

      alert('Concepto asignado exitosamente');
      onClose();
      await onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al asignar el concepto complementario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        showCreateForm ? 'Crear Nuevo Concepto Complementario' : 'Asignar Concepto Complementario'
      }
      width={480}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--status-red-bg)',
              color: 'var(--status-red)',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <Loader className="animate-spin" size={24} color="var(--brand-primary)" />
          </div>
        )}

        {!loading && !showCreateForm && (
          <form
            onSubmit={(e) => {
              void handleAssign(e);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div className="input-container">
              <label className="input-label">Seleccione Concepto *</label>
              {concepts.length === 0 ? (
                <p
                  style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}
                >
                  No hay conceptos complementarios registrados para el año {year}.
                </p>
              ) : (
                <select
                  value={selectedConceptId}
                  onChange={(e) => {
                    setSelectedConceptId(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border)',
                    backgroundColor: '#fff',
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {concepts.map((c) => (
                    <option key={c.id.toString()} value={c.id.toString()}>
                      {c.tipo_complementario} (${c.valor.toLocaleString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Input
              label="Descuento a Aplicar ($)"
              type="number"
              min={0}
              value={descuento}
              onChange={(e) => {
                setDescuento(Number(e.target.value));
              }}
              disabled={concepts.length === 0}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Plus size={16} />
                ¿El concepto no está en la lista? Crear Nuevo Concepto
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={concepts.length === 0}>
                Asignar Concepto
              </Button>
            </div>
          </form>
        )}

        {!loading && showCreateForm && (
          <form
            onSubmit={(e) => {
              void handleCreateConcept(e);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Input
              label="Nombre del Concepto *"
              placeholder="Ej: Banda Marcial"
              required
              value={newConceptName}
              onChange={(e) => {
                setNewConceptName(e.target.value);
              }}
              disabled={createLoading}
            />

            <Input
              label="Valor Completo ($) *"
              type="number"
              min={0}
              placeholder="Ej: 120000"
              required
              value={newConceptValue}
              onChange={(e) => {
                setNewConceptValue(e.target.value);
              }}
              disabled={createLoading}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
              <input
                id="usoMatriculaCheck"
                type="checkbox"
                checked={newConceptUsoMatricula}
                onChange={(e) => {
                  setNewConceptUsoMatricula(e.target.checked);
                }}
                disabled={createLoading}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: 'var(--brand-primary)',
                }}
              />
              <label
                htmlFor="usoMatriculaCheck"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                Cobrar automáticamente en matrículas nuevas (uso_matricula)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Minus size={16} />
                Volver a la selección de catálogo
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                }}
                disabled={createLoading}
              >
                Volver
              </Button>
              <Button type="submit" variant="primary" disabled={createLoading}>
                {createLoading ? 'Creando...' : 'Crear Concepto'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
