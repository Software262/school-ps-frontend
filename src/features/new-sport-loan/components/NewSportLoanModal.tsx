import { Modal } from '@/shared/ui';
import { Spinner } from '@/shared/ui';
import { useNewSportLoan } from '../hooks/useNewSportLoan';
import './NewSportLoanModal.css';
import type { NewSportLoanModalProps } from '../types';

export const NewSportLoanModal = ({
  isOpen,
  inventory,
  onClose,
  onSuccess,
}: NewSportLoanModalProps) => {
  const {
    fields,
    errors,
    loading,
    availableInventory,
    selectedItem,
    handleChange,
    handleSubmit,
    reset,
  } = useNewSportLoan(inventory, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Préstamo" width={540}>
      <form
        className="new-sport-loan-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {/* Error general del servidor */}
        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        {/* Instrumento */}
        <div className="form-group">
          <label className="form-label" htmlFor="nl-inventario">
            Instrumento <span aria-hidden="true">*</span>
          </label>
          <select
            id="nl-inventario"
            className={`form-select ${errors.inventario_id ? 'form-select--error' : ''}`}
            value={fields.inventario_id}
            onChange={(e) => {
              handleChange('inventario_id', e.target.value);
            }}
          >
            <option value="">— Seleccionar instrumento —</option>
            {availableInventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre} (disponibles: {item.cantidad})
              </option>
            ))}
          </select>
          {errors.inventario_id && (
            <span className="field-error" role="alert">
              {errors.inventario_id}
            </span>
          )}
          {availableInventory.length === 0 && (
            <span className="field-hint">No hay instrumentos disponibles en este momento.</span>
          )}
          {selectedItem && (
            <div className="selected-item-info">
              <span>✓</span>
              <span>
                <strong>{selectedItem.nombre}</strong> — {selectedItem.cantidad} unidad
                {selectedItem.cantidad !== 1 ? 'es' : ''} disponible
                {selectedItem.cantidad !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* ID Estudiante */}
        <div className="form-group">
          <label className="form-label" htmlFor="nl-estudiante">
            ID del Estudiante <span aria-hidden="true">*</span>
          </label>
          <input
            id="nl-estudiante"
            type="number"
            min={1}
            step={1}
            className={`form-input ${errors.estudiante_id ? 'form-input--error' : ''}`}
            placeholder="Ej: 42"
            value={fields.estudiante_id}
            onChange={(e) => {
              handleChange('estudiante_id', e.target.value);
            }}
          />
          {errors.estudiante_id && (
            <span className="field-error" role="alert">
              {errors.estudiante_id}
            </span>
          )}
        </div>

        {/* Fecha de salida + Cantidad (en fila) */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="nl-fecha">
              Fecha y hora de salida <span aria-hidden="true">*</span>
            </label>
            <input
              id="nl-fecha"
              type="datetime-local"
              className={`form-input ${errors.fecha_salida ? 'form-input--error' : ''}`}
              value={fields.fecha_salida}
              onChange={(e) => {
                handleChange('fecha_salida', e.target.value);
              }}
            />
            {errors.fecha_salida && (
              <span className="field-error" role="alert">
                {errors.fecha_salida}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nl-cantidad">
              Cantidad <span aria-hidden="true">*</span>
            </label>
            <input
              id="nl-cantidad"
              type="number"
              min={1}
              max={selectedItem?.cantidad}
              step={1}
              className={`form-input ${errors.cantidad ? 'form-input--error' : ''}`}
              value={fields.cantidad}
              onChange={(e) => {
                handleChange('cantidad', e.target.value);
              }}
            />
            {errors.cantidad ? (
              <span className="field-error" role="alert">
                {errors.cantidad}
              </span>
            ) : selectedItem ? (
              <span className="field-hint">Máx. {selectedItem.cantidad}</span>
            ) : null}
          </div>
        </div>

        {/* Observación */}
        <div className="form-group">
          <label className="form-label" htmlFor="nl-observacion">
            Observación
          </label>
          <textarea
            id="nl-observacion"
            className="form-textarea"
            placeholder="Notas adicionales sobre el préstamo..."
            rows={3}
            value={fields.observacion}
            onChange={(e) => {
              handleChange('observacion', e.target.value);
            }}
          />
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || availableInventory.length === 0}
          >
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Crear Préstamo'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
