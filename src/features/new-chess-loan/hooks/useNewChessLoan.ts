import { useState } from 'react';
import { createChessBorrow } from '../api/create-chess-loan';
import { searchStudents } from '../api/search-students';
import type { NewChessLoanFormFields, NewChessLoanFormErrors, StudentResult } from '../types';

const INITIAL_FIELDS = (): NewChessLoanFormFields => ({
  estudiante_id: '',
  observacion: '',
});

export const useNewChessLoan = (
  item: { id: number; nombre: string } | null,
  onSuccess: () => void,
  onClose: () => void,
) => {
  const [fields, setFields] = useState<NewChessLoanFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<NewChessLoanFormErrors>({});
  const [loading, setLoading] = useState(false);

  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [searchingStudents, setSearchingStudents] = useState(false);

  const handleStudentSearch = async (query: string) => {
    setStudentQuery(query);
    setSelectedStudent(null);
    setFields((prev) => ({ ...prev, estudiante_id: '' }));

    if (!query.trim()) {
      setStudentResults([]);
      return;
    }

    setSearchingStudents(true);

    try {
      const results = await searchStudents(query);
      setStudentResults(results);
    } catch {
      setStudentResults([]);
    } finally {
      setSearchingStudents(false);
    }
  };

  const handleSelectStudent = (student: StudentResult) => {
    setSelectedStudent(student);
    setStudentQuery(student.nombre);
    setStudentResults([]);
    setFields((prev) => ({ ...prev, estudiante_id: String(student.id) }));
  };

  const handleChange = (field: keyof NewChessLoanFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: NewChessLoanFormErrors = {};

    const estudianteNum = Number(fields.estudiante_id);
    if (!fields.estudiante_id || !Number.isInteger(estudianteNum) || estudianteNum <= 0) {
      next.estudiante_id = 'Selecciona un estudiante válido';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!item || !validate()) return;

    setLoading(true);
    try {
      const now = new Date();
      const fmt = (n: number) => n.toString().padStart(2, '0');
      const fecha_salida = [
        String(now.getFullYear()),
        '-',
        fmt(now.getMonth() + 1),
        '-',
        fmt(now.getDate()),
        'T',
        fmt(now.getHours()),
        ':',
        fmt(now.getMinutes()),
        ':',
        fmt(now.getSeconds()),
      ].join('');

      await createChessBorrow({
        inventario_id: item.id,
        estudiante_id: Number(fields.estudiante_id),
        fecha_salida,
        cantidad: 1,
        observacion: fields.observacion || undefined,
      });
      reset();
      onSuccess();
      onClose();
    } catch {
      setErrors({ general: 'No se pudo crear el préstamo. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFields(INITIAL_FIELDS());
    setErrors({});
    setStudentQuery('');
    setStudentResults([]);
    setSelectedStudent(null);
  };

  return {
    fields,
    errors,
    loading,
    studentQuery,
    studentResults,
    selectedStudent,
    searchingStudents,
    handleStudentSearch,
    handleSelectStudent,
    handleChange,
    handleSubmit,
    reset,
  };
};
