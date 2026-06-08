import { useEffect, useRef } from 'react';
import { AlertCircle, School, Search } from 'lucide-react';
import { useNewClassroomIncident } from '../hooks/useNewClassroomIncident';
import type { NewIncidentFormProps } from '../types';
import './NewIncidentForm.css';

export const NewIncidentForm = ({ onCancel, onSuccess }: NewIncidentFormProps) => {
  const {
    fields,
    errors,
    loading,
    searchTerm,
    isDropdownOpen,
    selectedStudent,
    studentResults,
    isSearchingStudents,
    studentSearchError,
    setIsDropdownOpen,
    handleChange,
    handleSearchChange,
    handleSelectStudent,
    handleSubmit,
    reset,
  } = useNewClassroomIncident(onSuccess);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDropdownOpen]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const shouldShowDropdown = isDropdownOpen && searchTerm.trim().length >= 2;
  const shouldShowSearchIcon = searchTerm.trim().length === 0;

  return (
    <div className="incident-form-card">
      <div className="incident-form-title">
        <School size={24} aria-hidden="true" />
        <h2>Registrar Incidencia</h2>
      </div>

      {selectedStudent && (
        <section className="incident-selected-student" aria-label="Estudiante seleccionado">
          <div>
            <p>Estudiante seleccionado</p>
            <h3>{selectedStudent.nombre}</h3>
          </div>
          <span>{selectedStudent.grado_nombre}</span>
        </section>
      )}

      {errors.general && <div className="incident-form-summary">{errors.general}</div>}

      <div className="incident-form-grid">
        <div ref={dropdownRef} className="student-search-field">
          <label className="incident-form-label" htmlFor="student-search">
            Buscar Estudiante
          </label>

          <div className="student-search-input-wrap">
            {shouldShowSearchIcon && (
              <Search size={16} className="student-search-icon" aria-hidden="true" />
            )}
            <input
              id="student-search"
              type="text"
              className={`incident-form-input${shouldShowSearchIcon ? ' student-search-input--with-icon' : ''}${
                errors.estudiante_id ? ' incident-form-input--error' : ''
              }`}
              placeholder="Escriba nombre o documento"
              value={searchTerm}
              onChange={(event) => {
                handleSearchChange(event.target.value);
              }}
              onFocus={() => {
                setIsDropdownOpen(searchTerm.trim().length >= 2);
              }}
              autoComplete="off"
            />
          </div>

          {shouldShowDropdown && (
            <ul className="student-search-results">
              {isSearchingStudents && (
                <li className="student-search-message">Buscando estudiantes...</li>
              )}

              {!isSearchingStudents &&
                studentResults.map((student) => (
                  <li key={student.id}>
                    <button
                      type="button"
                      className="student-search-option"
                      onClick={() => {
                        handleSelectStudent(student);
                      }}
                    >
                      <strong>{student.nombre}</strong>
                      <span>
                        {student.documento} - Curso: {student.grado_nombre}
                      </span>
                    </button>
                  </li>
                ))}

              {!isSearchingStudents && studentResults.length === 0 && (
                <li className="student-search-message">No se encontraron estudiantes</li>
              )}
            </ul>
          )}

          {studentSearchError && <p className="incident-form-error">{studentSearchError}</p>}
          {errors.estudiante_id && <p className="incident-form-error">{errors.estudiante_id}</p>}
        </div>

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
            placeholder="Se autocompleta al seleccionar"
            value={fields.curso_grupo}
          />
        </div>

        <div>
          <label className="incident-form-label" htmlFor="incident-type">
            Tipo de Incidencia
          </label>
          <select
            id="incident-type"
            className={`incident-form-input${errors.tipo_incidencia ? ' incident-form-input--error' : ''}`}
            value={fields.tipo_incidencia}
            onChange={(event) => {
              handleChange('tipo_incidencia', event.target.value);
            }}
          >
            <option value="">Seleccione tipo</option>
            <option value="danio_material">Daño</option>
            <option value="inasistencia">Inasistencia</option>
            <option value="indisciplina">Indisciplina</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipo_incidencia && (
            <p className="incident-form-error">{errors.tipo_incidencia}</p>
          )}
        </div>

        <div>
          <label className="incident-form-label" htmlFor="incident-date">
            Fecha
          </label>
          <input
            id="incident-date"
            type="date"
            className={`incident-form-input${errors.fecha ? ' incident-form-input--error' : ''}`}
            value={fields.fecha}
            onChange={(event) => {
              handleChange('fecha', event.target.value);
            }}
          />
          {errors.fecha && <p className="incident-form-error">{errors.fecha}</p>}
        </div>
      </div>

      <div className="incident-form-field">
        <label className="incident-form-label" htmlFor="incident-description">
          Descripcion
        </label>
        <textarea
          id="incident-description"
          rows={4}
          className={`incident-form-input incident-form-textarea${
            errors.descripcion ? ' incident-form-input--error' : ''
          }`}
          placeholder="Describa la incidencia"
          value={fields.descripcion}
          onChange={(event) => {
            handleChange('descripcion', event.target.value);
          }}
        />
        {errors.descripcion && <p className="incident-form-error">{errors.descripcion}</p>}
      </div>

      <div className="incident-form-actions">
        <button type="button" onClick={handleCancel} className="btn-cancel" disabled={loading}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            void handleSubmit();
          }}
          className="btn-primary"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </div>

      {Object.keys(errors).some((field) => field !== 'general') && (
        <div className="incident-form-summary" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>Revise los campos obligatorios antes de registrar.</span>
        </div>
      )}
    </div>
  );
};
