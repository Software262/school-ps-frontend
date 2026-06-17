import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { useNewChessItem } from '../hooks/useNewChessItem';
import type { NewChessItemModalProps } from '../types';

export const NewChessItemModal = ({ isOpen, onClose, onSuccess }: NewChessItemModalProps) => {
  const { fields, errors, loading, handleChange, handleSubmit, reset } = useNewChessItem(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Artículo de Ajedrez" width={520}>
      <form
        className="item-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="if-nombre">
            Nombre del tablero <span aria-hidden="true">*</span>
          </label>
          <input
            id="if-nombre"
            type="text"
            className={`form-input ${errors.nombre ? 'form-input--error' : ''}`}
            placeholder="Ej: Tablero de ajedrez profesional"
            value={fields.nombre}
            onChange={(e) => {
              handleChange('nombre', e.target.value);
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
              handleChange('cantidad_total', e.target.value);
            }}
          />
          {errors.cantidad_total && (
            <span className="field-error" role="alert">
              {errors.cantidad_total}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="if-piezas">
            Número de piezas <span aria-hidden="true">*</span>
          </label>
          <input
            id="if-piezas"
            type="number"
            min={1}
            step={1}
            className={`form-input ${errors.piezas_totales ? 'form-input--error' : ''}`}
            placeholder="32"
            value={fields.piezas_totales}
            onChange={(e) => {
              handleChange('piezas_totales', e.target.value);
            }}
          />
          {errors.piezas_totales && (
            <span className="field-error" role="alert">
              {errors.piezas_totales}
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
            placeholder="Descripción o estado del tablero..."
            rows={3}
            value={fields.observacion}
            onChange={(e) => {
              handleChange('observacion', e.target.value);
            }}
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Crear Artículo'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
