import { Link2, LockKeyhole, User } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import type {
  WebcolegiosScrapingFormErrors,
  WebcolegiosScrapingFormFields,
  WebcolegiosScrapingRunMode,
} from '../types';
import { RunWebcolegiosScrapingButton } from './RunWebcolegiosScrapingButton';

interface ScrapingRunPanelProps {
  fields: WebcolegiosScrapingFormFields;
  errors: WebcolegiosScrapingFormErrors;
  loading: boolean;
  onChange: (field: keyof WebcolegiosScrapingFormFields, value: string) => void;
  onRun: (mode: WebcolegiosScrapingRunMode) => Promise<void>;
}

export const ScrapingRunPanel = ({
  fields,
  errors,
  loading,
  onChange,
  onRun,
}: ScrapingRunPanelProps) => {
  const submitRun = (mode: WebcolegiosScrapingRunMode) => {
    void onRun(mode);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRun('full');
  };

  return (
    <section className="webcolegios-connection-card" aria-labelledby="webcolegios-form-title">
      <div className="webcolegios-section-header">
        <div>
          <h2 id="webcolegios-form-title">Scraping WebColegios</h2>
          <p>Trae estudiantes y docentes desde WebColegios.</p>
        </div>
      </div>

      <form className="webcolegios-form" onSubmit={handleSubmit}>
        <label className="webcolegios-field">
          <span>URL</span>
          <div className="webcolegios-input-shell">
            <Link2 aria-hidden="true" />
            <input
              autoComplete="url"
              disabled={loading}
              onChange={(event) => {
                onChange('url', event.target.value);
              }}
              placeholder="https://www.webcolegios.com/..."
              type="url"
              value={fields.url}
            />
          </div>
          {errors.url && <small>{errors.url}</small>}
        </label>

        <label className="webcolegios-field">
          <span>Usuario</span>
          <div className="webcolegios-input-shell">
            <User aria-hidden="true" />
            <input
              autoComplete="username"
              disabled={loading}
              onChange={(event) => {
                onChange('usuario', event.target.value);
              }}
              placeholder="Usuario administrativo"
              type="text"
              value={fields.usuario}
            />
          </div>
          {errors.usuario && <small>{errors.usuario}</small>}
        </label>

        <label className="webcolegios-field">
          <span>Contraseña</span>
          <div className="webcolegios-input-shell">
            <LockKeyhole aria-hidden="true" />
            <input
              autoComplete="new-password"
              disabled={loading}
              onChange={(event) => {
                onChange('contrasena', event.target.value);
              }}
              placeholder="Contraseña"
              type="password"
              value={fields.contrasena}
            />
          </div>
          {errors.contrasena && <small>{errors.contrasena}</small>}
        </label>

        {errors.general && <div className="webcolegios-form-error">{errors.general}</div>}

        <div className="webcolegios-run-actions">
          <RunWebcolegiosScrapingButton label="Ejecutar scraping completo" loading={loading} />
          <RunWebcolegiosScrapingButton
            label="Solo estudiantes"
            loading={loading}
            onClick={() => {
              submitRun('students');
            }}
          />
          <RunWebcolegiosScrapingButton
            label="Solo docentes"
            loading={loading}
            onClick={() => {
              submitRun('teachers');
            }}
          />
        </div>
      </form>
    </section>
  );
};
