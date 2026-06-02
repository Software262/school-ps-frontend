import type { ItemFormFields, ItemFormErrors } from '../model/item-form';
import { ESTADO_OBJETO_OPTIONS } from '../model/item-form';
import './ItemFormBody.css';

interface ItemFormBodyProps {
  fields: ItemFormFields;
  errors: ItemFormErrors;
  onChange: (field: keyof ItemFormFields, value: string) => void;
}

export const ItemFormBody = ({ fields, errors, onChange }: ItemFormBodyProps) => (
  <>
    <div className="form-group">
      <label className="form-label" htmlFor="if-nombre">
        Nombre <span aria-hidden="true">*</span>
      </label>
      <input
        id="if-nombre"
        type="text"
        className={`form-input ${errors.nombre ? 'form-input--error' : ''}`}
        placeholder="Ej: Guitarra eléctrica"
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
        <label className="form-label" htmlFor="if-cantidad">
          Cantidad <span aria-hidden="true">*</span>
        </label>
        <input
          id="if-cantidad"
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
        <label className="form-label" htmlFor="if-estado">
          Estado <span aria-hidden="true">*</span>
        </label>
        <select
          id="if-estado"
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
      <label className="form-label" htmlFor="if-observacion">
        Observación
      </label>
      <textarea
        id="if-observacion"
        className="form-textarea"
        placeholder="Descripción o estado del instrumento..."
        rows={3}
        value={fields.observacion}
        onChange={(e) => {
          onChange('observacion', e.target.value);
        }}
      />
    </div>
  </>
);
