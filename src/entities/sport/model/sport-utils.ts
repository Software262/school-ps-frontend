export type EstadoVariant = 'green' | 'yellow' | 'red' | 'gray';

export const getEstadoVariant = (estado: string): EstadoVariant => {
  switch (estado) {
    case 'disponible':
      return 'green';
    case 'prestado':
      return 'yellow';
    case 'mantenimiento':
      return 'gray';
    default:
      return 'gray';
  }
};

export const getEstadoLabel = (estado: string): string => {
  switch (estado) {
    case 'disponible':
      return 'Disponible';
    case 'prestado':
      return 'Prestado';
    case 'mantenimiento':
      return 'Mantenimiento';
    default:
      return estado;
  }
};