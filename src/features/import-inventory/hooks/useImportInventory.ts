import { useState } from 'react';
import { downloadInventoryTemplate, importInventoryItems } from '../api/import-inventory';
import type { ImportItemsOutcome, TemplateFormat } from '../types';

const ACCEPTED_EXTENSIONS = ['.csv', '.xls', '.xlsx'];

const hasValidExtension = (name: string): boolean =>
  ACCEPTED_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

export const useImportInventory = (onSuccess: () => void, basePath?: string) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [outcome, setOutcome] = useState<ImportItemsOutcome | null>(null);

  const handleFileChange = (selected: File | null) => {
    setError(null);
    setOutcome(null);

    if (selected && !hasValidExtension(selected.name)) {
      setFile(null);
      setError('Formato no válido. Solo se aceptan archivos .csv, .xls o .xlsx.');
      return;
    }

    setFile(selected);
  };

  const submit = async (): Promise<void> => {
    if (!file) {
      setError('Selecciona un archivo para importar.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await importInventoryItems(file, basePath);
      setOutcome(result);
      // Aunque haya filas con error, las creadas/actualizadas ya se persistieron.
      if (result.result.created > 0 || result.result.updated > 0) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo importar el inventario.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (format: TemplateFormat = 'xlsx'): Promise<void> => {
    setDownloading(true);
    setError(null);
    try {
      await downloadInventoryTemplate(format, basePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo descargar la plantilla.');
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setOutcome(null);
    setLoading(false);
    setDownloading(false);
  };

  return {
    file,
    error,
    loading,
    downloading,
    outcome,
    handleFileChange,
    submit,
    downloadTemplate,
    reset,
  };
};
