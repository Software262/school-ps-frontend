import { useRef } from 'react';
import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { useImportInventory } from '../hooks/useImportInventory';
import { GENERIC_IMPORT_PRESET } from '../presets';
import type { ImportInventoryModalProps } from '../types';
import './ImportInventoryModal.css';

export const ImportInventoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Importar inventario',
  itemLabel = 'ítems',
  basePath,
  description = GENERIC_IMPORT_PRESET.description,
  columns = GENERIC_IMPORT_PRESET.columns,
}: ImportInventoryModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    file,
    error,
    loading,
    downloading,
    outcome,
    handleFileChange,
    submit,
    downloadTemplate,
    reset,
  } = useImportInventory(onSuccess, basePath);

  const handleClose = () => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} width={560}>
      <form
        className="import-inventory-form"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        noValidate
      >
        <p className="import-inventory-help">{description}</p>

        <div className="import-inventory-columns">
          <span className="import-inventory-columns-title">
            Columnas del archivo de {itemLabel}
          </span>
          <ul className="import-inventory-columns-list">
            {columns.map((column) => (
              <li key={column.name}>
                <code>{column.name}</code>
                <span className="import-inventory-columns-badge">
                  {column.required ? 'obligatoria' : 'opcional'}
                </span>
                <span className="import-inventory-columns-desc">{column.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="import-inventory-template">
          <span>¿No tienes el archivo?</span>
          <button
            type="button"
            className="import-inventory-template-link"
            onClick={() => {
              void downloadTemplate('xlsx');
            }}
            disabled={downloading}
          >
            {downloading ? <Spinner size={14} /> : <Download size={14} aria-hidden="true" />}
            Descargar plantilla
          </button>
        </div>

        <label className="import-inventory-dropzone">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            disabled={loading}
            onChange={(e) => {
              handleFileChange(e.target.files?.[0] ?? null);
            }}
          />
          <FileSpreadsheet size={28} aria-hidden="true" />
          <span className="import-inventory-dropzone-text">
            {file ? file.name : 'Haz clic para seleccionar un archivo'}
          </span>
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        {outcome && (
          <div
            className={`import-inventory-result ${
              outcome.result.failed === 0 ? 'is-success' : 'is-partial'
            }`}
          >
            <p className="import-inventory-result-message">{outcome.message}</p>
            <div className="import-inventory-summary">
              <span className="import-inventory-chip is-created">
                {outcome.result.created} creados
              </span>
              <span className="import-inventory-chip is-updated">
                {outcome.result.updated} actualizados
              </span>
              <span className="import-inventory-chip is-failed">
                {outcome.result.failed} con error
              </span>
            </div>

            {outcome.result.errors.length > 0 && (
              <ul className="import-inventory-errors">
                {outcome.result.errors.map((rowError) => (
                  <li key={`${String(rowError.row)}-${rowError.nombre ?? ''}`}>
                    <strong>Fila {rowError.row}</strong>
                    {rowError.nombre ? ` (${rowError.nombre})` : ''}: {rowError.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            {outcome ? 'Cerrar' : 'Cancelar'}
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !file}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Importando…
              </>
            ) : (
              <>
                <Upload size={16} aria-hidden="true" /> Importar
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
