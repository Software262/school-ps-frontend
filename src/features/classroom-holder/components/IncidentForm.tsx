import { useState } from 'react';
import { AlertCircle, School } from 'lucide-react';
import type { IncidenciaCreateRequest, StudentInfo, TipoIncidencia } from '../model/types';
import './IncidentForm.css';

interface Props {
  onSubmit: (data: IncidenciaCreateRequest) => Promise<boolean>;
  onCancel: () => void;
  onStudentLookup: (studentId: number) => Promise<StudentInfo>;
  isLoading: boolean;
}

interface FormErrors {
  estudiante_id?: string;
  tipo_incidencia?: string;
  fecha?: string;
  descripcion?: string;
}

export const IncidentForm = ({ onSubmit, onCancel, onStudentLookup, isLoading }: Props) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    tipo_incidencia: '' as TipoIncidencia | '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
  });
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [studentStatus, setStudentStatus] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.estudiante_id.trim()) nextErrors.estudiante_id = 'El código del estudiante es obligatorio.';
    if (!formData.tipo_incidencia) nextErrors.tipo_incidencia = 'Seleccione el tipo de incidencia.';
    if (!formData.fecha) nextErrors.fecha = 'La fecha es obligatoria.';
    if (!formData.descripcion.trim()) nextErrors.descripcion = 'La descripción es obligatoria.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleStudentLookup = async () => {
    const parsedStudentId = Number(formData.estudiante_id);
    if (!parsedStudentId) {
      setStudent(null);
      setStudentStatus('');
      return;
    }

    try {
      const foundStudent = await onStudentLookup(parsedStudentId);
      setStudent(foundStudent);
      setStudentStatus('');
    } catch {
      setStudent(null);
      setStudentStatus('No se pudo consultar el estudiante en matrículas.');
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const wasCreated = await onSubmit({
      estudiante_id: Number(formData.estudiante_id),
      tipo_incidencia: formData.tipo_incidencia as TipoIncidencia,
      descripcion: formData.descripcion.trim(),
      fecha: new Date(`${formData.fecha}T00:00:00`).toISOString(),
    });

    if (wasCreated) onCancel();
  };

  return (
    <div className="incident-form-card">
      <div className="incident-form-title">
        <School size={24} aria-hidden="true" />
        <h2>Registrar Incidencia</h2>
      </div>

      <div className="incident-form-grid">
        <div>
          <label className="incident-form-label" htmlFor="student-code">
            Código Estudiante
          </label>
          <input
            id="student-code"
            type="number"
            className={`incident-form-input${errors.estudiante_id ? ' incident-form-input--error' : ''}`}
            placeholder="Ingrese código"
            value={formData.estudiante_id}
            onBlur={() => {
              void handleStudentLookup();
            }}
            onChange={(e) => {
              setFormData({ ...formData, estudiante_id: e.target.value });
              setStudent(null);
              setStudentStatus('');
              clearError('estudiante_id');
            }}
          />
          {errors.estudiante_id && <p className="incident-form-error">{errors.estudiante_id}</p>}
          {student && (
            <p className="incident-form-helper">
              {student.nombre} - {student.grado_nombre}
            </p>
          )}
          {studentStatus && <p className="incident-form-warning">{studentStatus}</p>}
        </div>

        <div>
          <label className="incident-form-label" htmlFor="student-course">
            Curso/Grupo
          </label>
          <input
            id="student-course"
            className="incident-form-input"
            value={student?.grado_nombre ?? ''}
            placeholder="Se completa desde matrículas"
            readOnly
          />
        </div>

        <div>
          <label className="incident-form-label" htmlFor="incident-type">
            Tipo de Incidencia
          </label>
          <select
            id="incident-type"
            className={`incident-form-input${errors.tipo_incidencia ? ' incident-form-input--error' : ''}`}
            value={formData.tipo_incidencia}
            onChange={(e) => {
              setFormData({ ...formData, tipo_incidencia: e.target.value as TipoIncidencia });
              clearError('tipo_incidencia');
            }}
          >
            <option value="">Seleccione tipo</option>
            <option value="danio_material">Daño Material</option>
            <option value="indisciplina">Indisciplina</option>
            <option value="inasistencia">Inasistencia</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipo_incidencia && <p className="incident-form-error">{errors.tipo_incidencia}</p>}
        </div>

        <div>
          <label className="incident-form-label" htmlFor="incident-date">
            Fecha
          </label>
          <input
            id="incident-date"
            type="date"
            className={`incident-form-input${errors.fecha ? ' incident-form-input--error' : ''}`}
            value={formData.fecha}
            onChange={(e) => {
              setFormData({ ...formData, fecha: e.target.value });
              clearError('fecha');
            }}
          />
          {errors.fecha && <p className="incident-form-error">{errors.fecha}</p>}
        </div>
      </div>

      <div className="incident-form-field">
        <label className="incident-form-label" htmlFor="incident-description">
          Descripción
        </label>
        <textarea
          id="incident-description"
          rows={4}
          className={`incident-form-input incident-form-textarea${errors.descripcion ? ' incident-form-input--error' : ''}`}
          placeholder="Describa la incidencia..."
          value={formData.descripcion}
          onChange={(e) => {
            setFormData({ ...formData, descripcion: e.target.value });
            clearError('descripcion');
          }}
        />
        {errors.descripcion && <p className="incident-form-error">{errors.descripcion}</p>}
      </div>

      <div className="incident-form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            void handleSubmit();
          }}
          className="btn-primary"
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="incident-form-summary" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>Revise los campos obligatorios antes de registrar.</span>
        </div>
      )}
    </div>
  );
};
