import { useCallback, useState } from 'react';
import { runWebcolegiosScraping } from '../api/run-webcolegios-scraping';
import type {
  WebcolegiosRobotStatus,
  WebcolegiosScrapingFormErrors,
  WebcolegiosScrapingFormFields,
  WebcolegiosScrapingRunMode,
  WebcolegiosScrapingRunResponse,
} from '../types';

const INITIAL_FIELDS: WebcolegiosScrapingFormFields = {
  url: '',
  usuario: '',
  contrasena: '',
};

const validateFields = (fields: WebcolegiosScrapingFormFields): WebcolegiosScrapingFormErrors => {
  const errors: WebcolegiosScrapingFormErrors = {};
  if (!fields.url.trim()) errors.url = 'La URL es obligatoria.';
  if (!fields.usuario.trim()) errors.usuario = 'El usuario es obligatorio.';
  if (!fields.contrasena.trim()) errors.contrasena = 'La contrasena es obligatoria.';
  return errors;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return 'No se pudo ejecutar el scraping de WebColegios.';
};

export const useRunWebcolegiosScraping = (onSuccess?: () => Promise<void> | void) => {
  const [fields, setFields] = useState<WebcolegiosScrapingFormFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<WebcolegiosScrapingFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [robotStatus, setRobotStatus] = useState<WebcolegiosRobotStatus>('no_connected');
  const [result, setResult] = useState<WebcolegiosScrapingRunResponse | null>(null);

  const handleChange = useCallback((field: keyof WebcolegiosScrapingFormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, general: undefined }));
  }, []);

  const run = useCallback(
    async (mode: WebcolegiosScrapingRunMode = 'full'): Promise<void> => {
      const validationErrors = validateFields(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setRobotStatus('no_connected');
        return;
      }

      setLoading(true);
      setErrors({});
      setResult(null);
      setRobotStatus('connecting');

      try {
        await Promise.resolve();
        setRobotStatus('running');
        const response = await runWebcolegiosScraping(
          {
            url: fields.url.trim(),
            usuario: fields.usuario.trim(),
            contrasena: fields.contrasena,
          },
          mode,
        );
        setRobotStatus('syncing');
        setResult(response);
        await onSuccess?.();
        setRobotStatus('finished');
      } catch (error) {
        setErrors({ general: getErrorMessage(error) });
        setRobotStatus('error');
      } finally {
        setFields((current) => ({ ...current, contrasena: '' }));
        setLoading(false);
      }
    },
    [fields, onSuccess],
  );

  return {
    fields,
    errors,
    loading,
    robotStatus,
    result,
    handleChange,
    run,
  };
};
