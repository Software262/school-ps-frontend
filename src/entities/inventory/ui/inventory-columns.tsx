import { Badge } from '@/shared/ui';
import type { Inventory } from '../model/types';

export const INVENTORY_COLUMNS = [
  { key: 'nombre', label: 'NOMBRE' },
  { key: 'cantidad_total', label: 'TOTAL' },
  {
    key: 'stocks_disponible',
    label: 'DISPONIBLE',
    render: (_value: unknown, row: Inventory) => {
      const cantidad = row.stocks.find((s) => s.estado === 'disponible')?.cantidad ?? 0;
      return <Badge variant="green">{cantidad}</Badge>;
    },
  },
  {
    key: 'stocks_prestado',
    label: 'PRESTADO',
    render: (_value: unknown, row: Inventory) => {
      const cantidad = row.stocks.find((s) => s.estado === 'prestado')?.cantidad ?? 0;
      return <Badge variant="yellow">{cantidad}</Badge>;
    },
  },
  {
    key: 'stocks_mantenimiento',
    label: 'MANTENIMIENTO',
    render: (_value: unknown, row: Inventory) => {
      const cantidad = row.stocks.find((s) => s.estado === 'mantenimiento')?.cantidad ?? 0;
      return <Badge variant="gray">{cantidad}</Badge>;
    },
  },
  { key: 'observacion', label: 'OBSERVACIÓN' },
];
