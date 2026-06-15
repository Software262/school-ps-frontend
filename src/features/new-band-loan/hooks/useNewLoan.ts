import { useState } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';
import { createLoan } from '../api/create-loan';
import { searchStudents } from '../api/search-students';
import type { FormFields, FormErrors, StudentResult } from '../types';

const toApiDatetime = (datetimeLocal: string): string => {
  const withSeconds = datetimeLocal.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
  return `${withSeconds}.000000`;
};

const nowLocal = (): string => {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
};

const INITIAL_FIELDS = (): FormFields => ({
  inventario_id: '',
  estudiante_id: '',
  fecha_salida: nowLocal(),
  cantidad: '1',
  observacion: '',
});

export const useNewLoan = (inventory: Inventory[], onSuccess: () => void) => {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const getDisponible = (item: (typeof inventory)[0]) =>
    item.stocks.find((s) => s.estado === 'disponible')?.cantidad ?? 0;

  const availableInventory = inventory.filter((i) => getDisponible(i) > 0);

  const selectedItem = availableInventory.find((i) => i.id === Number(fields.inventario_id));

  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [searchingStudents, setSearchingStudents] = useState(false);

  const handleStudentSearch = async (query: string) => {
    setStudentQuery(query);
    setSelectedStudent(null);
    handleChange('estudiante_id', '');

    if (!query.trim()) {
      setStudentResults([]);
      return;
    }

    setSearchingStudents(true);

    const params = new URLSearchParams();

    if (Number(query)) {
      params.append('documento', encodeURIComponent(query));
    } else {
      params.append('nombre', encodeURIComponent(query));
    }

    try {
      const results = await searchStudents(params.toString());
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
    handleChange('estudiante_id', String(student.id));
  };

  const handleChange = (field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!fields.inventario_id) {
      next.inventario_id = 'Selecciona un instrumento';
    }

    const estudianteNum = Number(fields.estudiante_id);
    if (!fields.estudiante_id || !Number.isInteger(estudianteNum) || estudianteNum <= 0) {
      next.estudiante_id = 'Ingresa un numero de documento o nombre de estudiante';
    }

    if (!fields.fecha_salida) {
      next.fecha_salida = 'Selecciona la fecha y hora de salida';
    }

    const cantidadNum = Number(fields.cantidad);
    if (!fields.cantidad || !Number.isInteger(cantidadNum) || cantidadNum <= 0) {
      next.cantidad = 'La cantidad debe ser un entero mayor a 0';
    } else if (selectedItem && cantidadNum > getDisponible(selectedItem)) {
      next.cantidad = `Máximo disponible: ${String(getDisponible(selectedItem))}`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createLoan({
        inventario_id: Number(fields.inventario_id),
        estudiante_id: Number(fields.estudiante_id),
        fecha_salida: toApiDatetime(fields.fecha_salida),
        cantidad: Number(fields.cantidad),
        observacion: fields.observacion,
      });
      reset();
      onSuccess();
    } catch {
      setErrors({
        general: 'No se pudo crear el préstamo. Verifica los datos e intenta de nuevo.',
      });
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

  const selectedItemDisponible = selectedItem ? getDisponible(selectedItem) : 0;

  return {
    fields,
    errors,
    loading,
    availableInventory,
    selectedItem,
    selectedItemDisponible,
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
