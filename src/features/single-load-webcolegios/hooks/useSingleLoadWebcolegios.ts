import { useCallback, useState } from 'react';
import { singleLoadWebcolegios } from '../api/single-load-webcolegios';
import type {
  WebcolegiosManualLoadType,
  WebcolegiosManualRecord,
  WebcolegiosScrapingRunResponse,
} from '../types';

export interface SingleLoadFields {
  tipo: WebcolegiosManualLoadType;
  documento: string;
  nombre: string;
  grado: string;
  curso: string;
  jornada: string;
  sede: string;
  titular: string;
  acudiente_nombre: string;
  acudiente_telefono: string;
  acudiente_correo: string;
  grado_titular: string;
  curso_titular: string;
  asignatura: string;
}

type SingleLoadErrors = Partial<Record<keyof SingleLoadFields | 'general', string>>;

const INITIAL_FIELDS: SingleLoadFields = {
  tipo: 'estudiante',
  documento: '',
  nombre: '',
  grado: '',
  curso: '',
  jornada: '',
  sede: '',
  titular: '',
  acudiente_nombre: '',
  acudiente_telefono: '',
  acudiente_correo: '',
  grado_titular: '',
  curso_titular: '',
  asignatura: '',
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return 'No se pudo ejecutar la carga individual.';
};

const cleanRecord = (record: Record<string, string>): WebcolegiosManualRecord => {
  const cleanedRecord: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    const trimmedValue = value.trim();
    if (trimmedValue.length > 0) {
      cleanedRecord[key] = trimmedValue;
    }
  }

  return cleanedRecord;
};

export const useSingleLoadWebcolegios = (onSuccess?: () => Promise<void> | void) => {
  const [fields, setFields] = useState<SingleLoadFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<SingleLoadErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WebcolegiosScrapingRunResponse | null>(null);

  const handleChange = useCallback(
    <Field extends keyof SingleLoadFields>(field: Field, value: SingleLoadFields[Field]) => {
      setFields((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined, general: undefined }));
    },
    [],
  );

  const submit = useCallback(async (): Promise<void> => {
    const validationErrors: SingleLoadErrors = {};
    if (!fields.documento.trim()) validationErrors.documento = 'El documento es obligatorio.';
    if (!fields.nombre.trim()) validationErrors.nombre = 'El nombre es obligatorio.';
    if (fields.tipo === 'estudiante' && !fields.grado.trim()) {
      validationErrors.grado = 'El grado es obligatorio.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const datos =
      fields.tipo === 'estudiante'
        ? cleanRecord({
            documento: fields.documento,
            nombre: fields.nombre,
            grado: fields.grado,
            curso: fields.curso,
            jornada: fields.jornada,
            sede: fields.sede,
            titular: fields.titular,
            acudiente_nombre: fields.acudiente_nombre,
            acudiente_telefono: fields.acudiente_telefono,
            acudiente_correo: fields.acudiente_correo,
          })
        : cleanRecord({
            documento: fields.documento,
            nombre: fields.nombre,
            grado_titular: fields.grado_titular,
            curso_titular: fields.curso_titular,
            asignatura: fields.asignatura,
          });

    setLoading(true);
    setErrors({});
    setResult(null);
    try {
      const response = await singleLoadWebcolegios({
        tipo: fields.tipo,
        datos,
      });
      setResult(response);
      await onSuccess?.();
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, [fields, onSuccess]);

  return {
    fields,
    errors,
    loading,
    result,
    handleChange,
    submit,
  };
};
