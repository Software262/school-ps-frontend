import type { SyntheticEvent } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { WebcolegiosScrapingResultSummary } from '@/features/run-webcolegios-scraping';
import { useSingleLoadWebcolegios } from '../hooks';
import type { SingleLoadFields } from '../hooks/useSingleLoadWebcolegios';
import type { WebcolegiosManualLoadType } from '../types';

interface SingleLoadPanelProps {
  onSuccess?: () => Promise<void> | void;
}

interface FieldInputProps {
  error?: string;
  label: string;
  name: keyof SingleLoadFields;
  onChange: (field: keyof SingleLoadFields, value: string) => void;
  value: string;
}

const FieldInput = ({ error, label, name, onChange, value }: FieldInputProps) => (
  <label className="webcolegios-field">
    <span>{label}</span>
    <input
      className="webcolegios-plain-input"
      onChange={(event) => {
        onChange(name, event.target.value);
      }}
      type="text"
      value={value}
    />
    {error && <small>{error}</small>}
  </label>
);

export const SingleLoadPanel = ({ onSuccess }: SingleLoadPanelProps) => {
  const { fields, errors, loading, result, handleChange, submit } =
    useSingleLoadWebcolegios(onSuccess);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <>
      <section className="webcolegios-connection-card" aria-labelledby="single-load-title">
        <div className="webcolegios-section-header">
          <div>
            <h2 id="single-load-title">Carga individual</h2>
            <p>Crea o corrige un registro puntual.</p>
          </div>
        </div>

        <form className="webcolegios-form" onSubmit={handleSubmit}>
          <label className="webcolegios-field">
            <span>Tipo</span>
            <select
              className="webcolegios-select"
              disabled={loading}
              onChange={(event) => {
                handleChange('tipo', event.target.value as WebcolegiosManualLoadType);
              }}
              value={fields.tipo}
            >
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </label>

          <div className="webcolegios-form-grid">
            <FieldInput
              error={errors.documento}
              label="Documento"
              name="documento"
              onChange={handleChange}
              value={fields.documento}
            />
            <FieldInput
              error={errors.nombre}
              label="Nombre"
              name="nombre"
              onChange={handleChange}
              value={fields.nombre}
            />

            {fields.tipo === 'estudiante' ? (
              <>
                <FieldInput
                  error={errors.grado}
                  label="Grado"
                  name="grado"
                  onChange={handleChange}
                  value={fields.grado}
                />
                <FieldInput
                  label="Curso"
                  name="curso"
                  onChange={handleChange}
                  value={fields.curso}
                />
                <FieldInput
                  label="Jornada"
                  name="jornada"
                  onChange={handleChange}
                  value={fields.jornada}
                />
                <FieldInput label="Sede" name="sede" onChange={handleChange} value={fields.sede} />
                <FieldInput
                  label="Titular"
                  name="titular"
                  onChange={handleChange}
                  value={fields.titular}
                />
                <FieldInput
                  label="Acudiente"
                  name="acudiente_nombre"
                  onChange={handleChange}
                  value={fields.acudiente_nombre}
                />
                <FieldInput
                  label="Telefono acudiente"
                  name="acudiente_telefono"
                  onChange={handleChange}
                  value={fields.acudiente_telefono}
                />
                <FieldInput
                  label="Correo acudiente"
                  name="acudiente_correo"
                  onChange={handleChange}
                  value={fields.acudiente_correo}
                />
              </>
            ) : (
              <>
                <FieldInput
                  label="Grado titular"
                  name="grado_titular"
                  onChange={handleChange}
                  value={fields.grado_titular}
                />
                <FieldInput
                  label="Curso titular"
                  name="curso_titular"
                  onChange={handleChange}
                  value={fields.curso_titular}
                />
                <FieldInput
                  label="Asignatura"
                  name="asignatura"
                  onChange={handleChange}
                  value={fields.asignatura}
                />
              </>
            )}
          </div>

          {errors.general && <div className="webcolegios-form-error">{errors.general}</div>}

          <button className="webcolegios-run-button" disabled={loading} type="submit">
            {loading ? (
              <LoaderCircle className="webcolegios-button-icon spinning" aria-hidden="true" />
            ) : (
              <Save className="webcolegios-button-icon" aria-hidden="true" />
            )}
            <span>{loading ? 'Guardando registro' : 'Guardar registro'}</span>
          </button>
        </form>
      </section>

      <WebcolegiosScrapingResultSummary result={result} />
    </>
  );
};
