import { Badge } from '@/shared/ui';

export const SPORT_LOAN_COLUMNS = [
  {
    key: 'nombreEstudiante',
    label: 'NOMBRE DEL ESTUDIANTE',
  },
  {
    key: 'nombreInstrumento',
    label: 'NOMBRE DEL EQUIPO',
  },
  {
    key: 'cantidad',
    label: 'CANTIDAD',
  },
  {
    key: 'fechaPrestamo',
    label: 'FECHA PRÉSTAMO',
  },
  {
    key: 'fechaDevolucion',
    label: 'FECHA DEVOLUCIÓN',
    render: (value: unknown) => {
      const fecha = value as string | null;
      return fecha ?? <span className="text-secondary">Pendiente</span>;
    },
  },
  {
    key: 'enPrestamo',
    label: 'EN PRÉSTAMO',
    render: (value: unknown) => {
      const enPrestamo = Boolean(value);
      return <Badge variant={enPrestamo ? 'yellow' : 'green'}>{enPrestamo ? 'SÍ' : 'No'}</Badge>;
    },
  },
  {
    key: 'observacion',
    label: 'OBSERVACIÓN',
  },
];