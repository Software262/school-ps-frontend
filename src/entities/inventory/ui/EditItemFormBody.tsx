import type { EditItemFormFields, EditItemFormErrors } from '../model/edit-item-form';
import './ItemFormBody.css';

interface EditItemFormBodyProps {
  fields: EditItemFormFields;
  errors: EditItemFormErrors;
  onChange: (field: keyof EditItemFormFields, value: string) => void;
}

export const EditItemFormBody = ({ fields, errors, onChange }: EditItemFormBodyProps) => (
  <>
    <div className="form-group">
      <label className="form-label" htmlFor="eif-nombre">
        Nombre <span aria-hidden="true">*</span>
      </label>
      <input
        id="eif-nombre"
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

    <div className="form-group">
      <label className="form-label" htmlFor="eif-cantidad-total">
        Cantidad total
      </label>
      <input
        id="eif-cantidad-total"
        type="number"
        min={1}
        step={1}
        className={`form-input ${errors.cantidad_total ? 'form-input--error' : ''}`}
        placeholder={String(0)}
        value={fields.cantidad_total}
        onChange={(e) => {
          onChange('cantidad_total', e.target.value);
        }}
      />
      {errors.cantidad_total && (
        <span className="field-error" role="alert">
          {errors.cantidad_total}
        </span>
      )}
    </div>

    <div className="form-row form-row--stock">
      <div className="form-group">
        <label className="form-label" htmlFor="eif-disponible">
          Disponible
        </label>
        <input
          id="eif-disponible"
          type="number"
          min={0}
          step={1}
          className={`form-input ${errors.cantidad_disponible ? 'form-input--error' : ''}`}
          placeholder={String(0)}
          value={fields.cantidad_disponible}
          onChange={(e) => {
            onChange('cantidad_disponible', e.target.value);
          }}
        />
        {errors.cantidad_disponible && (
          <span className="field-error" role="alert">
            {errors.cantidad_disponible}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="eif-prestado">
          Prestado
        </label>
        <input
          id="eif-prestado"
          type="number"
          min={0}
          step={1}
          className="form-input"
          placeholder={String(0)}
          value={fields.cantidad_prestado}
          readOnly
          disabled
        />
        <span className="field-hint">Calculado según préstamos activos</span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="eif-mantenimiento">
          Mantenimiento
        </label>
        <input
          id="eif-mantenimiento"
          type="number"
          min={0}
          step={1}
          className={`form-input ${errors.cantidad_mantenimiento ? 'form-input--error' : ''}`}
          placeholder={String(0)}
          value={fields.cantidad_mantenimiento}
          onChange={(e) => {
            onChange('cantidad_mantenimiento', e.target.value);
          }}
        />
        {errors.cantidad_mantenimiento && (
          <span className="field-error" role="alert">
            {errors.cantidad_mantenimiento}
          </span>
        )}
      </div>
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="eif-observacion">
        Observación
      </label>
      <textarea
        id="eif-observacion"
        className="form-textarea"
        placeholder="Descripción o estado del ítem..."
        rows={3}
        value={fields.observacion}
        onChange={(e) => {
          onChange('observacion', e.target.value);
        }}
      />
    </div>
  </>
);
