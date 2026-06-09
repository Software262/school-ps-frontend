import { useCallback, useState } from 'react';
import { bulkLoadWebcolegios } from '../api/bulk-load-webcolegios';
import type {
  WebcolegiosManualLoadType,
  WebcolegiosManualRecord,
  WebcolegiosScrapingRunResponse,
} from '../types';

interface BulkLoadFields {
  tipo: WebcolegiosManualLoadType;
  jsonText: string;
}

type BulkLoadErrors = Partial<Record<keyof BulkLoadFields | 'general', string>>;

const INITIAL_FIELDS: BulkLoadFields = {
  tipo: 'estudiante',
  jsonText: '',
};

const isManualRecordArray = (value: unknown): value is WebcolegiosManualRecord[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item));

const parseRecords = (value: string): WebcolegiosManualRecord[] => {
  const parsed: unknown = JSON.parse(value);
  if (!isManualRecordArray(parsed)) {
    throw new Error('El JSON debe ser una lista de registros.');
  }
  if (parsed.length === 0) {
    throw new Error('La lista no puede estar vacia.');
  }
  return parsed;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return 'No se pudo ejecutar la carga masiva.';
};

export const useBulkLoadWebcolegios = (onSuccess?: () => Promise<void> | void) => {
  const [fields, setFields] = useState<BulkLoadFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<BulkLoadErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WebcolegiosScrapingRunResponse | null>(null);

  const handleChange = useCallback(
    <Field extends keyof BulkLoadFields>(field: Field, value: BulkLoadFields[Field]) => {
      setFields((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined, general: undefined }));
    },
    [],
  );

  const submit = useCallback(async (): Promise<void> => {
    if (!fields.jsonText.trim()) {
      setErrors({ jsonText: 'Pega una lista JSON para cargar.' });
      return;
    }

    setLoading(true);
    setErrors({});
    setResult(null);
    try {
      const records = parseRecords(fields.jsonText);
      const response = await bulkLoadWebcolegios({
        tipo: fields.tipo,
        datos: records,
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
