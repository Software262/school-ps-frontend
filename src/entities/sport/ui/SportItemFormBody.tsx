import type { SportItemFormFields, SportItemFormErrors } from '../model/sport-item-form';
import { ESTADO_OBJETO_OPTIONS } from '../model/sport-item-form';
import './SportItemFormBody.css';

interface SportItemFormBodyProps {
  fields: SportItemFormFields;
  errors: SportItemFormErrors;
  onChange: (field: keyof SportItemFormFields, value: string) => void;
}

export const SportItemFormBody = ({ fields, errors, onChange }: SportItemFormBodyProps) => (
  <>
    <div className="form-group">
      <label className="form-label" htmlFor="sf-nombre">
        Nombre <span aria-hidden="true">*</span>
      </label>
      <input
        id="sf-nombre"
        type="text"
        className={`form-input ${errors.nombre ? 'form-input--error' : ''}`}
        placeholder="Ej: Balón de fútbol"
        value={fields.nombre}
        onChange={(e) => {
          onChange('nombre', e.target.value);
        }}
      />
      {errors.nombre && (
        <span className="field-error" role="alert">
          {errors.nombre}
        </span>
      )}
    </div>

    <div className="form-row">
      <div className="form-group">
        <label className="form-label" htmlFor="sf-cantidad">
          Cantidad <span aria-hidden="true">*</span>
        </label>
        <input
          id="sf-cantidad"
          type="number"
          min={0}
          step={1}
          className={`form-input ${errors.cantidad ? 'form-input--error' : ''}`}
          placeholder="0"
          value={fields.cantidad}
          onChange={(e) => {
            onChange('cantidad', e.target.value);
          }}
        />
        {errors.cantidad && (
          <span className="field-error" role="alert">
            {errors.cantidad}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="sf-estado">
          Estado <span aria-hidden="true">*</span>
        </label>
        <select
          id="sf-estado"
          className={`form-select ${errors.estado_objeto ? 'form-select--error' : ''}`}
          value={fields.estado_objeto}
          onChange={(e) => {
            onChange('estado_objeto', e.target.value);
          }}
        >
          <option value="">— Seleccionar estado —</option>
          {ESTADO_OBJETO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.estado_objeto && (
          <span className="field-error" role="alert">
            {errors.estado_objeto}
          </span>
        )}
      </div>
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="sf-observacion">
        Observación
      </label>
      <textarea
        id="sf-observacion"
        className="form-textarea"
        placeholder="Descripción o estado del equipo deportivo..."
        rows={3}
        value={fields.observacion}
        onChange={(e) => {
          onChange('observacion', e.target.value);
        }}
      />
    </div>
  </>
);
