import type { ItemFormFields, ItemFormErrors } from '../model/item-form';
import './ItemFormBody.css';

export type ItemFormVariant = 'band' | 'sport' | 'chess';

interface VariantCopy {
  nameLabel: string;
  namePlaceholder: string;
  observacionPlaceholder: string;
}

const VARIANT_COPY: Record<ItemFormVariant, VariantCopy> = {
  band: {
    nameLabel: 'Nombre del instrumento',
    namePlaceholder: 'Ej: Guitarra eléctrica',
    observacionPlaceholder: 'Descripción o estado del instrumento...',
  },
  sport: {
    nameLabel: 'Nombre del equipo',
    namePlaceholder: 'Ej: Balón de fútbol',
    observacionPlaceholder: 'Descripción o estado del equipo...',
  },
  chess: {
    nameLabel: 'Nombre del tablero',
    namePlaceholder: 'Ej: Tablero de ajedrez profesional',
    observacionPlaceholder: 'Descripción o estado del tablero...',
  },
};

interface ItemFormBodyProps {
  fields: ItemFormFields;
  errors: ItemFormErrors;
  onChange: (field: keyof ItemFormFields, value: string) => void;
  variant?: ItemFormVariant;
}

export const ItemFormBody = ({ fields, errors, onChange, variant = 'band' }: ItemFormBodyProps) => {
  const copy = VARIANT_COPY[variant];

  return (
    <>
      <div className="form-group">
        <label className="form-label" htmlFor="if-nombre">
          {copy.nameLabel} <span aria-hidden="true">*</span>
        </label>
        <input
          id="if-nombre"
          type="text"
          className={`form-input ${errors.nombre ? 'form-input--error' : ''}`}
          placeholder={copy.namePlaceholder}
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
        <label className="form-label" htmlFor="if-cantidad">
          Cantidad total <span aria-hidden="true">*</span>
        </label>
        <input
          id="if-cantidad"
          type="number"
          min={1}
          step={1}
          className={`form-input ${errors.cantidad_total ? 'form-input--error' : ''}`}
          placeholder="1"
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

      <div className="form-group">
        <label className="form-label" htmlFor="if-observacion">
          Observación
        </label>
        <textarea
          id="if-observacion"
          className="form-textarea"
          placeholder={copy.observacionPlaceholder}
          rows={3}
          value={fields.observacion}
          onChange={(e) => {
            onChange('observacion', e.target.value);
          }}
        />
      </div>
    </>
  );
};
