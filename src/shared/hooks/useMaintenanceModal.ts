import { useState } from 'react';
import type { Inventory } from '@/entities/inventory/model/types';

export type MaintenanceAction = 'send' | 'return';

interface MaintenancePayload {
  cantidad_total: number;
  cantidad_disponible: number;
  cantidad_prestado: number;
  cantidad_mantenimiento: number;
}

type PatchFn = (id: number, payload: MaintenancePayload) => Promise<unknown>;

const getStock = (item: Inventory, estado: string) =>
  item.stocks.find((s) => s.estado === estado)?.cantidad ?? 0;

export const useMaintenanceModal = (
  inventory: Inventory[],
  patchFn: PatchFn,
  onSuccess: () => void,
) => {
  const [action, setAction] = useState<MaintenanceAction>('send');
  const [inventarioId, setInventarioId] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredInventory = inventory.filter((i) =>
    action === 'send' ? getStock(i, 'disponible') > 0 : getStock(i, 'mantenimiento') > 0,
  );

  const selectedItem = filteredInventory.find((i) => i.id === Number(inventarioId));
  const selectedDisponible = selectedItem ? getStock(selectedItem, 'disponible') : 0;
  const selectedPrestado = selectedItem ? getStock(selectedItem, 'prestado') : 0;
  const selectedMantenimiento = selectedItem ? getStock(selectedItem, 'mantenimiento') : 0;
  const maxCantidad = action === 'send' ? selectedDisponible : selectedMantenimiento;

  const handleActionChange = (newAction: MaintenanceAction) => {
    setAction(newAction);
    setInventarioId('');
    setCantidad('1');
    setError(null);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedItem) {
      setError('Selecciona un ítem');
      return;
    }

    const n = Number(cantidad);
    if (!Number.isInteger(n) || n <= 0) {
      setError('La cantidad debe ser un entero positivo');
      return;
    }
    if (n > maxCantidad) {
      setError(`Máximo ${String(maxCantidad)} unidad${maxCantidad !== 1 ? 'es' : ''} disponibles`);
      return;
    }

    const newDisponible = action === 'send' ? selectedDisponible - n : selectedDisponible + n;
    const newMantenimiento =
      action === 'send' ? selectedMantenimiento + n : selectedMantenimiento - n;

    setLoading(true);
    setError(null);
    try {
      await patchFn(selectedItem.id, {
        cantidad_total: selectedItem.cantidad_total,
        cantidad_disponible: newDisponible,
        cantidad_prestado: selectedPrestado,
        cantidad_mantenimiento: newMantenimiento,
      });
      reset();
      onSuccess();
    } catch {
      setError('No se pudo actualizar el ítem. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAction('send');
    setInventarioId('');
    setCantidad('1');
    setError(null);
  };

  return {
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
  };
};
