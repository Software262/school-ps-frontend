import { Badge } from '@/shared/ui';
import { getEstadoVariant, getEstadoLabel } from '../model/inventory-utils';

export const INVENTORY_COLUMNS = [
  { key: 'nombre', label: 'NOMBRE' },
  { key: 'cantidad', label: 'CANTIDAD' },
  {
    key: 'estado_objeto',
    label: 'ESTADO',
    render: (value: unknown) => (
      <Badge variant={getEstadoVariant(String(value))}>{getEstadoLabel(String(value))}</Badge>
    ),
  },
  { key: 'observacion', label: 'OBSERVACIÓN' },
];
