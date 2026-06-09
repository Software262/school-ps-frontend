import type { SyntheticEvent } from 'react';
import { LoaderCircle, Upload } from 'lucide-react';
import { WebcolegiosScrapingResultSummary } from '@/features/run-webcolegios-scraping';
import { useBulkLoadWebcolegios } from '../hooks';
import type { WebcolegiosManualLoadType } from '../types';

interface BulkLoadPanelProps {
  onSuccess?: () => Promise<void> | void;
}

export const BulkLoadPanel = ({ onSuccess }: BulkLoadPanelProps) => {
  const { fields, errors, loading, result, handleChange, submit } =
    useBulkLoadWebcolegios(onSuccess);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <>
      <section className="webcolegios-connection-card" aria-labelledby="bulk-load-title">
        <div className="webcolegios-section-header">
          <div>
            <h2 id="bulk-load-title">Carga masiva</h2>
            <p>Permite cargar estudiantes o docentes con registros manuales.</p>
          </div>
        </div>

        <form className="webcolegios-form" onSubmit={handleSubmit}>
          <label className="webcolegios-field">
            <span>Tipo de carga</span>
            <select
              className="webcolegios-select"
              disabled={loading}
              onChange={(event) => {
                handleChange('tipo', event.target.value as WebcolegiosManualLoadType);
              }}
              value={fields.tipo}
            >
              <option value="estudiante">Estudiantes</option>
              <option value="docente">Docentes</option>
            </select>
          </label>

          <label className="webcolegios-field">
            <span>Registros JSON</span>
            <textarea
              className="webcolegios-textarea"
              disabled={loading}
              onChange={(event) => {
                handleChange('jsonText', event.target.value);
              }}
              placeholder='[{"documento":"1234567890","nombre":"JUAN PEREZ","grado":"Sexto","acudiente_nombre":"MARIA GOMEZ"}]'
              value={fields.jsonText}
            />
            {errors.jsonText && <small>{errors.jsonText}</small>}
          </label>

          {errors.general && <div className="webcolegios-form-error">{errors.general}</div>}

          <button className="webcolegios-run-button" disabled={loading} type="submit">
            {loading ? (
              <LoaderCircle className="webcolegios-button-icon spinning" aria-hidden="true" />
            ) : (
              <Upload className="webcolegios-button-icon" aria-hidden="true" />
            )}
            <span>{loading ? 'Cargando registros' : 'Ejecutar carga masiva'}</span>
          </button>
        </form>
      </section>

      <WebcolegiosScrapingResultSummary result={result} />
    </>
  );
};
