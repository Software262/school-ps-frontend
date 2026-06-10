import { FileText, User, Users, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type {
  ComplementarioPrueba,
  Grado,
  Periodo,
  EstudianteListItem,
  CreatePruebaRequest,
  MassiveAssignRequest,
} from '@/entities/tests/model/types';

interface CreateTestFormProps {
  onCancel: () => void;
  onSave: () => void;
  availableTests: ComplementarioPrueba[];
  grados: Grado[];
  periodos: Periodo[];
  estudiantes: EstudianteListItem[];
  onAssignIndividual: (req: CreatePruebaRequest) => Promise<{ success: boolean; message: string }>;
  onAssignMassive: (req: MassiveAssignRequest) => Promise<{
    success: boolean;
    assigned: number;
    skipped: number;
    message: string;
  }>;
}

export function CreateTestForm({
  onCancel,
  onSave,
  availableTests,
  grados,
  periodos,
  estudiantes,
  onAssignIndividual,
  onAssignMassive,
}: CreateTestFormProps) {
  const [mode, setMode] = useState<'massive' | 'individual'>('massive');
  const [gradoId, setGradoId] = useState(grados[0]?.id.toString() ?? '');
  const [indGradoId, setIndGradoId] = useState('');
  const [testId, setTestId] = useState('');
  const [periodoId, setPeriodoId] = useState(periodos[0]?.id.toString() ?? '');
  const [studentId, setStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredStudents = estudiantes.filter((s) => {
    const search = studentSearch.toLowerCase();
    const gradoMatch = !indGradoId || s.grado_id.toString() === indGradoId;
    const textMatch =
      !search ||
      s.nombre.toLowerCase().includes(search) ||
      s.documento.toLowerCase().includes(search);
    return gradoMatch && textMatch;
  });

  const selectedGrado = grados.find((g) => g.id.toString() === gradoId);
  const selectedTest = availableTests.find((t) => t.id.toString() === testId);
  const selectedPeriodo = periodos.find((p) => p.id.toString() === periodoId);
  const studentsInGrado = estudiantes.filter((s) => s.grado_id.toString() === gradoId);

  const handleSubmitMassive = async () => {
    setShowConfirm(false);
    setLoading(true);
    setErrorMsg('');
    const result = await onAssignMassive({
      grado_id: parseInt(gradoId),
      complementario_id: parseInt(testId),
      tipo_prueba: selectedTest?.nombre ?? 'Institucional',
      periodo_id: parseInt(periodoId),
    });
    if (result.assigned === 0 && result.skipped > 0) {
      setErrorMsg(
        `Todos los estudiantes (${result.skipped.toString()}) ya tienen esta prueba asignada.`,
      );
    } else {
      if (result.skipped > 0)
        setErrorMsg(
          `Se asignaron ${result.assigned.toString()}. ${result.skipped.toString()} ya la tenían y fueron omitidos.`,
        );
      onSave();
    }
  };

  const handleSubmitIndividual = async () => {
    if (!testId || !studentId) {
      setErrorMsg('Selecciona una prueba y un estudiante.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await onAssignIndividual({
        estudiante_id: parseInt(studentId),
        complementario_id: parseInt(testId),
        tipo_prueba: selectedTest?.nombre ?? 'Institucional',
        estado: 'pendiente',
        valor_pagado: 0,
        periodo_id: parseInt(periodoId),
      });
      if (result.success) {
        onSave();
      } else {
        setErrorMsg(result.message);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Error inesperado al asignar la prueba.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudentName = filteredStudents.find((s) => s.id.toString() === studentId)?.nombre;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
          Asignar Prueba a Estudiantes
        </h3>

        <div className="flex gap-2 mb-5">
          <Button
            size="sm"
            variant={mode === 'massive' ? 'primary' : 'secondary'}
            onClick={() => {
              setMode('massive');
              setErrorMsg('');
            }}
          >
            <Users className="w-4 h-4" /> Masiva (por grado)
          </Button>
          <Button
            size="sm"
            variant={mode === 'individual' ? 'primary' : 'secondary'}
            onClick={() => {
              setMode('individual');
              setErrorMsg('');
            }}
          >
            <User className="w-4 h-4" /> Individual
          </Button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mode === 'massive' ? (
            <div className="input-container">
              <label className="input-label">Seleccionar Grado Objetivo</label>
              <select
                value={gradoId}
                onChange={(e) => {
                  setGradoId(e.target.value);
                }}
                className="input-field"
              >
                {grados.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="input-container">
                <label className="input-label">Filtrar por grado</label>
                <select
                  value={indGradoId}
                  onChange={(e) => {
                    setIndGradoId(e.target.value);
                    setStudentId('');
                  }}
                  className="input-field"
                >
                  <option value="">Todos los grados</option>
                  {grados.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <Input
                  label="Estudiante"
                  type="text"
                  placeholder="Buscar por nombre o documento..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                  }}
                />
                {selectedStudentName && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--brand-primary)',
                      fontWeight: 600,
                      margin: '4px 0 6px',
                    }}
                  >
                    ✓ {selectedStudentName}
                  </p>
                )}
                <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-48 divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = studentId === s.id.toString();
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setStudentId(s.id.toString());
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors text-sm ${
                            isSelected
                              ? 'bg-red-50 text-[var(--brand-primary)] font-semibold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>
                            <span className="font-mono text-xs text-gray-400 mr-2">
                              {s.documento}
                            </span>
                            {s.nombre}
                          </span>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-[var(--brand-primary)] shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          <div className="input-container">
            <label className="input-label">Seleccionar Prueba</label>
            <select
              value={testId}
              onChange={(e) => {
                setTestId(e.target.value);
              }}
              className="input-field"
            >
              <option value="">Seleccione una prueba...</option>
              {availableTests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} - ${t.valor.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label className="input-label">Periodo Académico</label>
            <select
              value={periodoId}
              onChange={(e) => {
                setPeriodoId(e.target.value);
              }}
              className="input-field"
            >
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={loading}
            onClick={
              mode === 'massive'
                ? () => {
                    if (!testId || !gradoId) {
                      setErrorMsg('Selecciona una prueba y un grado.');
                      return;
                    }
                    setShowConfirm(true);
                  }
                : () => {
                    void handleSubmitIndividual();
                  }
            }
          >
            {loading ? (
              <>
                <Spinner size={14} color="white" /> Asignando...
              </>
            ) : mode === 'massive' ? (
              'Asignar a todo el grado'
            ) : (
              'Asignar al estudiante'
            )}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
        }}
        title="Confirmar asignación masiva"
        width={480}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-gray-600">
              Se asignará a todos los activos que <strong>aún no la tengan</strong>.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-1.5 text-sm">
            {[
              ['Grado', selectedGrado?.nombre],
              ['Tipo de Prueba', selectedTest?.nombre],
              ['Valor', `$${selectedTest?.valor.toLocaleString() ?? '0'}`],
              ['Período', selectedPeriodo?.nombre ?? 'Sin período'],
              ['Estudiantes en el grado', studentsInGrado.length],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between">
                <span className="text-gray-500">{label}:</span>
                <span className="font-medium text-gray-900">{val ?? '—'}</span>
              </div>
            ))}
          </div>
          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirm(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                void handleSubmitMassive();
              }}
            >
              Sí, asignar a todos
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
