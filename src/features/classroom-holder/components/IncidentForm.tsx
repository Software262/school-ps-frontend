import { useState, useRef, useEffect } from 'react';
import { AlertCircle, School, Search } from 'lucide-react';
import type { IncidenciaCreateRequest, TipoIncidencia } from '../model/types';
import { classroomHolderApi } from '../api/classroomHolderApi'; // Importamos la API para la búsqueda
import './IncidentForm.css';

// 🌟 SIMULACIÓN DE BASE DE DATOS (Mientras el backend crea el endpoint de búsqueda)
// ESTO YA NO ES NECESARIO, USAMOS LA API REAL
// const MOCK_STUDENTS = [
//   { id: 1, nombre: 'Juan García Pérez', grado_nombre: '10-A' },
//   { id: 2, nombre: 'Ana López Martínez', grado_nombre: '11-B' },
//   { id: 3, nombre: 'Pedro García Pérez', grado_nombre: '9-A' },
// ];

interface Props {
  onSubmit: (data: IncidenciaCreateRequest) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

interface FormErrors {
  estudiante_id?: string;
  tipo_incidencia?: string;
  fecha?: string;
  descripcion?: string;
}

export const IncidentForm = ({ onSubmit, onCancel, isLoading }: Props) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    curso_grupo: '', // Este se llenará automáticamente
    tipo_incidencia: '' as TipoIncidencia | '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
  });

  // Estados para el Buscador por Nombre
  const [searchTerm, setSearchTerm] = useState(''); // Lo que el usuario escribe
  const [filteredStudents, setFilteredStudents] = useState<Array<{id: number, nombre: string, grado_nombre: string}>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState(''); // Nombre del estudiante seleccionado
  
  const [errors, setErrors] = useState<FormErrors>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lógica de búsqueda con debounce
  const handleSearch = async (text: string) => {
    setSearchTerm(text);
    if (text.length < 2) { // Solo busca si hay al menos 2 caracteres
      setFilteredStudents([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);
    try {
      // 🌟 LLAMADA REAL A TU BACKEND PARA BUSCAR POR NOMBRE
      const results = await classroomHolderApi.buscarEstudiantes(text);
      setFilteredStudents(results);
    } catch (error) {
      console.error("Error buscando estudiantes:", error);
      setFilteredStudents([]);
    }
  };

  // Cuando el profesor selecciona un estudiante de la lista
  const handleSelectStudent = (student: {id: number, nombre: string, grado_nombre: string}) => {
    setSelectedStudentName(student.nombre); // Muestra el nombre en el input
    setFormData({ 
      ...formData, 
      estudiante_id: student.id.toString(), // Guarda el ID real
      curso_grupo: student.grado_nombre || 'Sin curso' // Autocompleta el curso
    });
    setSearchTerm(student.nombre); // Para que el input muestre el nombre
    setIsDropdownOpen(false);
    clearError('estudiante_id');
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!formData.estudiante_id) nextErrors.estudiante_id = 'Debe buscar y seleccionar un estudiante.';
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
        {/* 🌟 EL NUEVO BUSCADOR INTELIGENTE POR NOMBRE */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <label className="incident-form-label">Buscar Estudiante</label>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--input-placeholder)' }} />
            <input
              type="text"
              className={`incident-form-input${errors.estudiante_id ? ' incident-form-input--error' : ''}`}
              style={{ paddingLeft: '35px' }}
              placeholder="Escriba el nombre del estudiante..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>

          {/* La lista desplegable de resultados */}
          {isDropdownOpen && searchTerm.length >= 2 && (
            <ul style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', 
              border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', marginTop: '4px', 
              boxShadow: 'var(--card-shadow)', zIndex: 10, maxHeight: '150px', overflowY: 'auto' 
            }}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <li 
                    key={student.id} 
                    onClick={() => handleSelectStudent(student)}
                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--card-border)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--status-gray-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <strong>{student.nombre}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>- Curso: {student.grado_nombre}</span>
                  </li>
                ))
              ) : (
                <li style={{ padding: '10px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>No se encontraron estudiantes</li>
              )}
            </ul>
          )}
          {errors.estudiante_id && <p className="incident-form-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.estudiante_id}</p>}
        </div>

        {/* Campo de Curso Bloqueado (se llena solo) */}
        <div>
          <label className="incident-form-label" htmlFor="student-course">
            Curso/Grupo
          </label>
          <input
            id="student-course"
            type="text"
            readOnly
            disabled
            className="incident-form-input"
            style={{ backgroundColor: 'var(--status-gray-bg)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}
            placeholder="Se autocompleta al buscar..."
            value={formData.curso_grupo}
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
            <option value="danio_material">Daño</option>
            <option value="inasistencia">Inasistencia</option>
            <option value="indisciplina">Indisciplina</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipo_incidencia && <p className="incident-form-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.tipo_incidencia}</p>}
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
          {errors.fecha && <p className="incident-form-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.fecha}</p>}
        </div>
      </div>

      <div className="incident-form-field" style={{ marginBottom: '24px' }}>
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
        {errors.descripcion && <p className="incident-form-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.descripcion}</p>}
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
        <div className="incident-form-summary" role="alert" style={{ marginTop: '16px', color: 'red', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} aria-hidden="true" />
          <span>Revise los campos obligatorios antes de registrar.</span>
        </div>
      )}
    </div>
  );
};