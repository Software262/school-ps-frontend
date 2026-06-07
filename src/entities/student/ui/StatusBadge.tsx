import { Badge } from '@/shared/ui/atoms/Badge';

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  let variant: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
  let defaultLabel = status;

  if (status === 'paz_y_salvo' || status === 'solvente') {
    variant = 'green';
    defaultLabel = 'Paz y Salvo';
  } else if (status === 'parcial' || status === 'observacion') {
    variant = 'yellow';
    defaultLabel = status === 'parcial' ? 'Parcial' : 'Observación';
  } else if (status === 'sin_abono' || status === 'deudor' || status === 'pendiente') {
    variant = 'yellow';
    defaultLabel = 'Pendiente';
  } else if (status === 'sin_matricula') {
    variant = 'gray';
    defaultLabel = 'Sin Matrícula';
  } else if (status === 'no_paz_y_salvo') {
    variant = 'red';
    defaultLabel = 'No Paz y Salvo';
  }

  return <Badge variant={variant}>{label ?? defaultLabel}</Badge>;
};
