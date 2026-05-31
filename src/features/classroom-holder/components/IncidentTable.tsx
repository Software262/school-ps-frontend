import type { Incidencia } from '../model/types';
import './IncidentTable.css';

interface Props {
  incidencias: Incidencia[];
  onResolve: (id: number) => void;
}

export const IncidentTable = ({ incidencias, onResolve }: Props) => {
  if (incidencias.length === 0) {
    return <div className="p-8 text-center text-gray-500 bg-white rounded-lg border">No hay incidencias registradas.</div>;
  }

  return (
    <div className="incident-table-wrapper">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="incident-table-th">Código</th>
            <th className="incident-table-th">Estudiante</th>
            <th className="incident-table-th">Tipo</th>
            <th className="incident-table-th">Descripción</th>
            <th className="incident-table-th">Fecha</th>
            <th className="incident-table-th">Estado</th>
          </tr>
        </thead>
        <tbody>
          {incidencias.map((inc) => (
            <tr key={inc.id} className="incident-table-tr">
              <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {`${new Date(inc.fecha).getFullYear()}${String(inc.id).padStart(3, '0')}`}
              </td>
              <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Estudiante #{inc.estudiante_id}
              </td>
              <td className="px-6 py-4 text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                {inc.tipo_incidencia.replace('_', ' ')}
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{inc.descripcion}</td>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {new Date(inc.fecha).toLocaleDateString('es-CO')}
              </td>
              <td className="px-6 py-4">
                {inc.esta_abierta ? (
                  <button onClick={() => onResolve(inc.id)} className="status-badge--pending">
                    Pendiente
                  </button>
                ) : (
                  <span className="status-badge--resolved">Resuelto</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};