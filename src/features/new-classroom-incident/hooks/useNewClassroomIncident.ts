import { useEffect, useRef, useState } from 'react';
import { useSearchClassroomStudent } from '@/features/search-classroom-student';
import { createIncident } from '../api/create-incident';
import type { StudentSearchResult, TipoIncidencia } from '@/features/classroom-holder/model/types';
import type { IncidentFormErrors, IncidentFormFields } from '../types';

const INITIAL_FIELDS = (): IncidentFormFields => ({
  estudiante_id: '',
  curso_grupo: '',
  tipo_incidencia: '',
  fecha: new Date().toISOString().split('T')[0],
  descripcion: '',
});

const validate = (fields: IncidentFormFields): IncidentFormErrors => {
  const nextErrors: IncidentFormErrors = {};
  if (!fields.estudiante_id) nextErrors.estudiante_id = 'Debe buscar y seleccionar un estudiante.';
  if (!fields.tipo_incidencia) nextErrors.tipo_incidencia = 'Seleccione el tipo de incidencia.';
  if (!fields.fecha) nextErrors.fecha = 'La fecha es obligatoria.';
  if (!fields.descripcion.trim()) nextErrors.descripcion = 'La descripcion es obligatoria.';
  return nextErrors;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const omitError = (
  errors: IncidentFormErrors,
  field: keyof IncidentFormErrors,
): IncidentFormErrors =>
  Object.fromEntries(Object.entries(errors).filter(([key]) => key !== field));

export const useNewClassroomIncident = (onSuccess: () => void) => {
  const [fields, setFields] = useState<IncidentFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<IncidentFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedSearchTermRef = useRef('');
  const {
    selectedStudent,
    studentResults,
    isSearchingStudents,
    studentSearchError,
    searchStudents,
    selectStudent,
    clearStudentResults,
  } = useSearchClassroomStudent();

  useEffect(() => {
    const normalizedSearch = searchTerm.trim();
    if (normalizedSearch.length < 2) {
      clearStudentResults();
      return;
    }

    if (normalizedSearch === selectedSearchTermRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void searchStudents(normalizedSearch);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clearStudentResults, searchStudents, searchTerm]);

  const clearError = (field: keyof IncidentFormErrors) => {
    setErrors((current) => omitError(current, field));
  };

  const handleChange = (field: keyof IncidentFormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    if (field !== 'curso_grupo') {
      clearError(field);
    }
  };

  const handleSearchChange = (text: string) => {
    selectedSearchTermRef.current = '';
    setSearchTerm(text);
    setIsDropdownOpen(text.trim().length >= 2);
    setFields((current) => ({ ...current, estudiante_id: '', curso_grupo: '' }));
    clearError('estudiante_id');
  };

  const handleSelectStudent = (student: StudentSearchResult) => {
    selectedSearchTermRef.current = student.nombre;
    setSearchTerm(student.nombre);
    setFields((current) => ({
      ...current,
      estudiante_id: String(student.id),
      curso_grupo: student.grado_nombre,
    }));
    setIsDropdownOpen(false);
    clearError('estudiante_id');
    selectStudent(student);
  };

  const handleSubmit = async (): Promise<void> => {
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await createIncident({
        estudiante_id: Number(fields.estudiante_id),
        tipo_incidencia: fields.tipo_incidencia as TipoIncidencia,
        descripcion: fields.descripcion.trim(),
        fecha: new Date(`${fields.fecha}T00:00:00`).toISOString(),
      });
      reset();
      onSuccess();
    } catch (err) {
      setErrors({ general: getErrorMessage(err, 'Error al registrar la incidencia.') });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFields(INITIAL_FIELDS());
    setErrors({});
    setSearchTerm('');
    setIsDropdownOpen(false);
    selectedSearchTermRef.current = '';
    clearStudentResults();
  };

  return {
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
  };
};
