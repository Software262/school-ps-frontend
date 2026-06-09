import { LoaderCircle, Trash2 } from 'lucide-react';
import type { WebcolegiosScrapingHistoryItem } from '../types';

interface WebcolegiosErrorsTableProps {
  errorsList: WebcolegiosScrapingHistoryItem[];
  loading: boolean;
  clearing: boolean;
  error: string | null;
  onClear: () => Promise<void> | void;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getStateClass = (state: string): string => {
  if (state === 'ERROR') return 'is-error';
  if (state === 'PENDIENTE_DATOS') return 'is-pending';
  return 'is-muted';
};

const getRowKey = (item: WebcolegiosScrapingHistoryItem): string =>
  [String(item.id ?? item.documento_identidad), item.fecha_ingreso].join('-');

export const WebcolegiosErrorsTable = ({
  errorsList,
  loading,
  clearing,
  error,
  onClear,
}: WebcolegiosErrorsTableProps) => {
  const handleClear = () => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar los errores y pendientes de WebColegios?',
    );
    if (confirmed) {
      void onClear();
    }
  };

  return (
    <section className="webcolegios-history-panel" aria-labelledby="webcolegios-errors-title">
      <div className="webcolegios-section-header">
        <div>
          <h2 id="webcolegios-errors-title">Errores y pendientes</h2>
          <p>Registros que necesitan revision o correccion manual.</p>
        </div>
        <button
          className="webcolegios-clear-button"
          disabled={loading || clearing || errorsList.length === 0}
          onClick={handleClear}
          type="button"
        >
          {clearing ? (
            <LoaderCircle aria-hidden="true" className="webcolegios-button-icon spinning" />
          ) : (
            <Trash2 aria-hidden="true" className="webcolegios-button-icon" />
          )}
          <span>{clearing ? 'Eliminando' : 'Limpiar errores'}</span>
        </button>
      </div>

      {error && <div className="webcolegios-inline-error">{error}</div>}

      <div className="webcolegios-table-wrap">
        <table className="webcolegios-history-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Tipo entidad</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Observacion</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6}>Cargando errores...</td>
              </tr>
            )}
            {!loading && errorsList.length === 0 && (
              <tr>
                <td colSpan={6}>No hay errores ni pendientes recientes.</td>
              </tr>
            )}
            {!loading &&
              errorsList.map((item) => (
                <tr key={getRowKey(item)}>
                  <td>
                    <span className={`webcolegios-state-pill ${getStateClass(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>{item.tipo_entidad}</td>
                  <td>{item.documento_identidad.length > 0 ? item.documento_identidad : '-'}</td>
                  <td>{item.nombre && item.nombre.length > 0 ? item.nombre : '-'}</td>
                  <td>{item.observacion.length > 0 ? item.observacion : '-'}</td>
                  <td>{formatDate(item.fecha_ingreso)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
