import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { useMaintenanceModal, type MaintenanceAction } from '@/shared/hooks/useMaintenanceModal';
import type { Inventory } from '@/entities/inventory/model/types';
import './MaintenanceModal.css';

interface MaintenanceModalProps {
  isOpen: boolean;
  inventory: Inventory[];
  itemLabel?: string;
  patchFn: (
    id: number,
    payload: {
      cantidad_total: number;
      cantidad_disponible: number;
      cantidad_prestado: number;
      cantidad_mantenimiento: number;
    },
  ) => Promise<unknown>;
  onClose: () => void;
  onSuccess: () => void;
}

const ACTIONS: { key: MaintenanceAction; label: string; icon: string }[] = [
  { key: 'send', label: 'Enviar a mantenimiento', icon: '↓' },
  { key: 'return', label: 'Devolver de mantenimiento', icon: '↑' },
];

export const MaintenanceModal = ({
  isOpen,
  inventory,
  itemLabel = 'Ítem',
  patchFn,
  onClose,
  onSuccess,
}: MaintenanceModalProps) => {
  const {
    action,
    inventarioId,
    cantidad,
    loading,
    error,
    filteredInventory,
    selectedItem,
    selectedDisponible,
    selectedPrestado,
    selectedMantenimiento,
    maxCantidad,
    handleActionChange,
    setInventarioId,
    setCantidad,
    handleSubmit,
    reset,
  } = useMaintenanceModal(inventory, patchFn, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Gestión de Mantenimiento" width={500}>
      <div className="maintenance-form">
        {/* Selector de acción */}
        <div className="maintenance-action-toggle">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              className={`maintenance-action-btn ${action === a.key ? 'active' : ''}`}
              onClick={() => {
                handleActionChange(a.key);
              }}
            >
              <span className="maintenance-action-icon">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Selector de ítem */}
        <div className="form-group">
          <label className="form-label" htmlFor="maint-item">
            {itemLabel} <span aria-hidden="true">*</span>
          </label>
          <select
            id="maint-item"
            className="form-select"
            value={inventarioId}
            onChange={(e) => {
              setInventarioId(e.target.value);
              setCantidad('1');
            }}
          >
            <option value="">— Seleccionar {itemLabel.toLowerCase()} —</option>
            {filteredInventory.map((item) => {
              const disp = item.stocks.find((s) => s.estado === 'disponible')?.cantidad ?? 0;
              const mant = item.stocks.find((s) => s.estado === 'mantenimiento')?.cantidad ?? 0;
              const relevant = action === 'send' ? disp : mant;
              return (
                <option key={item.id} value={item.id}>
                  {item.nombre} ({action === 'send' ? 'disponibles' : 'en mantenimiento'}:{' '}
                  {relevant})
                </option>
              );
            })}
          </select>
          {filteredInventory.length === 0 && (
            <span className="field-hint">
              {action === 'send'
                ? 'No hay ítems con unidades disponibles.'
                : 'No hay ítems en mantenimiento.'}
            </span>
          )}
        </div>

        {/* Info del ítem seleccionado */}
        {selectedItem && (
          <div className="maintenance-item-info">
            <div className="maintenance-stock-row">
              <span className="stock-badge stock-green">Disponibles: {selectedDisponible}</span>
              <span className="stock-badge stock-yellow">Prestados: {selectedPrestado}</span>
              <span className="stock-badge stock-gray">Mantenimiento: {selectedMantenimiento}</span>
            </div>
            <div className="maintenance-total-row">
              Suma: {selectedDisponible + selectedPrestado + selectedMantenimiento} / Total:{' '}
              {selectedItem.cantidad_total}
            </div>
          </div>
        )}

        {/* Cantidad */}
        <div className="form-group">
          <label className="form-label" htmlFor="maint-cantidad">
            Cantidad a {action === 'send' ? 'enviar' : 'devolver'} <span aria-hidden="true">*</span>
          </label>
          <input
            id="maint-cantidad"
            type="number"
            min={1}
            max={maxCantidad || undefined}
            step={1}
            className="form-input"
            value={cantidad}
            onChange={(e) => {
              setCantidad(e.target.value);
            }}
            disabled={!selectedItem}
          />
          {selectedItem && <span className="field-hint">Máx. {maxCantidad}</span>}
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={loading || !selectedItem || filteredInventory.length === 0}
          >
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : action === 'send' ? (
              '↓ Enviar a mantenimiento'
            ) : (
              '↑ Devolver de mantenimiento'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
